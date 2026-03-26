import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async completeLesson(userId: string, lessonId: string) {
    await this.prisma.userProgress.upsert({
      where:  { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, completed: true, progress: 100, xpEarned: 0, finishedAt: new Date() },
      update: { completed: true, progress: 100, finishedAt: new Date() },
    });
    return { ok: true };
  }

  async getUserProgress(userId: string) {
    const progresses = await this.prisma.userProgress.findMany({
      where: { userId },
      include: { lesson: { select: { id: true, title: true, moduleId: true, order: true } } },
      orderBy: { updatedAt: 'desc' },
    });

    const completedLessons = progresses.filter(p => p.completed).map(p => p.lessonId);
    const totalXpEarned    = progresses.reduce((sum, p) => sum + (p.xpEarned ?? 0), 0);

    return {
      completedLessons,
      totalXpEarned,
      progresses: progresses.map(p => ({
        lessonId:    p.lessonId,
        lessonTitle: p.lesson.title,
        moduleId:    p.lesson.moduleId,
        order:       p.lesson.order,
        completed:   p.completed,
        progress:    p.progress,
        xpEarned:    p.xpEarned,
        finishedAt:  p.finishedAt,
      })),
    };
  }
}
