import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    logEvent(userId: string | null, type: string, payload: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        type: string;
        payload: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    queryRecent(limit?: number): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        type: string;
        payload: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
}
