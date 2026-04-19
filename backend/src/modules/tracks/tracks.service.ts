import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TracksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPublic() {
    return this.prisma.track.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
    });
  }

  async findAllForAdmin() {
    return this.prisma.track.findMany({ orderBy: { order: 'asc' } });
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      nameAr: string | null;
      description: string | null;
      emoji: string | null;
      color: string | null;
      order: number;
      isPublished: boolean;
    }>,
  ) {
    const existing = await this.prisma.track.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Track not found');
    return this.prisma.track.update({ where: { id }, data });
  }

  async reorder(ordered: { id: string; order: number }[]) {
    if (!Array.isArray(ordered) || ordered.length === 0) {
      throw new BadRequestException('ordered payload required');
    }
    return this.prisma.$transaction(
      ordered.map((o) =>
        this.prisma.track.update({ where: { id: o.id }, data: { order: o.order } }),
      ),
    );
  }
}
