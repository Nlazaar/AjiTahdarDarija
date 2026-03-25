import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GamificationService {
  constructor(private readonly prisma: PrismaService) {}

  private calcLevel(xp: number) {
    return Math.floor(xp / 1000) + 1;
  }

  async getFullProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, xp: true, level: true, streak: true, hearts: true, gemmes: true },
    });
    if (!user) throw new NotFoundException('User not found');
    const badges = await this.listBadges(userId);
    return { ...user, badges };
  }

  async addXp(userId: string, amount: number) {
    if (amount <= 0) return { xp: 0, level: 0, deltaLevel: 0 };
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const newXp    = user.xp + amount;
    const newLevel = this.calcLevel(newXp);
    const deltaLevel = newLevel - user.level;

    await this.prisma.user.update({ where: { id: userId }, data: { xp: newXp, level: newLevel } });
    return { xp: newXp, level: newLevel, deltaLevel };
  }

  async updateStreak(userId: string, today: Date = new Date()) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const last = user.lastStreakAt;
    let newStreak = 1;

    if (last) {
      const diff = Math.floor((today.getTime() - new Date(last).getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 0) return { streak: user.streak, xpAwarded: 0, xp: user.xp, level: user.level };
      if (diff === 1) newStreak = user.streak + 1;
      // diff > 1 → reset to 1
    }

    const bonus = newStreak % 7 === 0 ? 100 : 0;
    const xpResult = await this.addXp(userId, 10 + bonus);
    await this.prisma.user.update({ where: { id: userId }, data: { streak: newStreak, lastStreakAt: today } });

    return { streak: newStreak, xpAwarded: 10 + bonus, xp: xpResult.xp, level: xpResult.level };
  }

  async adjustHearts(userId: string, delta: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const newHearts = Math.max(0, Math.min(5, user.hearts + delta));
    await this.prisma.user.update({ where: { id: userId }, data: { hearts: newHearts } });
    return { hearts: newHearts };
  }

  async listBadges(userId?: string) {
    const badges = await this.prisma.badge.findMany({ orderBy: { createdAt: 'asc' } });
    if (!userId) return badges;
    const userBadges = await this.prisma.userBadge.findMany({ where: { userId } });
    const owned = new Set(userBadges.map(ub => ub.badgeId));
    return badges.map(b => ({ ...b, awarded: owned.has(b.id) }));
  }
}
