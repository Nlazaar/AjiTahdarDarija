import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  findAll() {
    return this.lessonsService.findAll();
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.lessonsService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @Get(':id/exercises')
  getExercises(@Param('id') id: string) {
    return this.lessonsService.getExercises(id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/submit')
  submit(@Param('id') id: string, @Request() req: any, @Body() body: any) {
    return this.lessonsService.submit(id, req.user.id, body.answers ?? []);
  }
}
