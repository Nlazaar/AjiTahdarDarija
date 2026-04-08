import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

/** Événements trackés (funnel onboarding + rétention) */
export const ANALYTICS_EVENTS = {
  // Onboarding
  WELCOME_COMPLETED:   'welcome_completed',
  REGISTER_SUCCESS:    'register_success',
  LOGIN_SUCCESS:       'login_success',
  // Pédagogie
  LESSON_STARTED:      'lesson_started',
  LESSON_COMPLETED:    'lesson_completed',
  LESSON_FAILED:       'lesson_failed',
  EXERCISE_ANSWERED:   'exercise_answered',
  // Engagement
  STREAK_UPDATED:      'streak_updated',
  STREAK_BROKEN:       'streak_broken',
  BADGE_EARNED:        'badge_earned',
  XP_GAINED:           'xp_gained',
  // Monétisation
  UPGRADE_PAGE_VIEWED: 'upgrade_page_viewed',
  PURCHASE_STARTED:    'purchase_started',
  PURCHASE_COMPLETED:  'purchase_completed',
  // Rétention
  REVIEW_STARTED:      'review_started',
  CHATBOT_USED:        'chatbot_used',
} as const

export type AnalyticsEventType = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS]

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name)

  constructor(private prisma: PrismaService) {}

  async logEvent(userId: string | null, type: AnalyticsEventType | string, payload?: Record<string, unknown>) {
    try {
      await this.prisma.analyticsEvent.create({
        data: { userId: userId ?? null, type, payload: payload ?? {} },
      })
    } catch (err) {
      // Ne jamais bloquer le flux principal pour un échec d'analytics
      this.logger.warn(`Analytics event failed (${type}): ${(err as Error)?.message}`)
    }
  }

  async queryRecent(limit = 100) {
    return this.prisma.analyticsEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 500),
    })
  }

  /** Statistiques funnel onboarding (pour dashboard admin) */
  async funnelStats() {
    const [welcomes, registers, firstLessons, purchases] = await Promise.all([
      this.prisma.analyticsEvent.count({ where: { type: ANALYTICS_EVENTS.WELCOME_COMPLETED } }),
      this.prisma.analyticsEvent.count({ where: { type: ANALYTICS_EVENTS.REGISTER_SUCCESS } }),
      this.prisma.analyticsEvent.count({ where: { type: ANALYTICS_EVENTS.LESSON_COMPLETED } }),
      this.prisma.analyticsEvent.count({ where: { type: ANALYTICS_EVENTS.PURCHASE_COMPLETED } }),
    ])
    return { welcomes, registers, firstLessons, purchases }
  }
}
