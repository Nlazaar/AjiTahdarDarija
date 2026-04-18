import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { CoursesService } from '../courses/courses.service';

@Controller('modules')
export class ModulesController {
  constructor(private readonly coursesService: CoursesService) {}

  /** GET /modules?track=DARIJA|MSA|RELIGION */
  @Get()
  async findAll(@Query('track') track?: string) {
    return this.coursesService.findAll(track?.toUpperCase() as any);
  }

  @Get(':id/lessons')
  async lessons(@Param('id') id: string) {
    const lessons = await this.coursesService.findLessonsByModule(id);
    if (!lessons) throw new NotFoundException('Module not found');
    return lessons;
  }
}
