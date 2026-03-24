import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  findAll() {
    return this.lessonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.lessonsService.findBySlug(slug);
  }

  @Get(':id/exercises')
  getExercises(@Param('id') id: string) {
    return this.lessonsService.getExercises(id);
  }

  @Post(':id/submit')
  async submit(@Param('id') id: string, @Body() body: any) {
    // expected body: { userId: string, answers: [{ exerciseId, answer }] }
    const { userId, answers } = body;
    return this.lessonsService.submit(id, userId, answers || []);
  }
}
