import { GamificationService } from './gamification.service';
export declare class GamificationController {
    private readonly gamificationService;
    constructor(gamificationService: GamificationService);
    addXp(body: {
        userId: string;
        amount: number;
    }): Promise<{
        xp: number;
        level: number;
        deltaLevel: number;
    }>;
    streak(body: {
        userId: string;
        date?: string;
    }): Promise<{
        streak: number;
        xpAwarded: number;
        xp: number;
        level: number;
    }>;
    hearts(body: {
        userId: string;
        delta: number;
    }): Promise<{
        hearts: number;
    }>;
    badges(userId?: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        points: number;
        key: string;
        icon: string | null;
    }[]>;
}
