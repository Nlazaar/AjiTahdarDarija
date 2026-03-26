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
var SyncService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SyncService = SyncService_1 = class SyncService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SyncService_1.name);
    }
    /**
     * payload: { userId, items: [{ lessonId, answers, clientUpdatedAt }] }
     * naive implementation: update or create UserProgress, add xp, mark finished
     */
    async processSync(payload) {
        const results = [];
        const userId = payload.userId;
        if (!userId)
            return { error: 'missing userId' };
        for (const item of payload.items || []) {
            try {
                const lessonId = item.lessonId;
                const answers = item.answers || [];
                const score = (answers.filter((a) => a.correct).length);
                const xp = Math.max(0, Math.floor(score * 10));
                // upsert progress
                const existing = await this.prisma.userProgress.findUnique({ where: { userId_lessonId: { userId, lessonId } } }).catch(() => null);
                if (existing) {
                    const updated = await this.prisma.userProgress.update({ where: { id: existing.id }, data: { progress: 100, completed: true, xpEarned: (existing.xpEarned || 0) + xp, finishedAt: new Date() } });
                    results.push({ lessonId, status: 'updated', xp });
                }
                else {
                    const created = await this.prisma.userProgress.create({ data: { userId, lessonId, completed: true, progress: 100, xpEarned: xp } });
                    results.push({ lessonId, status: 'created', xp });
                }
                // increment user xp
                await this.prisma.user.update({ where: { id: userId }, data: { xp: { increment: xp } } }).catch(() => { });
            }
            catch (e) {
                this.logger.error('sync item failed', e);
                results.push({ lessonId: item.lessonId, status: 'error' });
            }
        }
        return { ok: true, results };
    }
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = SyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SyncService);
