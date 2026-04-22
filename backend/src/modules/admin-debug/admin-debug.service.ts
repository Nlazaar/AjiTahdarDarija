import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Service admin pour reset complet / partiel du parcours d'un user.
 * Destiné à la phase de test : réinitialise progress, vies, streak, xp, gemmes,
 * quêtes, unlocks et vocabs appris.
 */
@Injectable()
export class AdminDebugService {
  constructor(private readonly prisma: PrismaService) {}

  /** Purge tout l'historique + stats de gamification d'un user. */
  async resetFullUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.$transaction([
      this.prisma.userProgress.deleteMany({ where: { userId } }),
      this.prisma.userVocabulary.deleteMany({ where: { userId } }),
      this.prisma.userBadge.deleteMany({ where: { userId } }),
      this.prisma.dailyQuestProgress.deleteMany({ where: { userId } }),
      this.prisma.monthlyQuestProgress.deleteMany({ where: { userId } }),
      this.prisma.userCulturalUnlock.deleteMany({ where: { userId } }),
      this.prisma.user.update({
        where: { id: userId },
        data: {
          xp: 0,
          level: 1,
          streak: 0,
          lastStreakAt: null,
          hearts: 5,
          gemmes: 0,
        },
      }),
    ]);

    return { ok: true, scope: 'full', userId };
  }

  /** Supprime le UserProgress lié à toutes les leçons d'un module donné. */
  async resetModule(userId: string, moduleId: string) {
    const mod = await this.prisma.module.findUnique({
      where: { id: moduleId },
      select: { id: true, lessons: { select: { id: true } } },
    });
    if (!mod) throw new NotFoundException('Module not found');

    const lessonIds = mod.lessons.map((l) => l.id);
    const res = await this.prisma.userProgress.deleteMany({
      where: { userId, lessonId: { in: lessonIds } },
    });

    return { ok: true, scope: 'module', moduleId, lessonsAffected: res.count };
  }

  /** Supprime le UserProgress d'une leçon précise. */
  async resetLesson(userId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const res = await this.prisma.userProgress.deleteMany({
      where: { userId, lessonId },
    });

    return { ok: true, scope: 'lesson', lessonId, deleted: res.count };
  }
}
