import { PrismaService } from '../../prisma/prisma.service';
export declare class ProgressService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
}
