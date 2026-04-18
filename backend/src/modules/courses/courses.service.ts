import { Injectable } from '@nestjs/common';
import { ModuleTrack } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(track?: ModuleTrack) {
    const modules = await this.prisma.module.findMany({
      include: { lessons: { where: { isDeleted: false }, orderBy: { order: 'asc' } } },
      // Tri par track puis par canonicalOrder = ordre pédagogique aligné Darija/MSA
      orderBy: [{ canonicalOrder: 'asc' }, { level: 'asc' }, { createdAt: 'asc' }],
      where: {
        isPublished: true,
        ...(track ? { track } : {}),
      },
    });

    return modules.map((m) => ({
      id: m.id,
      slug: m.slug,
      title: m.title,
      subtitle: m.subtitle,
      level: m.level,
      track: m.track,
      canonicalOrder: m.canonicalOrder,
      colorA: m.colorA || null,
      colorB: m.colorB || null,
      shadowColor: m.shadowColor || null,
      lessons: (m.lessons || []).map((l) => ({
        id: l.id,
        title: l.title,
        label: l.title,
        slug: l.slug || null,
        subtitle: l.subtitle,
        order: l.order,
        moduleId: m.id,
      })),
    }));
  }

  async findLessonsByModule(moduleId: string) {
    const module = await this.prisma.module.findUnique({ where: { id: moduleId } });
    if (!module) return null;
    return this.prisma.lesson.findMany({
      where: { moduleId, isPublished: true, isDeleted: false },
      orderBy: { order: 'asc' },
      include: { _count: { select: { exercises: true } } },
    });
  }
}
