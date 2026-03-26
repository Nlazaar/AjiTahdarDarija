import { PrismaService } from '../../prisma/prisma.service';
export declare const DAILY_QUEST_DEFS: {
    key: string;
    icon: string;
    label: string;
    target: number;
    reward: number;
}[];
export declare class QuestsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private ensureDailyQuests;
    private ensureMonthly;
    getQuestState(userId: string): Promise<{
        daily: {
            key: string;
            icon: string;
            label: string;
            target: number;
            reward: number;
            current: number;
            completed: boolean;
            claimed: boolean;
        }[];
        monthly: {
            id: string;
            createdAt: Date;
            userId: string;
            completed: boolean;
            claimedAt: Date | null;
            yearMonth: string;
            questsDone: number;
            questsTarget: number;
        };
        pastMonths: {
            id: string;
            createdAt: Date;
            userId: string;
            completed: boolean;
            claimedAt: Date | null;
            yearMonth: string;
            questsDone: number;
            questsTarget: number;
        }[];
    }>;
    claimReward(userId: string, questKey: string): Promise<{
        success: boolean;
        gemmesEarned: number;
    }>;
    updateProgress(userId: string, opts: {
        xpEarned: number;
        lessonCompleted: boolean;
        score: number;
    }): Promise<void>;
}
