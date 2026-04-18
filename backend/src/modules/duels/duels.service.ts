import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DuelStatus } from '@prisma/client';

@Injectable()
export class DuelsService {
  constructor(private readonly prisma: PrismaService) {}

  // Create an open duel (waiting for opponent)
  async create(p1Id: string, params: { lessonId?: string; rounds?: number } = {}) {
    const rounds = Math.min(10, Math.max(3, params.rounds ?? 5));
    return this.prisma.duel.create({
      data: {
        p1Id,
        lessonId: params.lessonId ?? null,
        rounds,
        status: DuelStatus.WAITING,
        data: { answers: { p1: [], p2: [] } },
      },
    });
  }

  // List open duels (no opponent yet) excluding yours
  async listOpen(userId: string) {
    return this.prisma.duel.findMany({
      where: { status: DuelStatus.WAITING, p1Id: { not: userId } },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        p1: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  // List duels involving me (active or recent)
  async listMine(userId: string) {
    return this.prisma.duel.findMany({
      where: {
        OR: [{ p1Id: userId }, { p2Id: userId }],
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        p1: { select: { id: true, name: true, avatar: true } },
        p2: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  // Join an open duel
  async join(duelId: string, p2Id: string) {
    const duel = await this.prisma.duel.findUnique({ where: { id: duelId } });
    if (!duel) throw new NotFoundException('Duel introuvable');
    if (duel.status !== DuelStatus.WAITING) throw new BadRequestException('Duel déjà commencé');
    if (duel.p1Id === p2Id) throw new BadRequestException('Tu ne peux pas te battre toi-même');
    return this.prisma.duel.update({
      where: { id: duelId },
      data: { p2Id, status: DuelStatus.IN_PROGRESS, startedAt: new Date() },
    });
  }

  // Submit a round result (per-player). When both players submitted 'rounds', finalize.
  async submitRound(duelId: string, userId: string, payload: { score: number; correct: boolean }) {
    const duel = await this.prisma.duel.findUnique({ where: { id: duelId } });
    if (!duel) throw new NotFoundException('Duel introuvable');
    if (duel.status !== DuelStatus.IN_PROGRESS) throw new BadRequestException('Duel pas en cours');
    const isP1 = duel.p1Id === userId;
    const isP2 = duel.p2Id === userId;
    if (!isP1 && !isP2) throw new ForbiddenException('Tu ne fais pas partie de ce duel');

    const d: any = duel.data ?? { answers: { p1: [], p2: [] } };
    const key = isP1 ? 'p1' : 'p2';
    d.answers[key] = [...(d.answers[key] ?? []), payload];

    const scoreDelta = payload.correct ? payload.score : 0;
    const patch: any = { data: d };
    if (isP1) patch.scoreP1 = duel.scoreP1 + scoreDelta;
    else patch.scoreP2 = duel.scoreP2 + scoreDelta;

    // Check if both players finished all rounds
    const p1Done = (d.answers.p1?.length ?? 0) >= duel.rounds;
    const p2Done = (d.answers.p2?.length ?? 0) >= duel.rounds;
    if (p1Done && p2Done) {
      const finalP1 = patch.scoreP1 ?? duel.scoreP1;
      const finalP2 = patch.scoreP2 ?? duel.scoreP2;
      patch.status = DuelStatus.COMPLETED;
      patch.finishedAt = new Date();
      patch.winnerId = finalP1 === finalP2 ? null : finalP1 > finalP2 ? duel.p1Id : duel.p2Id;
    }

    return this.prisma.duel.update({ where: { id: duelId }, data: patch });
  }

  async get(duelId: string, userId: string) {
    const duel = await this.prisma.duel.findUnique({
      where: { id: duelId },
      include: {
        p1: { select: { id: true, name: true, avatar: true } },
        p2: { select: { id: true, name: true, avatar: true } },
      },
    });
    if (!duel) throw new NotFoundException('Duel introuvable');
    // Basic visibility: you must be a participant, OR duel is public WAITING
    if (duel.p1Id !== userId && duel.p2Id !== userId && duel.status !== DuelStatus.WAITING) {
      throw new ForbiddenException();
    }
    return duel;
  }

  async cancel(duelId: string, userId: string) {
    const duel = await this.prisma.duel.findUnique({ where: { id: duelId } });
    if (!duel) throw new NotFoundException();
    if (duel.p1Id !== userId) throw new ForbiddenException('Seul le créateur peut annuler');
    if (duel.status !== DuelStatus.WAITING) throw new BadRequestException('Duel déjà démarré');
    return this.prisma.duel.update({
      where: { id: duelId },
      data: { status: DuelStatus.CANCELLED, finishedAt: new Date() },
    });
  }
}
