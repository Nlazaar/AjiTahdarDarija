import { PrismaService } from '../../prisma/prisma.service';
import { TTLCacheService } from '../../common/cache/ttl-cache.service';
export declare class LeaderboardService {
    private prisma;
    private cache;
    private readonly logger;
    constructor(prisma: PrismaService, cache: TTLCacheService);
    global(limit?: number): Promise<any[]>;
    weekly(limit?: number): Promise<any[]>;
    myRank(userId: string): Promise<{
        rank: number;
        xp: number;
    }>;
    friendsRanking(userId: string): Promise<{
        name: string;
        id: string;
        xp: number;
        level: number;
        streak: number;
    }[]>;
}
