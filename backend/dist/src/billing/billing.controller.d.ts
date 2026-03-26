import { BillingService } from './billing.service';
export declare class BillingController {
    private svc;
    constructor(svc: BillingService);
    createSession(req: any, body: {
        plan: 'monthly' | 'yearly' | 'free';
    }): Promise<{
        url: any;
    }>;
    webhook(req: any, res: any): Promise<void>;
    status(req: any): Promise<{
        subscriptionStatus: string;
        subscriptionExpiresAt: Date;
    } | {
        subscriptionStatus: string;
    }>;
}
