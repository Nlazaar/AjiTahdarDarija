import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  findAll() {
    return this.lessonsService.findAll();
  }

  @Get('meta/languages')
  listLanguages() {
    return this.lessonsService.listLanguages();
  }

  @Get('meta/modules')
  listModulesForAdmin() {
    return this.lessonsService.listModulesForAdmin();
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

  @Get(':id/vocabulary')
  getVocabulary(@Param('id') id: string) {
    return this.lessonsService.getVocabulary(id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/submit')
  submit(@Param('id') id: string, @Request() req: any, @Body() body: any) {
    return this.lessonsService.submit(id, req.user.id, body.answers ?? []);
  }

  // ── Admin CRUD (header X-Admin-Token requis) ─────────────────────────────

  @UseGuards(AdminGuard)
  @Post()
  create(@Body() body: any) {
    return this.lessonsService.create(body);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.lessonsService.update(id, body);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Query('hard') hard?: string) {
    return hard === 'true'
      ? this.lessonsService.hardDelete(id)
      : this.lessonsService.softDelete(id);
  }
}
