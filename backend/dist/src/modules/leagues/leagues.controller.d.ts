import { LeaguesService } from './leagues.service';
export declare class LeaguesController {
    private svc;
    constructor(svc: LeaguesService);
    me(req: any): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        points: number;
        league: string;
    }>;
    standings(league: string): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        points: number;
        league: string;
    }[]>;
    assign(req: any, league: string): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        points: number;
        league: string;
    }>;
}
