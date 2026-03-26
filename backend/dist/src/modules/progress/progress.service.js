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
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ProgressService = class ProgressService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserProgress(userId) {
        const progresses = await this.prisma.userProgress.findMany({
            where: { userId },
            include: { lesson: { select: { id: true, title: true, moduleId: true, order: true } } },
            orderBy: { updatedAt: 'desc' },
        });
        const completedLessons = progresses.filter(p => p.completed).map(p => p.lessonId);
        const totalXpEarned = progresses.reduce((sum, p) => sum + (p.xpEarned ?? 0), 0);
        return {
            completedLessons,
            totalXpEarned,
            progresses: progresses.map(p => ({
                lessonId: p.lessonId,
                lessonTitle: p.lesson.title,
                moduleId: p.lesson.moduleId,
                order: p.lesson.order,
                completed: p.completed,
                progress: p.progress,
                xpEarned: p.xpEarned,
                finishedAt: p.finishedAt,
            })),
        };
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProgressService);
