import { Controller, Get, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  /** GET /courses?track=DARIJA|MSA|RELIGION */
  @Get()
  findAll(@Query('track') track?: string) {
    return this.coursesService.findAll(track?.toUpperCase() as any);
  }
}
