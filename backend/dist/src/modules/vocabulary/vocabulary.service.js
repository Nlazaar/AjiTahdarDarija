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
exports.VocabularyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const AUDIO_DIR = path.join(process.cwd(), 'public', 'audio', 'vocab');
const ALLOWED_MIME = new Set(['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/wave']);
let VocabularyService = class VocabularyService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(params = {}) {
        const { languageId, lessonId, q, includeDrafts } = params;
        let vocabularyIds;
        let lessonVocabOrder = [];
        if (lessonId) {
            const exercises = await this.prisma.exercise.findMany({
                where: { lessonId, vocabularyId: { not: null } },
                select: { vocabularyId: true },
                distinct: ['vocabularyId'],
            });
            vocabularyIds = exercises.map(e => e.vocabularyId).filter((v) => !!v);
            // Récupérer l'ordre canonique stocké dans Lesson.content.vocabOrder (si présent)
            const lesson = await this.prisma.lesson.findUnique({
                where: { id: lessonId },
                select: { content: true },
            });
            const vo = lesson?.content?.vocabOrder;
            if (Array.isArray(vo))
                lessonVocabOrder = vo.filter((s) => typeof s === 'string');
        }
        const items = await this.prisma.vocabulary.findMany({
            where: {
                ...(languageId ? { languageId } : {}),
                ...(vocabularyIds ? { id: { in: vocabularyIds } } : {}),
                ...(q ? { word: { contains: q, mode: 'insensitive' } } : {}),
                ...(includeDrafts ? {} : { isPublished: true }),
            },
            orderBy: { createdAt: 'asc' },
        });
        if (lessonId && lessonVocabOrder.length > 0) {
            // Tri stable : items dans vocabOrder en premier (dans cet ordre), puis le reste par createdAt
            const indexOf = new Map(lessonVocabOrder.map((id, i) => [id, i]));
            items.sort((a, b) => {
                const ia = indexOf.has(a.id) ? indexOf.get(a.id) : Number.POSITIVE_INFINITY;
                const ib = indexOf.has(b.id) ? indexOf.get(b.id) : Number.POSITIVE_INFINITY;
                if (ia !== ib)
                    return ia - ib;
                return a.createdAt.getTime() - b.createdAt.getTime();
            });
        }
        return items;
    }
    async findOne(id) {
        const v = await this.prisma.vocabulary.findUnique({ where: { id } });
        if (!v)
            throw new common_1.NotFoundException('Vocabulary not found');
        return v;
    }
    /**
     * Retourne un item du jour, déterministe selon la date courante (UTC).
     * Choix dans le pool des items publiés (filtrage langue optionnel).
     */
    async daily(params = {}) {
        const items = await this.prisma.vocabulary.findMany({
            where: {
                isPublished: true,
                ...(params.languageId ? { languageId: params.languageId } : {}),
            },
            select: {
                id: true,
                word: true,
                transliteration: true,
                translation: true,
                audioUrl: true,
            },
            orderBy: { id: 'asc' }, // ordre stable pour le hash
        });
        if (items.length === 0)
            return null;
        const now = new Date();
        const dayKey = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
        let h = 5381;
        for (let i = 0; i < dayKey.length; i++) {
            h = ((h << 5) + h) ^ dayKey.charCodeAt(i);
        }
        const idx = Math.abs(h) % items.length;
        return items[idx];
    }
    async create(data) {
        if (!data.word?.trim())
            throw new common_1.BadRequestException('word is required');
        if (!data.languageId?.trim())
            throw new common_1.BadRequestException('languageId is required');
        return this.prisma.vocabulary.create({ data });
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.vocabulary.update({ where: { id }, data });
    }
    async remove(id) {
        await this.findOne(id);
        // Détacher des exercices puis supprimer (FK SetNull déjà câblé)
        return this.prisma.vocabulary.delete({ where: { id } });
    }
    /**
     * Sauvegarde un fichier audio uploadé (mp3/wav) sous public/audio/vocab/<sha>.mp3
     * et met à jour Vocabulary.audioUrl avec l'URL publique.
     */
    async saveAudio(id, file) {
        if (!file?.buffer?.length)
            throw new common_1.BadRequestException('Empty file');
        if (!ALLOWED_MIME.has(file.mimetype.toLowerCase())) {
            throw new common_1.BadRequestException(`Mime type non supporté: ${file.mimetype} (mp3/wav uniquement)`);
        }
        const vocab = await this.findOne(id);
        if (!fs.existsSync(AUDIO_DIR))
            fs.mkdirSync(AUDIO_DIR, { recursive: true });
        // Slug stable basé sur le mot + id pour éviter les collisions
        const slug = crypto.createHash('sha256').update(`${vocab.id}:${vocab.word}`).digest('hex').slice(0, 16);
        const ext = file.mimetype.includes('wav') ? 'wav' : 'mp3';
        const fileName = `${slug}.${ext}`;
        const fullPath = path.join(AUDIO_DIR, fileName);
        fs.writeFileSync(fullPath, file.buffer);
        const publicUrl = `/audio/vocab/${fileName}`;
        return this.prisma.vocabulary.update({
            where: { id },
            data: { audioUrl: publicUrl },
        });
    }
    /**
     * Lie un vocabulaire à une leçon en créant un Exercise minimal de type LISTENING
     * (ou retourne celui existant). Idempotent — ne crée pas de doublon.
     */
    async attachToLesson(vocabularyId, lessonId) {
        await this.findOne(vocabularyId);
        const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        const existing = await this.prisma.exercise.findFirst({
            where: { lessonId, vocabularyId },
        });
        if (existing)
            return existing;
        return this.prisma.exercise.create({
            data: { lessonId, vocabularyId, type: 'LISTENING', points: 10 },
        });
    }
    async detachFromLesson(vocabularyId, lessonId) {
        return this.prisma.exercise.deleteMany({ where: { lessonId, vocabularyId } });
    }
};
exports.VocabularyService = VocabularyService;
exports.VocabularyService = VocabularyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VocabularyService);
