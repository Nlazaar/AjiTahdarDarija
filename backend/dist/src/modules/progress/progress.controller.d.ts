import { ProgressService } from './progress.service';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    me(req: any): Promise<{
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
    journey(req: any): Promise<{
        currentCityKey: string;
        visitedCityKeys: string[];
        route: {
            moduleId: string;
            moduleSlug: string;
            canonicalOrder: number;
            cityKey: string;
        }[];
    }>;
    complete(req: any, lessonId: string): Promise<{
        ok: boolean;
    }>;
}
