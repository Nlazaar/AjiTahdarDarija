import { PrismaService } from '../prisma/prisma.service';
/** Événements trackés (funnel onboarding + rétention) */
export declare const ANALYTICS_EVENTS: {
    readonly WELCOME_COMPLETED: "welcome_completed";
    readonly REGISTER_SUCCESS: "register_success";
    readonly LOGIN_SUCCESS: "login_success";
    readonly LESSON_STARTED: "lesson_started";
    readonly LESSON_COMPLETED: "lesson_completed";
    readonly LESSON_FAILED: "lesson_failed";
    readonly EXERCISE_ANSWERED: "exercise_answered";
    readonly STREAK_UPDATED: "streak_updated";
    readonly STREAK_BROKEN: "streak_broken";
    readonly BADGE_EARNED: "badge_earned";
    readonly XP_GAINED: "xp_gained";
    readonly UPGRADE_PAGE_VIEWED: "upgrade_page_viewed";
    readonly PURCHASE_STARTED: "purchase_started";
    readonly PURCHASE_COMPLETED: "purchase_completed";
    readonly REVIEW_STARTED: "review_started";
    readonly CHATBOT_USED: "chatbot_used";
};
export type AnalyticsEventType = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];
export declare class AnalyticsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    logEvent(userId: string | null, type: AnalyticsEventType | string, payload?: Record<string, unknown>): Promise<void>;
    queryRecent(limit?: number): Promise<{
        id: string;
        createdAt: Date;
        type: string;
        payload: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string | null;
    }[]>;
    /** Statistiques funnel onboarding (pour dashboard admin) */
    funnelStats(): Promise<{
        welcomes: number;
        registers: number;
        firstLessons: number;
        purchases: number;
    }>;
}
