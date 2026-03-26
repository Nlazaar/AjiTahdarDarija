import { PrismaService } from '../../prisma/prisma.service';
export declare class LeaguesService {
    private prisma;
    constructor(prisma: PrismaService);
    getLeagueFor(userId: string): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        points: number;
        league: string;
    }>;
    getLeagueStandings(league: string, limit?: number): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        points: number;
        league: string;
    }[]>;
    assignLeague(userId: string, league: string): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        points: number;
        league: string;
    }>;
}
