import { PrismaService } from '../prisma/prisma.service';
export declare class SyncService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    /**
     * payload: { userId, items: [{ lessonId, answers, clientUpdatedAt }] }
     * naive implementation: update or create UserProgress, add xp, mark finished
     */
    processSync(payload: any): Promise<{
        error: string;
        ok?: undefined;
        results?: undefined;
    } | {
        ok: boolean;
        results: any[];
        error?: undefined;
    }>;
}
