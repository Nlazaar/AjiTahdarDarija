import { GamificationService } from './gamification.service';
export declare class GamificationController {
    private readonly gamificationService;
    constructor(gamificationService: GamificationService);
    getProfile(req: any): Promise<{
        badges: {
            id: string;
            createdAt: Date;
            title: string;
            description: string | null;
            key: string;
            icon: string | null;
            points: number;
        }[];
        email: string;
        name: string;
        id: string;
        xp: number;
        level: number;
        streak: number;
        hearts: number;
        gemmes: number;
    }>;
    addXp(req: any, body: {
        amount: number;
    }): Promise<{
        xp: number;
        level: number;
        deltaLevel: number;
    }>;
    streak(req: any, body: {
        date?: string;
    }): Promise<{
        streak: number;
        xpAwarded: number;
        xp: number;
        level: number;
    }>;
    hearts(req: any, body: {
        delta: number;
    }): Promise<{
        hearts: number;
    }>;
    badges(userId?: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        key: string;
        icon: string | null;
        points: number;
    }[]>;
}
