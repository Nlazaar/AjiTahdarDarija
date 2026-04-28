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
    if (amount <= 0) return { xp: 0, level: 0, deltaLevel: 0, badgesAwarded: [] as string[] };
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const newXp    = user.xp + amount;
    const newLevel = this.calcLevel(newXp);
    const deltaLevel = newLevel - user.level;

    await this.prisma.user.update({ where: { id: userId }, data: { xp: newXp, level: newLevel } });
    const badgesAwarded = await this.checkAndAwardBadges(userId);
    return { xp: newXp, level: newLevel, deltaLevel, badgesAwarded };
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
    await this.prisma.user.update({ where: { id: userId }, data: { streak: newStreak, lastStreakAt: today } });
    // addXp est appelé APRÈS le update du streak pour que checkAndAwardBadges
    // voie le streak à jour quand il évalue les conditions streak_*.
    const xpResult = await this.addXp(userId, 10 + bonus);

    return {
      streak: newStreak,
      xpAwarded: 10 + bonus,
      xp: xpResult.xp,
      level: xpResult.level,
      badgesAwarded: xpResult.badgesAwarded,
    };
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

  /**
   * Évalue les conditions de tous les badges pour un user et award ceux qui
   * sont remplis et pas encore obtenus. Idempotent (skipDuplicates sur le
   * unique constraint userId_badgeId).
   *
   * Appelée après tout événement qui peut faire bouger l'état du user :
   * complete leçon, gain XP, update streak, ajout d'amis, lesson submit.
   *
   * Le contexte optionnel permet de signaler des événements ponctuels
   * (ex: perfectLesson=true quand score=100 sur /lessons/:id/submit).
   */
  async checkAndAwardBadges(
    userId: string,
    ctx?: { perfectLesson?: boolean },
  ): Promise<string[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, streak: true },
    });
    if (!user) return [];

    // Leçons complétées + module info pour first_module / alphabet_done
    const progresses = await this.prisma.userProgress.findMany({
      where: { userId, completed: true },
      select: {
        lessonId: true,
        lesson: {
          select: {
            moduleId: true,
            module: { select: { slug: true, title: true } },
          },
        },
      },
    });

    const completedLessonsByModule = new Map<string, Set<string>>();
    const moduleMeta = new Map<string, { slug: string | null; title: string | null }>();
    for (const p of progresses) {
      const moduleId = p.lesson.moduleId;
      if (!moduleId) continue;
      if (!completedLessonsByModule.has(moduleId)) {
        completedLessonsByModule.set(moduleId, new Set());
      }
      completedLessonsByModule.get(moduleId)!.add(p.lessonId);
      moduleMeta.set(moduleId, {
        slug: p.lesson.module?.slug ?? null,
        title: p.lesson.module?.title ?? null,
      });
    }

    // Nombre total de leçons par module (pour détecter "module complet")
    const completedModules = new Set<string>();
    let alphabetCompleted = false;
    if (completedLessonsByModule.size > 0) {
      const moduleIds = Array.from(completedLessonsByModule.keys());
      const totals = await this.prisma.lesson.groupBy({
        by: ['moduleId'],
        where: { moduleId: { in: moduleIds } },
        _count: { _all: true },
      });
      for (const t of totals) {
        if (!t.moduleId) continue;
        const completedCount = completedLessonsByModule.get(t.moduleId)?.size ?? 0;
        if (completedCount === t._count._all && t._count._all > 0) {
          completedModules.add(t.moduleId);
          const meta = moduleMeta.get(t.moduleId);
          const slug = (meta?.slug ?? '').toLowerCase();
          const title = (meta?.title ?? '').toLowerCase();
          if (slug.includes('alphabet') || title.includes('alphabet')) {
            alphabetCompleted = true;
          }
        }
      }
    }

    // Friends (accepted both ways)
    const friendsCount = await this.prisma.friendRequest.count({
      where: {
        status: 'accepted',
        OR: [{ fromId: userId }, { toId: userId }],
      },
    });

    // Conditions → keys candidats
    const candidates: string[] = [];
    if (progresses.length >= 1) candidates.push('first_lesson');
    if (completedModules.size >= 1) candidates.push('first_module');
    if (alphabetCompleted) candidates.push('alphabet_done');
    if (user.streak >= 3) candidates.push('streak_3');
    if (user.streak >= 7) candidates.push('streak_7');
    if (user.streak >= 30) candidates.push('streak_30');
    if (user.xp >= 100) candidates.push('xp_100');
    if (user.xp >= 500) candidates.push('xp_500');
    if (user.xp >= 1000) candidates.push('xp_1000');
    if (friendsCount >= 5) candidates.push('social_5');
    if (ctx?.perfectLesson) candidates.push('perfect_lesson');

    if (candidates.length === 0) return [];

    const badges = await this.prisma.badge.findMany({
      where: { key: { in: candidates } },
      select: { id: true, key: true },
    });
    if (badges.length === 0) return [];

    const owned = await this.prisma.userBadge.findMany({
      where: { userId, badgeId: { in: badges.map(b => b.id) } },
      select: { badgeId: true },
    });
    const ownedIds = new Set(owned.map(o => o.badgeId));

    const toAward = badges.filter(b => !ownedIds.has(b.id));
    if (toAward.length === 0) return [];

    await this.prisma.userBadge.createMany({
      data: toAward.map(b => ({ userId, badgeId: b.id })),
      skipDuplicates: true,
    });

    return toAward.map(b => b.key);
  }
}
