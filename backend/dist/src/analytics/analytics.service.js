"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = exports.ANALYTICS_EVENTS = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
/** Événements trackés (funnel onboarding + rétention) */
exports.ANALYTICS_EVENTS = {
    // Onboarding
    WELCOME_COMPLETED: 'welcome_completed',
    REGISTER_SUCCESS: 'register_success',
    LOGIN_SUCCESS: 'login_success',
    // Pédagogie
    LESSON_STARTED: 'lesson_started',
    LESSON_COMPLETED: 'lesson_completed',
    LESSON_FAILED: 'lesson_failed',
    EXERCISE_ANSWERED: 'exercise_answered',
    // Engagement
    STREAK_UPDATED: 'streak_updated',
    STREAK_BROKEN: 'streak_broken',
    BADGE_EARNED: 'badge_earned',
    XP_GAINED: 'xp_gained',
    // Monétisation
    UPGRADE_PAGE_VIEWED: 'upgrade_page_viewed',
    PURCHASE_STARTED: 'purchase_started',
    PURCHASE_COMPLETED: 'purchase_completed',
    // Rétention
    REVIEW_STARTED: 'review_started',
    CHATBOT_USED: 'chatbot_used',
};
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AnalyticsService_1.name);
    }
    async logEvent(userId, type, payload) {
        try {
            await this.prisma.analyticsEvent.create({
                data: { userId: userId ?? null, type, payload: payload ?? {} },
            });
        }
        catch (err) {
            // Ne jamais bloquer le flux principal pour un échec d'analytics
            this.logger.warn(`Analytics event failed (${type}): ${err?.message}`);
        }
    }
    async queryRecent(limit = 100) {
        return this.prisma.analyticsEvent.findMany({
            orderBy: { createdAt: 'desc' },
            take: Math.min(limit, 500),
        });
    }
    /** Statistiques funnel onboarding (pour dashboard admin) */
    async funnelStats() {
        const [welcomes, registers, firstLessons, purchases] = await Promise.all([
            this.prisma.analyticsEvent.count({ where: { type: exports.ANALYTICS_EVENTS.WELCOME_COMPLETED } }),
            this.prisma.analyticsEvent.count({ where: { type: exports.ANALYTICS_EVENTS.REGISTER_SUCCESS } }),
            this.prisma.analyticsEvent.count({ where: { type: exports.ANALYTICS_EVENTS.LESSON_COMPLETED } }),
            this.prisma.analyticsEvent.count({ where: { type: exports.ANALYTICS_EVENTS.PURCHASE_COMPLETED } }),
        ]);
        return { welcomes, registers, firstLessons, purchases };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
