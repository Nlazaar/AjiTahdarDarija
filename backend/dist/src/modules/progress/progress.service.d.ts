import { PrismaService } from '../../prisma/prisma.service';
export declare class ProgressService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    completeLesson(userId: string, lessonId: string): Promise<{
        ok: boolean;
    }>;
    getUserProgress(userId: string): Promise<{
        completedLessons: string[];
        totalXpEarned: number;
        progresses: {
            lessonId: string;
            lessonTitle: string;
            moduleId: string;
            order: number;
            completed: boolean;
            progress: number;
            xpEarned: number;
            finishedAt: Date;
        }[];
    }>;
    /**
     * Parcours Maroc : pour chaque module DARIJA publié ayant un cityKey dans
     * cityInfo, renvoie la séquence ordonnée par canonicalOrder + la ville
     * "courante" (dernière leçon complétée → son module → sa ville).
     */
    getJourney(userId: string): Promise<{
        currentCityKey: string;
        visitedCityKeys: string[];
        route: {
            moduleId: string;
            moduleSlug: string;
            canonicalOrder: number;
            cityKey: string;
        }[];
    }>;
}
