import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.lesson.findMany();
  }

  // Return lessons grouped by module or simple modules list
  async findLessonsByModule(moduleId: string) {
    const module = await this.prisma.module.findUnique({ where: { id: moduleId } });
    if (!module) return null;
    return this.prisma.lesson.findMany({ where: { moduleId }, orderBy: { order: 'asc' } });
  }
}
