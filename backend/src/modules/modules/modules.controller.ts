import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { CoursesService } from '../courses/courses.service';

@Controller('modules')
export class ModulesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findAll() {
    // reuse courses service to list modules
    return this.coursesService.findAll();
  }

  @Get(':id/lessons')
  async lessons(@Param('id') id: string) {
    const lessons = await this.coursesService.findLessonsByModule(id);
    if (!lessons) throw new NotFoundException('Module not found');
    return lessons;
  }
}
