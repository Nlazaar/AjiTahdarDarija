import { LeaderboardService } from './leaderboard.service';
export declare class LeaderboardController {
    private svc;
    constructor(svc: LeaderboardService);
    global(limit?: string): Promise<any[]>;
    weekly(limit?: string): Promise<any[]>;
    myRank(req: any): Promise<{
        rank: number;
        xp: number;
    }>;
    friends(req: any): Promise<{
        name: string;
        id: string;
        xp: number;
        level: number;
        streak: number;
    }[]>;
}
