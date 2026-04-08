import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { PrismaService } from '../../prisma/prisma.service'

/** Politique de rétention des données — RGPD */
const RETENTION_DAYS = 90

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name)

  constructor(private prisma: PrismaService) {}

  /** Toutes les nuits à 3h00 — purge les données > 90 jours */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async purgeOldData() {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - RETENTION_DAYS)

    try {
      const [analytics, messages] = await Promise.all([
        this.prisma.analyticsEvent.deleteMany({
          where: { createdAt: { lt: cutoff } },
        }),
        this.prisma.conversationMessage.deleteMany({
          where: { createdAt: { lt: cutoff } },
        }),
      ])

      this.logger.log(
        `[Cleanup] Purged ${analytics.count} analytics events + ${messages.count} conversation messages older than ${RETENTION_DAYS} days`,
      )
    } catch (err) {
      this.logger.error('[Cleanup] Purge failed', (err as Error)?.message ?? err)
    }
  }
}
