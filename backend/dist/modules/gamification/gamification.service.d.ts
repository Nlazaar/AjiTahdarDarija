import { PrismaService } from '../../prisma/prisma.service';
export declare class GamificationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private calcLevel;
    addXp(userId: string, amount: number): Promise<{
        xp: number;
        level: number;
        deltaLevel: number;
    }>;
    updateStreak(userId: string, today?: Date): Promise<{
        streak: number;
        xpAwarded: number;
        xp: number;
        level: number;
    }>;
    adjustHearts(userId: string, delta: number): Promise<{
        hearts: number;
    }>;
    listBadges(userId?: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        points: number;
        key: string;
        icon: string | null;
    }[]>;
}
