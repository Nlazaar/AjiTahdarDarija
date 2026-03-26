import { LeaderboardService } from './leaderboard.service';
export declare class LeaderboardController {
    private svc;
    constructor(svc: LeaderboardService);
    global(): Promise<{
        name: string;
        id: string;
        xp: number;
        level: number;
        streak: number;
    }[]>;
    weekly(): Promise<{
        name: string;
        id: string;
        xp: number;
        level: number;
        streak: number;
    }[]>;
    friends(req: any): Promise<{
        name: string;
        id: string;
        xp: number;
        level: number;
        streak: number;
    }[]>;
}
