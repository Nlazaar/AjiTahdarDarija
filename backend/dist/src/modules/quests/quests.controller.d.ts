import { QuestsService } from './quests.service';
export declare class QuestsController {
    private readonly questsService;
    constructor(questsService: QuestsService);
    getState(req: any): Promise<{
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
    claim(key: string, req: any): Promise<{
        success: boolean;
        gemmesEarned: number;
    }>;
}
