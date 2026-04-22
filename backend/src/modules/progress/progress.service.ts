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

  /**
   * Parcours géographique : pour chaque module publié du track demandé ayant
   * un cityKey dans cityInfo, renvoie la séquence ordonnée par canonicalOrder
   * + la ville "courante" (dernière leçon complétée → son module → sa ville).
   * DARIJA  → villes du Maroc ; MSA → villes du monde arabe.
   */
  async getJourney(userId: string, track: 'DARIJA' | 'MSA' | 'RELIGION' = 'DARIJA') {
    const modules = await this.prisma.module.findMany({
      where:   { track, isPublished: true },
      orderBy: { canonicalOrder: 'asc' },
      select:  { id: true, slug: true, canonicalOrder: true, cityInfo: true },
    });

    const route = modules
      .map(m => {
        const ci = (m.cityInfo ?? {}) as Record<string, unknown>;
        const cityKey = typeof ci.cityKey === 'string' ? ci.cityKey : null;
        return cityKey ? { moduleId: m.id, moduleSlug: m.slug, canonicalOrder: m.canonicalOrder, cityKey } : null;
      })
      .filter((x): x is { moduleId: string; moduleSlug: string; canonicalOrder: number; cityKey: string } => x !== null);

    const moduleIds = route.map(r => r.moduleId);

    // Leçons complétées par module (une leçon complétée → ville "visitée")
    const completed = await this.prisma.userProgress.findMany({
      where:   { userId, completed: true, lesson: { moduleId: { in: moduleIds } } },
      include: { lesson: { select: { moduleId: true } } },
      orderBy: { finishedAt: 'asc' },
    });

    const visitedModuleIds = new Set<string>();
    let lastModuleId: string | null = null;
    for (const p of completed) {
      if (p.lesson.moduleId) {
        visitedModuleIds.add(p.lesson.moduleId);
        lastModuleId = p.lesson.moduleId;
      }
    }

    const visitedCityKeys = route.filter(r => visitedModuleIds.has(r.moduleId)).map(r => r.cityKey);
    const currentCityKey  = lastModuleId
      ? route.find(r => r.moduleId === lastModuleId)?.cityKey ?? null
      : (route[0]?.cityKey ?? null);

    return { currentCityKey, visitedCityKeys, route };
  }
}
