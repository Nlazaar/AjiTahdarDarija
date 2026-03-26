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
exports.GamificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let GamificationService = class GamificationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    calcLevel(xp) {
        return Math.floor(xp / 1000) + 1;
    }
    async getFullProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, xp: true, level: true, streak: true, hearts: true, gemmes: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const badges = await this.listBadges(userId);
        return { ...user, badges };
    }
    async addXp(userId, amount) {
        if (amount <= 0)
            return { xp: 0, level: 0, deltaLevel: 0 };
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const newXp = user.xp + amount;
        const newLevel = this.calcLevel(newXp);
        const deltaLevel = newLevel - user.level;
        await this.prisma.user.update({ where: { id: userId }, data: { xp: newXp, level: newLevel } });
        return { xp: newXp, level: newLevel, deltaLevel };
    }
    async updateStreak(userId, today = new Date()) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const last = user.lastStreakAt;
        let newStreak = 1;
        if (last) {
            const diff = Math.floor((today.getTime() - new Date(last).getTime()) / (1000 * 60 * 60 * 24));
            if (diff === 0)
                return { streak: user.streak, xpAwarded: 0, xp: user.xp, level: user.level };
            if (diff === 1)
                newStreak = user.streak + 1;
            // diff > 1 → reset to 1
        }
        const bonus = newStreak % 7 === 0 ? 100 : 0;
        const xpResult = await this.addXp(userId, 10 + bonus);
        await this.prisma.user.update({ where: { id: userId }, data: { streak: newStreak, lastStreakAt: today } });
        return { streak: newStreak, xpAwarded: 10 + bonus, xp: xpResult.xp, level: xpResult.level };
    }
    async adjustHearts(userId, delta) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const newHearts = Math.max(0, Math.min(5, user.hearts + delta));
        await this.prisma.user.update({ where: { id: userId }, data: { hearts: newHearts } });
        return { hearts: newHearts };
    }
    async listBadges(userId) {
        const badges = await this.prisma.badge.findMany({ orderBy: { createdAt: 'asc' } });
        if (!userId)
            return badges;
        const userBadges = await this.prisma.userBadge.findMany({ where: { userId } });
        const owned = new Set(userBadges.map(ub => ub.badgeId));
        return badges.map(b => ({ ...b, awarded: owned.has(b.id) }));
    }
};
exports.GamificationService = GamificationService;
exports.GamificationService = GamificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GamificationService);
