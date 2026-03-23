import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type AnswerPayload = { exerciseId: string; answer: any }[];

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.lesson.findMany();
  }

  async findOne(id: string) {
    return this.prisma.lesson.findUnique({ where: { id } });
  }

  async getExercises(lessonId: string) {
    return this.prisma.exercise.findMany({ where: { lessonId } });
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

    return {
      score,
      errors,
      xpEarned,
      progress: updatedProgress,
    };
  }
}
