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
exports.LeaderboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let LeaderboardService = class LeaderboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async global(limit = 50) {
        return this.prisma.user.findMany({
            orderBy: { xp: 'desc' },
            take: limit,
            select: { id: true, name: true, xp: true, level: true, streak: true },
        });
    }
    async weekly(limit = 50) {
        const since = new Date();
        since.setDate(since.getDate() - 7);
        return this.prisma.user.findMany({
            where: { updatedAt: { gt: since } },
            orderBy: { xp: 'desc' },
            take: limit,
            select: { id: true, name: true, xp: true, level: true, streak: true },
        });
    }
    async friendsRanking(userId) {
        const accepted = await this.prisma.friendRequest.findMany({
            where: { status: 'accepted', OR: [{ fromId: userId }, { toId: userId }] },
        });
        const friendIds = accepted.map(r => r.fromId === userId ? r.toId : r.fromId);
        const ids = [userId, ...friendIds];
        return this.prisma.user.findMany({
            where: { id: { in: ids } },
            orderBy: { xp: 'desc' },
            select: { id: true, name: true, xp: true, level: true, streak: true },
        });
    }
};
exports.LeaderboardService = LeaderboardService;
exports.LeaderboardService = LeaderboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeaderboardService);
