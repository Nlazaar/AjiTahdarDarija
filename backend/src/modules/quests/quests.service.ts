import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/* ── Quest definitions (static) ───────────────────────────────────────────── */
export const DAILY_QUEST_DEFS = [
  { key: 'xp_50',     icon: '⚡', label: 'Gagne 50 XP',                 target: 50, reward: 30  },
  { key: 'lessons_2', icon: '🎯', label: 'Termine 2 leçons',            target: 2,  reward: 40  },
  { key: 'streak',    icon: '🔥', label: 'Maintiens ta série',           target: 1,  reward: 20  },
  { key: 'score_90',  icon: '💯', label: 'Score ≥ 90 % dans 1 leçon',   target: 1,  reward: 50  },
];

function todayStr() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function currentYearMonth() {
  return new Date().toISOString().slice(0, 7); // YYYY-MM
}

@Injectable()
export class QuestsService {
  constructor(private readonly prisma: PrismaService) {}

  /* ── Ensure today's 4 quest rows exist ─────────────────────────────────── */
  private async ensureDailyQuests(userId: string, date: string) {
    for (const def of DAILY_QUEST_DEFS) {
      await this.prisma.dailyQuestProgress.upsert({
        where:  { userId_date_questKey: { userId, date, questKey: def.key } },
        update: {},
        create: { userId, date, questKey: def.key, current: 0, completed: false },
      });
    }
  }

  /* ── Ensure monthly row exists ──────────────────────────────────────────── */
  private async ensureMonthly(userId: string, yearMonth: string) {
    await this.prisma.monthlyQuestProgress.upsert({
      where:  { userId_yearMonth: { userId, yearMonth } },
      update: {},
      create: { userId, yearMonth, questsDone: 0, questsTarget: 30 },
    });
  }

  /* ── GET /quests ────────────────────────────────────────────────────────── */
  async getQuestState(userId: string) {
    const date       = todayStr();
    const yearMonth  = currentYearMonth();

    await this.ensureDailyQuests(userId, date);
    await this.ensureMonthly(userId, yearMonth);

    const dailyRows  = await this.prisma.dailyQuestProgress.findMany({ where: { userId, date } });
    const monthly    = await this.prisma.monthlyQuestProgress.findUnique({ where: { userId_yearMonth: { userId, yearMonth } } });

    // Merge with definitions for labels/icons
    const daily = DAILY_QUEST_DEFS.map(def => {
      const row = dailyRows.find(r => r.questKey === def.key);
      return {
        key:       def.key,
        icon:      def.icon,
        label:     def.label,
        target:    def.target,
        reward:    def.reward,
        current:   row?.current  ?? 0,
        completed: row?.completed ?? false,
        claimed:   !!row?.claimedAt,
      };
    });

    // Past months (badge history)
    const pastMonths = await this.prisma.monthlyQuestProgress.findMany({
      where:   { userId, completed: true, yearMonth: { not: yearMonth } },
      orderBy: { yearMonth: 'desc' },
      take:    6,
    });

    return { daily, monthly, pastMonths };
  }

  /* ── POST /quests/claim/:key ────────────────────────────────────────────── */
  async claimReward(userId: string, questKey: string) {
    const date      = todayStr();
    const yearMonth = currentYearMonth();
    const def       = DAILY_QUEST_DEFS.find(d => d.key === questKey);
    if (!def) throw new NotFoundException('Quest not found');

    const row = await this.prisma.dailyQuestProgress.findUnique({
      where: { userId_date_questKey: { userId, date, questKey } },
    });
    if (!row || !row.completed) throw new BadRequestException('Quest not completed');
    if (row.claimedAt)          throw new BadRequestException('Already claimed');

    // Mark as claimed
    await this.prisma.dailyQuestProgress.update({
      where: { userId_date_questKey: { userId, date, questKey } },
      data:  { claimedAt: new Date() },
    });

    // Award gemmes
    await this.prisma.user.update({
      where: { id: userId },
      data:  { gemmes: { increment: def.reward } },
    });

    // S'assurer que la row monthly existe avant l'incrément (la row ne se
    // crée que via ensureMonthly, qui n'est appelée que par getQuestState).
    // Si l'utilisateur claim sans avoir jamais ouvert la page /quests
    // pendant ce mois-ci, la row n'existerait pas et l'incrément serait
    // silencieusement skip → questsDone resterait à 0.
    await this.ensureMonthly(userId, yearMonth);

    // Increment monthly count
    const monthly = await this.prisma.monthlyQuestProgress.findUnique({
      where: { userId_yearMonth: { userId, yearMonth } },
    });
    let monthlyJustCompleted = false;
    if (monthly) {
      const newDone = monthly.questsDone + 1;
      const completed = newDone >= monthly.questsTarget;
      monthlyJustCompleted = completed && !monthly.completed;
      await this.prisma.monthlyQuestProgress.update({
        where: { userId_yearMonth: { userId, yearMonth } },
        data:  { questsDone: newDone, completed },
      });
      // If monthly quest just completed, award bonus
      if (monthlyJustCompleted) {
        await this.prisma.user.update({
          where: { id: userId },
          data:  { gemmes: { increment: 500 } },
        });
      }
    }

    return {
      success: true,
      gemmesEarned: def.reward + (monthlyJustCompleted ? 500 : 0),
      monthlyCompleted: monthlyJustCompleted,
    };
  }

  /* ── Called from LessonsService on submit ───────────────────────────────── */
  async updateProgress(userId: string, opts: {
    xpEarned:        number;
    lessonCompleted: boolean;
    score:           number;
  }) {
    const date = todayStr();
    await this.ensureDailyQuests(userId, date);

    const updates: Array<{ questKey: string; increment: number }> = [];

    if (opts.xpEarned > 0)       updates.push({ questKey: 'xp_50',     increment: opts.xpEarned });
    if (opts.lessonCompleted)     updates.push({ questKey: 'lessons_2', increment: 1 });
    if (opts.lessonCompleted)     updates.push({ questKey: 'streak',    increment: 1 });
    if (opts.score >= 90)         updates.push({ questKey: 'score_90',  increment: 1 });

    for (const { questKey, increment } of updates) {
      const def = DAILY_QUEST_DEFS.find(d => d.key === questKey);
      if (!def) continue;

      const row = await this.prisma.dailyQuestProgress.findUnique({
        where: { userId_date_questKey: { userId, date, questKey } },
      });
      if (!row || row.completed) continue;

      const newCurrent  = Math.min(row.current + increment, def.target);
      const nowComplete = newCurrent >= def.target;

      await this.prisma.dailyQuestProgress.update({
        where: { userId_date_questKey: { userId, date, questKey } },
        data:  { current: newCurrent, completed: nowComplete },
      });
    }
  }
}
