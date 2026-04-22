import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const AUDIO_DIR = path.join(process.cwd(), 'public', 'audio', 'vocab');
const ALLOWED_MIME = new Set(['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/wave']);

@Injectable()
export class VocabularyService {
  constructor(private readonly prisma: PrismaService) {}

  async list(params: { languageId?: string; lessonId?: string; q?: string; includeDrafts?: boolean } = {}) {
    const { languageId, lessonId, q, includeDrafts } = params;
    let vocabularyIds: string[] | undefined;
    let lessonVocabOrder: string[] = [];

    if (lessonId) {
      const exercises = await this.prisma.exercise.findMany({
        where: { lessonId, vocabularyId: { not: null } },
        select: { vocabularyId: true },
        distinct: ['vocabularyId'],
      });
      vocabularyIds = exercises.map(e => e.vocabularyId).filter((v): v is string => !!v);

      // Récupérer l'ordre canonique stocké dans Lesson.content.vocabOrder (si présent)
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { content: true },
      });
      const vo = (lesson?.content as any)?.vocabOrder;
      if (Array.isArray(vo)) lessonVocabOrder = vo.filter((s: any): s is string => typeof s === 'string');
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
        const ia = indexOf.has(a.id) ? indexOf.get(a.id)! : Number.POSITIVE_INFINITY;
        const ib = indexOf.has(b.id) ? indexOf.get(b.id)! : Number.POSITIVE_INFINITY;
        if (ia !== ib) return ia - ib;
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
    }

    return items;
  }

  async findOne(id: string) {
    const v = await this.prisma.vocabulary.findUnique({ where: { id } });
    if (!v) throw new NotFoundException('Vocabulary not found');
    return v;
  }

  /**
   * Retourne un item du jour, déterministe selon la date courante (UTC).
   *
   * Filtrage par track :
   *   DARIJA   → langue ar-MA
   *   MSA      → langue ar-SA, hors vocabs tagués 'islam' (réservés RELIGION)
   *   RELIGION → langue ar-SA, tagués 'islam'
   * Si `languageId` est fourni, il prend le dessus (back-compat).
   */
  async daily(params: { languageId?: string; track?: 'DARIJA' | 'MSA' | 'RELIGION' } = {}) {
    const where: any = { isPublished: true };

    if (params.languageId) {
      where.languageId = params.languageId;
    } else if (params.track) {
      const code = params.track === 'DARIJA' ? 'ar-MA' : 'ar-SA';
      const lang = await this.prisma.language.findUnique({ where: { code } });
      if (!lang) return null;
      where.languageId = lang.id;
      if (params.track === 'RELIGION')      where.tags = { has: 'islam' };
      else if (params.track === 'MSA')      where.NOT = { tags: { has: 'islam' } };
    }

    const items = await this.prisma.vocabulary.findMany({
      where,
      select: {
        id: true,
        word: true,
        transliteration: true,
        translation: true,
        audioUrl: true,
      },
      orderBy: { id: 'asc' }, // ordre stable pour le hash
    });
    if (items.length === 0) return null;

    const now = new Date();
    const dayKey = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
    let h = 5381;
    for (let i = 0; i < dayKey.length; i++) {
      h = ((h << 5) + h) ^ dayKey.charCodeAt(i);
    }
    const idx = Math.abs(h) % items.length;
    return items[idx];
  }

  async create(data: {
    word: string;
    languageId: string;
    transliteration?: string;
    translation?: any;
    audioUrl?: string;
    imageUrl?: string;
    tags?: string[];
    isPublished?: boolean;
  }) {
    if (!data.word?.trim()) throw new BadRequestException('word is required');
    if (!data.languageId?.trim()) throw new BadRequestException('languageId is required');
    return this.prisma.vocabulary.create({ data });
  }

  async update(
    id: string,
    data: Partial<{
      word: string;
      transliteration: string | null;
      translation: any;
      audioUrl: string | null;
      imageUrl: string | null;
      tags: string[];
      isPublished: boolean;
    }>,
  ) {
    await this.findOne(id);
    return this.prisma.vocabulary.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    // Détacher des exercices puis supprimer (FK SetNull déjà câblé)
    return this.prisma.vocabulary.delete({ where: { id } });
  }

  /**
   * Sauvegarde un fichier audio uploadé (mp3/wav) sous public/audio/vocab/<sha>.mp3
   * et met à jour Vocabulary.audioUrl avec l'URL publique.
   */
  async saveAudio(id: string, file: { buffer: Buffer; mimetype: string; originalname: string }) {
    if (!file?.buffer?.length) throw new BadRequestException('Empty file');
    if (!ALLOWED_MIME.has(file.mimetype.toLowerCase())) {
      throw new BadRequestException(`Mime type non supporté: ${file.mimetype} (mp3/wav uniquement)`);
    }
    const vocab = await this.findOne(id);

    if (!fs.existsSync(AUDIO_DIR)) fs.mkdirSync(AUDIO_DIR, { recursive: true });

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
   *
   * Maintient aussi un LessonExercise FlashCard auto-généré (config.auto = true)
   * contenant tous les vocabIds attachés : garantit qu'un cours ayant des items
   * a toujours au moins un exo FlashCard sans action manuelle de l'admin.
   */
  async attachToLesson(vocabularyId: string, lessonId: string) {
    await this.findOne(vocabularyId);
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const existing = await this.prisma.exercise.findFirst({
      where: { lessonId, vocabularyId },
    });

    const exercise = existing
      ? existing
      : await this.prisma.exercise.create({
          data: { lessonId, vocabularyId, type: 'LISTENING', points: 10 },
        });

    await this.syncAutoFlashCard(lessonId, vocabularyId, 'add');
    return exercise;
  }

  async detachFromLesson(vocabularyId: string, lessonId: string) {
    const res = await this.prisma.exercise.deleteMany({ where: { lessonId, vocabularyId } });
    await this.syncAutoFlashCard(lessonId, vocabularyId, 'remove');
    return res;
  }

  /**
   * Trouve (ou crée) le LessonExercise FlashCard auto-généré pour une leçon
   * et ajoute/retire le vocabId. Supprime le LessonExercise s'il se retrouve vide.
   *
   * Ne touche JAMAIS un FlashCard créé manuellement (sans `auto: true`) : si
   * l'admin supprime l'auto-FlashCard, il ne sera pas ressuscité tant que le
   * vocabId n'est pas détaché puis rattaché.
   */
  private async syncAutoFlashCard(
    lessonId: string,
    vocabularyId: string,
    op: 'add' | 'remove',
  ) {
    const all = await this.prisma.lessonExercise.findMany({
      where: { lessonId, typology: 'FlashCard' },
    });
    const auto = all.find((le) => {
      const cfg = le.config as any;
      return cfg && cfg.auto === true;
    });

    if (op === 'add') {
      if (!auto) {
        await this.prisma.lessonExercise.create({
          data: {
            lessonId,
            order: 0,
            typology: 'FlashCard',
            config: { vocabIds: [vocabularyId], auto: true },
            isPublished: true,
          },
        });
        return;
      }
      const cfg = auto.config as any;
      const ids: string[] = Array.isArray(cfg.vocabIds) ? cfg.vocabIds : [];
      if (ids.includes(vocabularyId)) return;
      await this.prisma.lessonExercise.update({
        where: { id: auto.id },
        data: { config: { ...cfg, vocabIds: [...ids, vocabularyId], auto: true } },
      });
      return;
    }

    if (!auto) return;
    const cfg = auto.config as any;
    const ids: string[] = Array.isArray(cfg.vocabIds) ? cfg.vocabIds : [];
    const next = ids.filter((id) => id !== vocabularyId);
    if (next.length === 0) {
      await this.prisma.lessonExercise.delete({ where: { id: auto.id } });
      return;
    }
    await this.prisma.lessonExercise.update({
      where: { id: auto.id },
      data: { config: { ...cfg, vocabIds: next, auto: true } },
    });
  }
}
