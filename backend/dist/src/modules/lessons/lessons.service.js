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
var LessonsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const quests_service_1 = require("../quests/quests.service");
let LessonsService = LessonsService_1 = class LessonsService {
    constructor(prisma, questsService) {
        this.prisma = prisma;
        this.questsService = questsService;
    }
    async findAll() {
        return this.prisma.lesson.findMany();
    }
    async listLanguages() {
        return this.prisma.language.findMany({ orderBy: { code: 'asc' } });
    }
    async listModulesForAdmin() {
        return this.prisma.module.findMany({
            orderBy: [{ level: 'asc' }, { title: 'asc' }],
            select: { id: true, slug: true, title: true, level: true, isPublished: true },
        });
    }
    async create(data) {
        if (!data.title?.trim())
            throw new common_1.BadRequestException('title is required');
        if (!data.languageId?.trim())
            throw new common_1.BadRequestException('languageId is required');
        return this.prisma.lesson.create({ data });
    }
    async update(id, data) {
        const existing = await this.prisma.lesson.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.BadRequestException('Lesson not found');
        return this.prisma.lesson.update({ where: { id }, data });
    }
    async softDelete(id) {
        const existing = await this.prisma.lesson.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.BadRequestException('Lesson not found');
        return this.prisma.lesson.update({
            where: { id },
            data: { isDeleted: true, isPublished: false },
        });
    }
    async hardDelete(id) {
        const existing = await this.prisma.lesson.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.BadRequestException('Lesson not found');
        await this.prisma.userProgress.deleteMany({ where: { lessonId: id } });
        await this.prisma.exercise.deleteMany({ where: { lessonId: id } });
        return this.prisma.lesson.delete({ where: { id } });
    }
    /**
     * Met à jour la séquence d'exercices d'une leçon (typologies + items vocab).
     * Stocke dans Lesson.content : { sequence: string[], itemIds: string[], mode?: 'lettre'|'mot' }
     * Préserve les autres clés de content déjà présentes.
     */
    async updateSequence(id, payload) {
        const lesson = await this.prisma.lesson.findUnique({ where: { id } });
        if (!lesson)
            throw new common_1.BadRequestException('Lesson not found');
        const prev = lesson.content ?? {};
        const next = {
            ...prev,
            ...(payload.sequence !== undefined ? { sequence: payload.sequence } : {}),
            ...(payload.itemIds !== undefined ? { itemIds: payload.itemIds } : {}),
            ...(payload.mode !== undefined ? { mode: payload.mode } : {}),
        };
        return this.prisma.lesson.update({ where: { id }, data: { content: next } });
    }
    async findBySlug(slug) {
        if (!slug)
            return null;
        return this.prisma.lesson.findUnique({ where: { slug } });
    }
    async findOne(id) {
        return this.prisma.lesson.findUnique({
            where: { id },
            include: { _count: { select: { exercises: true } } },
        });
    }
    async getExercises(lessonId) {
        return this.prisma.exercise.findMany({
            where: { lessonId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async getVocabulary(lessonId) {
        const exercises = await this.prisma.exercise.findMany({
            where: { lessonId, vocabularyId: { not: null } },
            include: { vocabulary: true },
            distinct: ['vocabularyId'],
        });
        const items = exercises
            .map(e => e.vocabulary)
            .filter((v) => !!v && v.isPublished);
        // Respecter l'ordre canonique stocké dans Lesson.content.vocabOrder (si présent)
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            select: { content: true },
        });
        const vo = lesson?.content?.vocabOrder;
        const order = Array.isArray(vo)
            ? vo.filter((s) => typeof s === 'string')
            : [];
        if (order.length === 0)
            return items;
        const indexOf = new Map(order.map((id, i) => [id, i]));
        return items.slice().sort((a, b) => {
            const ia = indexOf.has(a.id) ? indexOf.get(a.id) : Number.POSITIVE_INFINITY;
            const ib = indexOf.has(b.id) ? indexOf.get(b.id) : Number.POSITIVE_INFINITY;
            if (ia !== ib)
                return ia - ib;
            return a.createdAt.getTime() - b.createdAt.getTime();
        });
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
        // Update or create UserProgress (manual logic)
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
        // Award gemmes on lesson completion (score >= 60)
        const gemmesEarned = score >= 60 ? 15 : 0;
        if (gemmesEarned > 0) {
            await this.prisma.user.update({ where: { id: userId }, data: { gemmes: { increment: gemmesEarned } } });
        }
        // Update quest progress (fire-and-forget, don't block the response)
        this.questsService.updateProgress(userId, {
            xpEarned,
            lessonCompleted: score >= 60,
            score,
        }).catch(() => { });
        return {
            score,
            errors,
            xpEarned,
            gemmesEarned,
            progress: updatedProgress,
        };
    }
    // Public : uniquement les exos publiés (consommé par le player)
    async listAuthoredExercises(lessonId) {
        return this.prisma.lessonExercise.findMany({
            where: { lessonId, isPublished: true },
            orderBy: { order: 'asc' },
        });
    }
    // Admin : tous les exos (y compris brouillons)
    async listAuthoredExercisesAdmin(lessonId) {
        return this.prisma.lessonExercise.findMany({
            where: { lessonId },
            orderBy: { order: 'asc' },
        });
    }
    async createAuthoredExercise(lessonId, data) {
        const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        if (!data.typology || !LessonsService_1.KNOWN_TYPOLOGIES.has(data.typology)) {
            throw new common_1.BadRequestException(`typology must be one of ${[...LessonsService_1.KNOWN_TYPOLOGIES].join(', ')}`);
        }
        const order = typeof data.order === 'number'
            ? data.order
            : (await this.prisma.lessonExercise.count({ where: { lessonId } }));
        return this.prisma.lessonExercise.create({
            data: {
                lessonId,
                typology: data.typology,
                config: data.config ?? {},
                order,
            },
        });
    }
    async updateAuthoredExercise(lessonId, exId, data) {
        const existing = await this.prisma.lessonExercise.findFirst({ where: { id: exId, lessonId } });
        if (!existing)
            throw new common_1.NotFoundException('LessonExercise not found');
        if (data.typology && !LessonsService_1.KNOWN_TYPOLOGIES.has(data.typology)) {
            throw new common_1.BadRequestException(`typology must be one of ${[...LessonsService_1.KNOWN_TYPOLOGIES].join(', ')}`);
        }
        return this.prisma.lessonExercise.update({
            where: { id: exId },
            data: {
                ...(data.typology !== undefined ? { typology: data.typology } : {}),
                ...(data.config !== undefined ? { config: data.config } : {}),
                ...(typeof data.order === 'number' ? { order: data.order } : {}),
                ...(typeof data.isPublished === 'boolean' ? { isPublished: data.isPublished } : {}),
            },
        });
    }
    async deleteAuthoredExercise(lessonId, exId) {
        const existing = await this.prisma.lessonExercise.findFirst({ where: { id: exId, lessonId } });
        if (!existing)
            throw new common_1.NotFoundException('LessonExercise not found');
        await this.prisma.lessonExercise.delete({ where: { id: exId } });
        return { ok: true };
    }
    async reorderVocabulary(lessonId, orderedIds) {
        if (!Array.isArray(orderedIds))
            throw new common_1.BadRequestException('orderedIds must be an array');
        const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        const content = lesson.content ?? {};
        return this.prisma.lesson.update({
            where: { id: lessonId },
            data: { content: { ...content, vocabOrder: orderedIds } },
        });
    }
    async reorderAuthoredExercises(lessonId, orderedIds) {
        if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
            throw new common_1.BadRequestException('orderedIds must be a non-empty array');
        }
        const existing = await this.prisma.lessonExercise.findMany({
            where: { lessonId },
            select: { id: true },
        });
        const existingIds = new Set(existing.map(e => e.id));
        for (const id of orderedIds) {
            if (!existingIds.has(id))
                throw new common_1.BadRequestException(`exercise ${id} does not belong to this lesson`);
        }
        await this.prisma.$transaction(orderedIds.map((id, idx) => this.prisma.lessonExercise.update({ where: { id }, data: { order: idx } })));
        return this.listAuthoredExercises(lessonId);
    }
};
exports.LessonsService = LessonsService;
// ── Authored exercises (LessonExercise) ────────────────────────────────────
LessonsService.KNOWN_TYPOLOGIES = new Set([
    'FlashCard',
    'ChoixLettre',
    'AssocierLettres',
    'TrouverLesPaires',
    'EntendreEtChoisir',
    'VraiFaux',
    'DicterRomanisation',
    'NumeroterOrdre',
    'PlacerDansEtoile',
    'TexteReligieux',
    'SelectionImages',
    'TriDeuxCategories',
    'RelierParTrait',
]);
exports.LessonsService = LessonsService = LessonsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        quests_service_1.QuestsService])
], LessonsService);
