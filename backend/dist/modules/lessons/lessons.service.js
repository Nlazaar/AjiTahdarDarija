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
exports.LessonsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let LessonsService = class LessonsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.lesson.findMany();
    }
    async findOne(id) {
        return this.prisma.lesson.findUnique({ where: { id } });
    }
    async getExercises(lessonId) {
        return this.prisma.exercise.findMany({ where: { lessonId } });
    }
    async create(data) {
        return this.prisma.lesson.create({ data });
    }
    async update(id, data) {
        return this.prisma.lesson.update({ where: { id }, data });
    }
    async remove(id) {
        return this.prisma.lesson.delete({ where: { id } });
    }
    /**
     * Submit answers for a lesson. Returns score, errors, xpEarned and updated progress.
     * Simple scoring: exact equality for answers; XP = sum(points) for correct answers.
     */
    async submit(lessonId, userId, answers) {
        if (!userId)
            throw new common_1.BadRequestException('userId is required');
        const exercises = await this.prisma.exercise.findMany({ where: { lessonId } });
        const total = exercises.length;
        const answerMap = new Map(answers.map(a => [a.exerciseId, a.answer]));
        let correctCount = 0;
        const errors = [];
        let xpEarned = 0;
        for (const ex of exercises) {
            const given = answerMap.get(ex.id);
            const expected = ex.answer;
            // simple comparison: stringify JSON for flexible structures
            const isCorrect = JSON.stringify(given) === JSON.stringify(expected);
            if (isCorrect) {
                correctCount++;
                xpEarned += ex.points ?? 0;
            }
            else {
                errors.push({ exerciseId: ex.id, expected, got: given });
            }
        }
        const score = total === 0 ? 0 : Math.round((correctCount / total) * 100);
        // Update or create UserProgress
        const upsert = await this.prisma.userProgress.upsert({
            where: { userId_lessonId: { userId, lessonId } },
            create: {
                userId,
                lessonId,
                completed: score === 100,
                progress: score,
                xpEarned: xpEarned,
            },
            update: {
                // keep max progress
                completed: score === 100 ? true : undefined,
                progress: score > undefined ? score : undefined,
                xpEarned: { increment: xpEarned },
                updatedAt: new Date(),
            },
        });
        // Note: Prisma doesn't allow conditional fields like above; do manual logic
        // Fetch existing progress and then update accordingly
        const existing = await this.prisma.userProgress.findUnique({ where: { userId_lessonId: { userId, lessonId } } });
        let updatedProgress;
        if (!existing) {
            updatedProgress = await this.prisma.userProgress.create({ data: { userId, lessonId, completed: score === 100, progress: score, xpEarned } });
        }
        else {
            const newProgress = Math.max(existing.progress ?? 0, score);
            updatedProgress = await this.prisma.userProgress.update({ where: { userId_lessonId: { userId, lessonId } }, data: { progress: newProgress, completed: newProgress === 100, xpEarned: existing.xpEarned + xpEarned } });
        }
        return {
            score,
            errors,
            xpEarned,
            progress: updatedProgress,
        };
    }
};
exports.LessonsService = LessonsService;
exports.LessonsService = LessonsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LessonsService);
