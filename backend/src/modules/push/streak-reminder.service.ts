import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { OneSignalService } from './onesignal.service';

const HOURS_BEFORE_RISK = 20;       // alerter quand l'utilisateur n'a pas pratiqué depuis ≥ 20h
const MIN_HOURS_BETWEEN_NOTIFS = 18; // ne jamais relancer un même user avant 18h

@Injectable()
export class StreakReminderService {
  private readonly logger = new Logger(StreakReminderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly onesignal: OneSignalService,
  ) {}

  /** Toutes les heures — repère les streaks à risque et envoie un rappel push */
  @Cron(CronExpression.EVERY_HOUR)
  async checkStreaksAtRisk() {
    if (!this.onesignal.isConfigured()) return;

    const now = new Date();
    const riskCutoff = new Date(now.getTime() - HOURS_BEFORE_RISK * 3600 * 1000);
    const notifCooldown = new Date(now.getTime() - MIN_HOURS_BETWEEN_NOTIFS * 3600 * 1000);

    let users;
    try {
      users = await this.prisma.user.findMany({
        where: {
          isDeleted: false,
          streak: { gt: 0 },
          oneSignalSubId: { not: null },
          lastStreakAt: { lte: riskCutoff },
          OR: [
            { lastStreakNotifAt: null },
            { lastStreakNotifAt: { lte: notifCooldown } },
          ],
        },
        select: { id: true, name: true, streak: true, oneSignalSubId: true },
        take: 500,
      });
    } catch (err) {
      this.logger.error('[StreakReminder] Query failed', (err as Error)?.message ?? err);
      return;
    }

    if (users.length === 0) return;

    const subIds = users.map(u => u.oneSignalSubId!).filter(Boolean);
    const sample = users[0];
    const title = `🔥 Préserve ta série de ${sample.streak} jour${sample.streak > 1 ? 's' : ''} !`;
    const body = `Plus que quelques heures avant minuit. Une mini-leçon suffit ✨`;

    const result = await this.onesignal.send({
      subscriptionIds: subIds,
      title,
      body,
      url: 'https://aji-tahdar-darija.vercel.app/cours',
      data: { type: 'streak-reminder' },
    });

    if (result.ok) {
      this.logger.log(`[StreakReminder] Sent to ${subIds.length} users (${result.recipients} reachable)`);
      await this.prisma.user.updateMany({
        where: { id: { in: users.map(u => u.id) } },
        data: { lastStreakNotifAt: now },
      });
    } else {
      this.logger.warn(`[StreakReminder] Send failed: ${result.error}`);
    }
  }
}
