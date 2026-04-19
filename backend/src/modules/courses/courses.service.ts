import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ModuleTrack } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Admin CRUD ─────────────────────────────────────────────────────────────

  async listAllForAdmin() {
    return this.prisma.module.findMany({
      orderBy: [{ track: 'asc' }, { canonicalOrder: 'asc' }, { level: 'asc' }],
      include: { _count: { select: { lessons: true } } },
    });
  }

  async createModule(data: {
    title: string;
    slug: string;
    track?: ModuleTrack;
    titleAr?: string;
    subtitle?: string;
    description?: string;
    level?: number;
    canonicalOrder?: number;
    colorA?: string;
    colorB?: string;
    shadowColor?: string;
    cityName?: string;
    cityNameAr?: string;
    emoji?: string;
    photoCaption?: string;
    isPublished?: boolean;
    cityInfo?: any;
  }) {
    if (!data.title?.trim()) throw new BadRequestException('title is required');
    if (!data.slug?.trim()) throw new BadRequestException('slug is required');
    return this.prisma.module.create({ data });
  }

  async updateModule(
    id: string,
    data: Partial<{
      title: string;
      slug: string;
      track: ModuleTrack;
      titleAr: string | null;
      subtitle: string | null;
      description: string | null;
      level: number;
      canonicalOrder: number;
      colorA: string | null;
      colorB: string | null;
      shadowColor: string | null;
      cityName: string | null;
      cityNameAr: string | null;
      emoji: string | null;
      photoCaption: string | null;
      isPublished: boolean;
      cityInfo: any | null;
    }>,
  ) {
    const existing = await this.prisma.module.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Module not found');
    return this.prisma.module.update({ where: { id }, data });
  }

  async deleteModule(id: string, hard = false) {
    const existing = await this.prisma.module.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Module not found');
    if (hard) {
      // Détacher les leçons (onDelete:SetNull est déjà câblé sur Lesson.moduleId)
      return this.prisma.module.delete({ where: { id } });
    }
    return this.prisma.module.update({ where: { id }, data: { isPublished: false } });
  }

  // ── Lecture publique ───────────────────────────────────────────────────────

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
      titleAr: (m as any).titleAr ?? null,
      subtitle: m.subtitle,
      level: m.level,
      track: m.track,
      canonicalOrder: m.canonicalOrder,
      colorA: m.colorA || null,
      colorB: m.colorB || null,
      shadowColor: m.shadowColor || null,
      cityName: (m as any).cityName ?? null,
      cityNameAr: (m as any).cityNameAr ?? null,
      emoji: (m as any).emoji ?? null,
      photoCaption: (m as any).photoCaption ?? null,
      cityInfo: (m as any).cityInfo ?? null,
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
