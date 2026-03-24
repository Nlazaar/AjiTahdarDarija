import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const modules = await this.prisma.module.findMany({
      include: { lessons: { orderBy: { order: 'asc' } } },
      orderBy: [{ level: 'asc' }, { createdAt: 'asc' }],
      where: { isPublished: true },
    });

    return modules.map((m) => ({
      id: m.id,
      title: m.title,
      subtitle: m.subtitle,
      level: m.level,
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

  // Return lessons grouped by module or simple modules list
  async findLessonsByModule(moduleId: string) {
    const module = await this.prisma.module.findUnique({ where: { id: moduleId } });
    if (!module) return null;
    return this.prisma.lesson.findMany({
      where: { moduleId, isPublished: true },
      orderBy: { order: 'asc' },
      include: { _count: { select: { exercises: true } } },
    });
  }
}
