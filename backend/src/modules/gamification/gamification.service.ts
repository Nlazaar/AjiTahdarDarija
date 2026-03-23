import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GamificationService {
  constructor(private readonly prisma: PrismaService) {}

  // Simple level calculation: 1 level per 1000 XP
  private calcLevel(xp: number) {
    return Math.floor(xp / 1000) + 1;
  }

  async addXp(userId: string, amount: number) {
    if (amount <= 0) return { xp: 0, level: 0, deltaLevel: 0 };
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const newXp = user.xp + amount;
    const newLevel = this.calcLevel(newXp);
    const deltaLevel = newLevel - user.level;

    await this.prisma.user.update({ where: { id: userId }, data: { xp: newXp, level: newLevel } });

    return { xp: newXp, level: newLevel, deltaLevel };
  }

  async updateStreak(userId: string, today: Date = new Date()) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const last = user.lastStreakAt;
    let newStreak = 1;

    if (last) {
      const lastDate = new Date(last);
      const diff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        newStreak = user.streak + 1;
      } else if (diff === 0) {
        newStreak = user.streak; // same day, no change
      } else {
        newStreak = 1; // reset
      }
    }

    // Award small XP bonus per streak day (e.g., 10 XP per day, + bonus for milestones)
    const baseXp = 10;
    let bonus = 0;
    if (newStreak > 0 && newStreak % 7 === 0) bonus = 100; // weekly streak bonus

    const xpResult = await this.addXp(userId, baseXp + bonus);

    await this.prisma.user.update({ where: { id: userId }, data: { streak: newStreak, lastStreakAt: today } });

    return { streak: newStreak, xpAwarded: baseXp + bonus, xp: xpResult.xp, level: xpResult.level };
  }

  async adjustHearts(userId: string, delta: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const newHearts = Math.max(0, user.hearts + delta);
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
