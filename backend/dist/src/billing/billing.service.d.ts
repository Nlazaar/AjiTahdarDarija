import { PrismaService } from '../prisma/prisma.service';
export declare class BillingService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createCheckoutSession(userId: string | null, plan: 'monthly' | 'yearly' | 'free'): Promise<{
        url: any;
    }>;
    handleWebhook(payload: any, sig?: string): Promise<void>;
    getStatus(userId: string): Promise<{
        subscriptionStatus: string;
        subscriptionExpiresAt: Date;
    }>;
}
