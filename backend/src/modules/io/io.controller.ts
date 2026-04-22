import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common'
import { IoService } from './io.service'
import { AdminGuard } from '../../common/guards/admin.guard'

@UseGuards(AdminGuard)
@Controller('io')
export class IoController {
  constructor(private readonly io: IoService) {}

  @Post('import')
  import(@Body() body: any) {
    return this.io.import(body)
  }

  @Get('export/section/:moduleSlug')
  exportSection(@Param('moduleSlug') slug: string) {
    return this.io.exportSection(slug)
  }

  @Get('export/lessons/:moduleSlug')
  exportLessons(@Param('moduleSlug') slug: string) {
    return this.io.exportLessons(slug)
  }

  @Get('export/vocabulary/:lessonSlug')
  exportVocabulary(@Param('lessonSlug') slug: string) {
    return this.io.exportVocabulary(slug)
  }

  @Get('export/exercises/:lessonSlug')
  exportExercises(@Param('lessonSlug') slug: string) {
    return this.io.exportExercises(slug)
  }
}
