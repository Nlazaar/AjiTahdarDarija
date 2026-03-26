import { PrismaService } from '../../prisma/prisma.service';
export declare class LeaderboardService {
    private prisma;
    constructor(prisma: PrismaService);
    global(limit?: number): Promise<{
        name: string;
        id: string;
        xp: number;
        level: number;
        streak: number;
    }[]>;
    weekly(limit?: number): Promise<{
        name: string;
        id: string;
        xp: number;
        level: number;
        streak: number;
    }[]>;
    friendsRanking(userId: string): Promise<{
        name: string;
        id: string;
        xp: number;
        level: number;
        streak: number;
    }[]>;
}
