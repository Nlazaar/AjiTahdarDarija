import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const INTERVALS_DAYS = [1, 3, 7, 14, 30];
const MASTERY_MAX = 5;
const MASTERY_MIN = -2;

function nextReviewFromMastery(mastery: number): Date {
  const idx = Math.max(0, Math.min(mastery, INTERVALS_DAYS.length - 1));
  const days = mastery < 0 ? 1 : INTERVALS_DAYS[idx];
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

@Injectable()
export class UserVocabularyService {
  constructor(private readonly prisma: PrismaService) {}

  async seen(userId: string, vocabularyId: string) {
    const now = new Date();
    const existing = await this.prisma.userVocabulary.findUnique({
      where: { userId_vocabularyId: { userId, vocabularyId } },
    });
    const mastery = existing?.mastery ?? 0;
    return this.prisma.userVocabulary.upsert({
      where: { userId_vocabularyId: { userId, vocabularyId } },
      create: {
        userId, vocabularyId,
        mastery: 0,
        lastSeenAt: now,
        nextReviewAt: nextReviewFromMastery(0),
      },
      update: {
        lastSeenAt: now,
        nextReviewAt: existing?.nextReviewAt ?? nextReviewFromMastery(mastery),
      },
    });
  }

  async result(userId: string, vocabularyId: string, correct: boolean) {
    const existing = await this.prisma.userVocabulary.findUnique({
      where: { userId_vocabularyId: { userId, vocabularyId } },
    });
    const current = existing?.mastery ?? 0;
    const delta = correct ? 1 : -1;
    const nextMastery = Math.max(MASTERY_MIN, Math.min(MASTERY_MAX, current + delta));
    const now = new Date();
    return this.prisma.userVocabulary.upsert({
      where: { userId_vocabularyId: { userId, vocabularyId } },
      create: {
        userId, vocabularyId,
        mastery: nextMastery,
        lastSeenAt: now,
        nextReviewAt: nextReviewFromMastery(nextMastery),
      },
      update: {
        mastery: nextMastery,
        lastSeenAt: now,
        nextReviewAt: nextReviewFromMastery(nextMastery),
      },
    });
  }

  async due(userId: string, limit = 20) {
    const now = new Date();
    const rows = await this.prisma.userVocabulary.findMany({
      where: {
        userId,
        nextReviewAt: { lte: now },
      },
      include: { vocabulary: true },
      orderBy: [{ mastery: 'asc' }, { nextReviewAt: 'asc' }],
      take: limit,
    });
    return rows.map(r => ({
      id: r.vocabularyId,
      mastery: r.mastery,
      lastSeenAt: r.lastSeenAt,
      nextReviewAt: r.nextReviewAt,
      vocabulary: r.vocabulary,
    }));
  }

  async stats(userId: string) {
    const all = await this.prisma.userVocabulary.findMany({
      where: { userId },
      select: { mastery: true, nextReviewAt: true },
    });
    const now = new Date();
    const total = all.length;
    const mastered = all.filter(r => r.mastery >= 3).length;
    const learning = all.filter(r => r.mastery >= 0 && r.mastery < 3).length;
    const toReview = all.filter(r => r.mastery < 0).length;
    const dueNow = all.filter(r => r.nextReviewAt && r.nextReviewAt <= now).length;
    return { total, mastered, learning, toReview, dueNow };
  }
}
