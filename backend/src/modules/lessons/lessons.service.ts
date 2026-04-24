import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QuestsService } from '../quests/quests.service';

type AnswerPayload = { exerciseId: string; answer: any }[];

@Injectable()
export class LessonsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly questsService: QuestsService,
  ) {}

  async findAll() {
    return this.prisma.lesson.findMany();
  }

  async listLanguages() {
    return this.prisma.language.findMany({ orderBy: { code: 'asc' } })
  }

  async listModulesForAdmin() {
    return this.prisma.module.findMany({
      orderBy: [{ level: 'asc' }, { title: 'asc' }],
      select: { id: true, slug: true, title: true, level: true, isPublished: true },
    })
  }

  async create(data: {
    title: string
    languageId: string
    moduleId?: string
    slug?: string
    subtitle?: string
    description?: string
    content?: any
    order?: number
    duration?: number
    level?: number
    videoUrl?: string
    videoPoster?: string
    isPublished?: boolean
  }) {
    if (!data.title?.trim()) throw new BadRequestException('title is required')
    if (!data.languageId?.trim()) throw new BadRequestException('languageId is required')
    return this.prisma.lesson.create({ data })
  }

  async update(id: string, data: Partial<{
    title: string
    moduleId: string | null
    slug: string | null
    subtitle: string | null
    description: string | null
    content: any
    order: number
    duration: number | null
    level: number
    videoUrl: string | null
    videoPoster: string | null
    isPublished: boolean
    languageId: string
  }>) {
    const existing = await this.prisma.lesson.findUnique({ where: { id } })
    if (!existing) throw new BadRequestException('Lesson not found')
    return this.prisma.lesson.update({ where: { id }, data })
  }

  async softDelete(id: string) {
    const existing = await this.prisma.lesson.findUnique({ where: { id } })
    if (!existing) throw new BadRequestException('Lesson not found')
    return this.prisma.lesson.update({
      where: { id },
      data: { isDeleted: true, isPublished: false },
    })
  }

  async hardDelete(id: string) {
    const existing = await this.prisma.lesson.findUnique({ where: { id } })
    if (!existing) throw new BadRequestException('Lesson not found')
    await this.prisma.userProgress.deleteMany({ where: { lessonId: id } })
    await this.prisma.exercise.deleteMany({ where: { lessonId: id } })
    return this.prisma.lesson.delete({ where: { id } })
  }

  /**
   * Met à jour la séquence d'exercices d'une leçon (typologies + items vocab).
   * Stocke dans Lesson.content : { sequence: string[], itemIds: string[], mode?: 'lettre'|'mot' }
   * Préserve les autres clés de content déjà présentes.
   */
  async updateSequence(
    id: string,
    payload: { sequence?: string[]; itemIds?: string[]; mode?: 'lettre' | 'mot' },
  ) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) throw new BadRequestException('Lesson not found');

    const prev = (lesson.content as any) ?? {};
    const next = {
      ...prev,
      ...(payload.sequence !== undefined ? { sequence: payload.sequence } : {}),
      ...(payload.itemIds !== undefined ? { itemIds: payload.itemIds } : {}),
      ...(payload.mode !== undefined ? { mode: payload.mode } : {}),
    };

    return this.prisma.lesson.update({ where: { id }, data: { content: next } });
  }

  async findBySlug(slug: string) {
    if (!slug) return null;
    return this.prisma.lesson.findUnique({ where: { slug } });
  }

  async findOne(id: string) {
    return this.prisma.lesson.findUnique({
      where: { id },
      include: { _count: { select: { exercises: true } } },
    });
  }

  async getExercises(lessonId: string) {
    return this.prisma.exercise.findMany({
      where: { lessonId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getVocabulary(lessonId: string) {
    const exercises = await this.prisma.exercise.findMany({
      where: { lessonId, vocabularyId: { not: null } },
      include: { vocabulary: true },
      distinct: ['vocabularyId'],
    });
    const items = exercises
      .map(e => e.vocabulary)
      .filter((v): v is NonNullable<typeof v> => !!v && v.isPublished);

    // Respecter l'ordre canonique stocké dans Lesson.content.vocabOrder (si présent)
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { content: true },
    });
    const vo = (lesson?.content as any)?.vocabOrder;
    const order: string[] = Array.isArray(vo)
      ? vo.filter((s: any): s is string => typeof s === 'string')
      : [];
    if (order.length === 0) return items;

    const indexOf = new Map(order.map((id, i) => [id, i]));
    return items.slice().sort((a, b) => {
      const ia = indexOf.has(a.id) ? indexOf.get(a.id)! : Number.POSITIVE_INFINITY;
      const ib = indexOf.has(b.id) ? indexOf.get(b.id)! : Number.POSITIVE_INFINITY;
      if (ia !== ib) return ia - ib;
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }

  /**
   * Submit answers for a lesson. Returns score, errors, xpEarned and updated progress.
   * Simple scoring: exact equality for answers; XP = sum(points) for correct answers.
   */
  async submit(lessonId: string, userId: string, answers: AnswerPayload) {
    if (!userId) throw new BadRequestException('userId is required');

    const exercises = await this.prisma.exercise.findMany({ where: { lessonId } });
    const total = exercises.length;

    const answerMap = new Map(answers.map(a => [a.exerciseId, a.answer]));

    let correctCount = 0;
    const errors: { exerciseId: string; expected: any; got: any }[] = [];
    let xpEarned = 0;

    for (const ex of exercises) {
      const given = answerMap.get(ex.id);
      const expected = ex.answer;

      // simple comparison: stringify JSON for flexible structures
      const isCorrect = JSON.stringify(given) === JSON.stringify(expected);
      if (isCorrect) {
        correctCount++;
        xpEarned += ex.points ?? 0;
      } else {
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
    } else {
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
    }).catch(() => {});

    return {
      score,
      errors,
      xpEarned,
      gemmesEarned,
      progress: updatedProgress,
    };
  }

  // ── Authored exercises (LessonExercise) ────────────────────────────────────

  private static readonly KNOWN_TYPOLOGIES = new Set([
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
    'VoixVisuel',
    'TrouverIntrus',
  ]);

  // Public : uniquement les exos publiés (consommé par le player)
  async listAuthoredExercises(lessonId: string) {
    return this.prisma.lessonExercise.findMany({
      where: { lessonId, isPublished: true },
      orderBy: { order: 'asc' },
    });
  }

  // Admin : tous les exos (y compris brouillons)
  async listAuthoredExercisesAdmin(lessonId: string) {
    return this.prisma.lessonExercise.findMany({
      where: { lessonId },
      orderBy: { order: 'asc' },
    });
  }

  async createAuthoredExercise(lessonId: string, data: { typology?: string; config?: any; order?: number }) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    if (!data.typology || !LessonsService.KNOWN_TYPOLOGIES.has(data.typology)) {
      throw new BadRequestException(`typology must be one of ${[...LessonsService.KNOWN_TYPOLOGIES].join(', ')}`);
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

  async updateAuthoredExercise(lessonId: string, exId: string, data: { typology?: string; config?: any; order?: number; isPublished?: boolean }) {
    const existing = await this.prisma.lessonExercise.findFirst({ where: { id: exId, lessonId } });
    if (!existing) throw new NotFoundException('LessonExercise not found');
    if (data.typology && !LessonsService.KNOWN_TYPOLOGIES.has(data.typology)) {
      throw new BadRequestException(`typology must be one of ${[...LessonsService.KNOWN_TYPOLOGIES].join(', ')}`);
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

  async deleteAuthoredExercise(lessonId: string, exId: string) {
    const existing = await this.prisma.lessonExercise.findFirst({ where: { id: exId, lessonId } });
    if (!existing) throw new NotFoundException('LessonExercise not found');
    await this.prisma.lessonExercise.delete({ where: { id: exId } });
    return { ok: true };
  }

  async reorderVocabulary(lessonId: string, orderedIds: string[]) {
    if (!Array.isArray(orderedIds)) throw new BadRequestException('orderedIds must be an array');
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    const content = (lesson.content as any) ?? {};
    return this.prisma.lesson.update({
      where: { id: lessonId },
      data: { content: { ...content, vocabOrder: orderedIds } },
    });
  }

  async reorderAuthoredExercises(lessonId: string, orderedIds: string[]) {
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      throw new BadRequestException('orderedIds must be a non-empty array');
    }
    const existing = await this.prisma.lessonExercise.findMany({
      where: { lessonId },
      select: { id: true },
    });
    const existingIds = new Set(existing.map(e => e.id));
    for (const id of orderedIds) {
      if (!existingIds.has(id)) throw new BadRequestException(`exercise ${id} does not belong to this lesson`);
    }
    await this.prisma.$transaction(
      orderedIds.map((id, idx) =>
        this.prisma.lessonExercise.update({ where: { id }, data: { order: idx } }),
      ),
    );
    return this.listAuthoredExercises(lessonId);
  }
}
