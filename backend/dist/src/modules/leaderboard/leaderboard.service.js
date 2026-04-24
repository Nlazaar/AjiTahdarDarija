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
var LeaderboardService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const ttl_cache_service_1 = require("../../common/cache/ttl-cache.service");
const GLOBAL_TTL = 60; // 1 minute
const WEEKLY_TTL = 120; // 2 minutes
let LeaderboardService = LeaderboardService_1 = class LeaderboardService {
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
        this.logger = new common_1.Logger(LeaderboardService_1.name);
    }
    async global(limit = 50) {
        const key = `lb:global:${limit}`;
        const cached = this.cache.get(key);
        if (cached)
            return cached;
        const result = await this.prisma.user.findMany({
            orderBy: { xp: 'desc' },
            take: limit,
            select: { id: true, name: true, xp: true, level: true, streak: true },
        });
        this.cache.set(key, result, GLOBAL_TTL);
        return result;
    }
    async weekly(limit = 50) {
        const key = `lb:weekly:${limit}`;
        const cached = this.cache.get(key);
        if (cached)
            return cached;
        const since = new Date();
        since.setDate(since.getDate() - 7);
        const result = await this.prisma.user.findMany({
            where: { updatedAt: { gt: since } },
            orderBy: { xp: 'desc' },
            take: limit,
            select: { id: true, name: true, xp: true, level: true, streak: true },
        });
        this.cache.set(key, result, WEEKLY_TTL);
        return result;
    }
    async myRank(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { xp: true } });
        if (!user)
            return { rank: null, xp: 0 };
        const ahead = await this.prisma.user.count({ where: { xp: { gt: user.xp } } });
        return { rank: ahead + 1, xp: user.xp };
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
exports.LeaderboardService = LeaderboardService = LeaderboardService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ttl_cache_service_1.TTLCacheService])
], LeaderboardService);
