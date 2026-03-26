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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestsService = exports.DAILY_QUEST_DEFS = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
/* ── Quest definitions (static) ───────────────────────────────────────────── */
exports.DAILY_QUEST_DEFS = [
    { key: 'xp_50', icon: '⚡', label: 'Gagne 50 XP', target: 50, reward: 30 },
    { key: 'lessons_2', icon: '🎯', label: 'Termine 2 leçons', target: 2, reward: 40 },
    { key: 'streak', icon: '🔥', label: 'Maintiens ta série', target: 1, reward: 20 },
    { key: 'score_90', icon: '💯', label: 'Score ≥ 90 % dans 1 leçon', target: 1, reward: 50 },
];
function todayStr() {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}
function currentYearMonth() {
    return new Date().toISOString().slice(0, 7); // YYYY-MM
}
let QuestsService = class QuestsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    /* ── Ensure today's 4 quest rows exist ─────────────────────────────────── */
    async ensureDailyQuests(userId, date) {
        for (const def of exports.DAILY_QUEST_DEFS) {
            await this.prisma.dailyQuestProgress.upsert({
                where: { userId_date_questKey: { userId, date, questKey: def.key } },
                update: {},
                create: { userId, date, questKey: def.key, current: 0, completed: false },
            });
        }
    }
    /* ── Ensure monthly row exists ──────────────────────────────────────────── */
    async ensureMonthly(userId, yearMonth) {
        await this.prisma.monthlyQuestProgress.upsert({
            where: { userId_yearMonth: { userId, yearMonth } },
            update: {},
            create: { userId, yearMonth, questsDone: 0, questsTarget: 30 },
        });
    }
    /* ── GET /quests ────────────────────────────────────────────────────────── */
    async getQuestState(userId) {
        const date = todayStr();
        const yearMonth = currentYearMonth();
        await this.ensureDailyQuests(userId, date);
        await this.ensureMonthly(userId, yearMonth);
        const dailyRows = await this.prisma.dailyQuestProgress.findMany({ where: { userId, date } });
        const monthly = await this.prisma.monthlyQuestProgress.findUnique({ where: { userId_yearMonth: { userId, yearMonth } } });
        // Merge with definitions for labels/icons
        const daily = exports.DAILY_QUEST_DEFS.map(def => {
            const row = dailyRows.find(r => r.questKey === def.key);
            return {
                key: def.key,
                icon: def.icon,
                label: def.label,
                target: def.target,
                reward: def.reward,
                current: row?.current ?? 0,
                completed: row?.completed ?? false,
                claimed: !!row?.claimedAt,
            };
        });
        // Past months (badge history)
        const pastMonths = await this.prisma.monthlyQuestProgress.findMany({
            where: { userId, completed: true, yearMonth: { not: yearMonth } },
            orderBy: { yearMonth: 'desc' },
            take: 6,
        });
        return { daily, monthly, pastMonths };
    }
    /* ── POST /quests/claim/:key ────────────────────────────────────────────── */
    async claimReward(userId, questKey) {
        const date = todayStr();
        const yearMonth = currentYearMonth();
        const def = exports.DAILY_QUEST_DEFS.find(d => d.key === questKey);
        if (!def)
            throw new Error('Quest not found');
        const row = await this.prisma.dailyQuestProgress.findUnique({
            where: { userId_date_questKey: { userId, date, questKey } },
        });
        if (!row || !row.completed)
            throw new Error('Quest not completed');
        if (row.claimedAt)
            throw new Error('Already claimed');
        // Mark as claimed
        await this.prisma.dailyQuestProgress.update({
            where: { userId_date_questKey: { userId, date, questKey } },
            data: { claimedAt: new Date() },
        });
        // Award gemmes
        await this.prisma.user.update({
            where: { id: userId },
            data: { gemmes: { increment: def.reward } },
        });
        // Increment monthly count
        const monthly = await this.prisma.monthlyQuestProgress.findUnique({
            where: { userId_yearMonth: { userId, yearMonth } },
        });
        if (monthly) {
            const newDone = monthly.questsDone + 1;
            const completed = newDone >= monthly.questsTarget;
            await this.prisma.monthlyQuestProgress.update({
                where: { userId_yearMonth: { userId, yearMonth } },
                data: { questsDone: newDone, completed },
            });
            // If monthly quest just completed, award bonus
            if (completed && !monthly.completed) {
                await this.prisma.user.update({
                    where: { id: userId },
                    data: { gemmes: { increment: 500 } },
                });
            }
        }
        return { success: true, gemmesEarned: def.reward };
    }
    /* ── Called from LessonsService on submit ───────────────────────────────── */
    async updateProgress(userId, opts) {
        const date = todayStr();
        await this.ensureDailyQuests(userId, date);
        const updates = [];
        if (opts.xpEarned > 0)
            updates.push({ questKey: 'xp_50', increment: opts.xpEarned });
        if (opts.lessonCompleted)
            updates.push({ questKey: 'lessons_2', increment: 1 });
        if (opts.lessonCompleted)
            updates.push({ questKey: 'streak', increment: 1 });
        if (opts.score >= 90)
            updates.push({ questKey: 'score_90', increment: 1 });
        for (const { questKey, increment } of updates) {
            const def = exports.DAILY_QUEST_DEFS.find(d => d.key === questKey);
            if (!def)
                continue;
            const row = await this.prisma.dailyQuestProgress.findUnique({
                where: { userId_date_questKey: { userId, date, questKey } },
            });
            if (!row || row.completed)
                continue;
            const newCurrent = Math.min(row.current + increment, def.target);
            const nowComplete = newCurrent >= def.target;
            await this.prisma.dailyQuestProgress.update({
                where: { userId_date_questKey: { userId, date, questKey } },
                data: { current: newCurrent, completed: nowComplete },
            });
        }
    }
};
exports.QuestsService = QuestsService;
exports.QuestsService = QuestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuestsService);
