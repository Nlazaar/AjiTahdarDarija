import { Injectable, BadRequestException } from '@nestjs/common';
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
    return exercises.map(e => e.vocabulary).filter(Boolean);
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
}
