import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private svc;
    constructor(svc: AnalyticsService);
    track(req: any, body: {
        type: string;
        payload?: any;
    }): Promise<{
        ok: boolean;
    }>;
}
