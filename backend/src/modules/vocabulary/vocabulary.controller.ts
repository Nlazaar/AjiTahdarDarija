import {
  Controller, Get, Post, Patch, Delete,
  Param, Query, Body, UploadedFile, UseGuards, UseInterceptors, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VocabularyService } from './vocabulary.service';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('vocabulary')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  // ── Lecture publique ───────────────────────────────────────────────────────

  @Get()
  list(
    @Query('languageId') languageId?: string,
    @Query('lessonId') lessonId?: string,
    @Query('q') q?: string,
    @Query('includeDrafts') includeDrafts?: string,
  ) {
    return this.vocabularyService.list({
      languageId,
      lessonId,
      q,
      includeDrafts: includeDrafts === 'true' || includeDrafts === '1',
    });
  }

  /** Item du jour (déterministe par date, choisi parmi les items publiés) */
  @Get('daily')
  daily(
    @Query('languageId') languageId?: string,
    @Query('track') track?: string,
  ) {
    const t = track === 'DARIJA' || track === 'MSA' || track === 'RELIGION' ? track : undefined;
    return this.vocabularyService.daily({ languageId, track: t });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vocabularyService.findOne(id);
  }

  // ── Admin CRUD (header X-Admin-Token) ──────────────────────────────────────

  @UseGuards(AdminGuard)
  @Post()
  create(@Body() body: any) {
    return this.vocabularyService.create(body);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.vocabularyService.update(id, body);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vocabularyService.remove(id);
  }

  /** Upload audio (multipart/form-data champ "file", mp3/wav, max 5MB) */
  @UseGuards(AdminGuard)
  @Post(':id/audio')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  uploadAudio(
    @Param('id') id: string,
    @UploadedFile() file: { buffer: Buffer; mimetype: string; originalname: string } | undefined,
  ) {
    if (!file) throw new BadRequestException('file is required (multipart field "file")');
    return this.vocabularyService.saveAudio(id, file);
  }

  @UseGuards(AdminGuard)
  @Post(':id/attach/:lessonId')
  attach(@Param('id') id: string, @Param('lessonId') lessonId: string) {
    return this.vocabularyService.attachToLesson(id, lessonId);
  }

  @UseGuards(AdminGuard)
  @Delete(':id/attach/:lessonId')
  detach(@Param('id') id: string, @Param('lessonId') lessonId: string) {
    return this.vocabularyService.detachFromLesson(id, lessonId);
  }
}
