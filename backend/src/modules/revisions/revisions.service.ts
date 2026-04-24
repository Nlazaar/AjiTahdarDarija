import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RevisionPosition } from '@prisma/client';

export type RevisionTurn = {
  speaker: 'A' | 'B';
  darija: string;
  french: string;
  transliteration?: string;
  audioUrl?: string;
};

export type RevisionConversationContent = {
  kind?: 'conversation';
  setting?: string;
  theme?: string;
  turns: RevisionTurn[];
};

export type RevisionExerciseEntry = {
  typology: string;
  config: Record<string, unknown>;
};

export type RevisionExercisesContent = {
  kind: 'exercises';
  setting?: string;
  theme?: string;
  exercises: RevisionExerciseEntry[];
};

export type RevisionContent = RevisionConversationContent | RevisionExercisesContent;

type UpsertInput = {
  title?: string | null;
  content: RevisionContent;
  isPublished?: boolean;
  anchorAfterOrder?: number | null;
};

const POSITIONS: RevisionPosition[] = ['MIDDLE', 'END'];

function assertContent(content: unknown): asserts content is RevisionContent {
  if (!content || typeof content !== 'object') {
    throw new BadRequestException('content doit être un objet');
  }
  const c = content as { kind?: string; turns?: unknown; exercises?: unknown };

  if (c.kind === 'exercises' || Array.isArray(c.exercises)) {
    if (!Array.isArray(c.exercises) || c.exercises.length === 0) {
      throw new BadRequestException('content.exercises doit être un tableau non-vide');
    }
    for (const [i, ex] of c.exercises.entries()) {
      if (!ex || typeof ex !== 'object') {
        throw new BadRequestException(`exercises[${i}] invalide`);
      }
      const e = ex as { typology?: unknown; config?: unknown };
      if (typeof e.typology !== 'string' || e.typology.trim().length === 0) {
        throw new BadRequestException(`exercises[${i}].typology requis`);
      }
      if (!e.config || typeof e.config !== 'object') {
        throw new BadRequestException(`exercises[${i}].config requis`);
      }
    }
    return;
  }

  if (!Array.isArray(c.turns) || c.turns.length === 0) {
    throw new BadRequestException('content.turns doit être un tableau non-vide');
  }
  for (const [i, t] of c.turns.entries()) {
    if (!t || typeof t !== 'object') throw new BadRequestException(`turns[${i}] invalide`);
    const turn = t as Partial<RevisionTurn>;
    if (turn.speaker !== 'A' && turn.speaker !== 'B') {
      throw new BadRequestException(`turns[${i}].speaker doit être "A" ou "B"`);
    }
    if (typeof turn.darija !== 'string' || turn.darija.trim().length === 0) {
      throw new BadRequestException(`turns[${i}].darija requis`);
    }
    if (typeof turn.french !== 'string' || turn.french.trim().length === 0) {
      throw new BadRequestException(`turns[${i}].french requis`);
    }
  }
}

@Injectable()
export class RevisionsService {
  constructor(private readonly prisma: PrismaService) {}

  async listForModule(moduleId: string) {
    const module = await this.prisma.module.findUnique({ where: { id: moduleId }, select: { id: true } });
    if (!module) throw new NotFoundException('Module introuvable');
    return this.prisma.moduleRevision.findMany({
      where: { moduleId },
      orderBy: { position: 'asc' },
    });
  }

  async getOne(moduleId: string, position: string) {
    const pos = this.normalizePosition(position);
    const rev = await this.prisma.moduleRevision.findUnique({
      where: { moduleId_position: { moduleId, position: pos } },
    });
    if (!rev) throw new NotFoundException('Révision introuvable');
    return rev;
  }

  async upsert(moduleId: string, position: string, input: UpsertInput) {
    const pos = this.normalizePosition(position);
    assertContent(input.content);
    const module = await this.prisma.module.findUnique({ where: { id: moduleId }, select: { id: true } });
    if (!module) throw new NotFoundException('Module introuvable');

    return this.prisma.moduleRevision.upsert({
      where: { moduleId_position: { moduleId, position: pos } },
      create: {
        moduleId,
        position: pos,
        title: input.title ?? null,
        content: input.content as unknown as object,
        isPublished: input.isPublished ?? false,
        anchorAfterOrder: input.anchorAfterOrder ?? null,
      },
      update: {
        title: input.title ?? null,
        content: input.content as unknown as object,
        ...(input.isPublished !== undefined ? { isPublished: input.isPublished } : {}),
        ...(input.anchorAfterOrder !== undefined ? { anchorAfterOrder: input.anchorAfterOrder } : {}),
      },
    });
  }

  async patchAnchor(moduleId: string, position: string, anchorAfterOrder: number | null) {
    const pos = this.normalizePosition(position);
    const existing = await this.prisma.moduleRevision.findUnique({
      where: { moduleId_position: { moduleId, position: pos } },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Révision introuvable');
    return this.prisma.moduleRevision.update({
      where: { moduleId_position: { moduleId, position: pos } },
      data: { anchorAfterOrder },
    });
  }

  async remove(moduleId: string, position: string) {
    const pos = this.normalizePosition(position);
    await this.prisma.moduleRevision.delete({
      where: { moduleId_position: { moduleId, position: pos } },
    });
    return { ok: true };
  }

  /** Endpoint public : liste les révisions publiées d'un module (user-facing). */
  async listPublishedForModule(moduleId: string) {
    return this.prisma.moduleRevision.findMany({
      where: { moduleId, isPublished: true },
      orderBy: { position: 'asc' },
    });
  }

  /** Endpoint public : révision publiée par id (pour la page /revision/[id]). */
  async getPublishedById(id: string) {
    const rev = await this.prisma.moduleRevision.findUnique({
      where: { id },
      include: {
        module: {
          select: {
            id: true,
            slug: true,
            title: true,
            cityName: true,
            colorA: true,
          },
        },
      },
    });
    if (!rev || !rev.isPublished) throw new NotFoundException('Révision introuvable');
    return rev;
  }

  /**
   * Marque une révision comme terminée pour l'utilisateur (idempotent) et
   * accorde un bonus XP : +20 pour MIDDLE, +50 pour END. Le bonus n'est
   * accordé qu'à la première complétion (les appels suivants ne créditent pas).
   */
  async completeForUser(userId: string, revisionId: string) {
    const rev = await this.prisma.moduleRevision.findUnique({
      where: { id: revisionId },
      select: { id: true, position: true, isPublished: true },
    });
    if (!rev || !rev.isPublished) throw new NotFoundException('Révision introuvable');

    const existing = await this.prisma.userRevisionProgress.findUnique({
      where: { userId_revisionId: { userId, revisionId } },
      select: { id: true },
    });

    if (existing) {
      return { ok: true, alreadyCompleted: true, xpAwarded: 0, position: rev.position };
    }

    const xpAwarded = rev.position === 'END' ? 50 : 20;

    await this.prisma.$transaction([
      this.prisma.userRevisionProgress.create({
        data: { userId, revisionId },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: xpAwarded } },
      }),
    ]);

    return { ok: true, alreadyCompleted: false, xpAwarded, position: rev.position };
  }

  private normalizePosition(raw: string): RevisionPosition {
    const up = raw.toUpperCase();
    if (!(POSITIONS as string[]).includes(up)) {
      throw new BadRequestException(`Position invalide (attendu: MIDDLE ou END)`);
    }
    return up as RevisionPosition;
  }
}
