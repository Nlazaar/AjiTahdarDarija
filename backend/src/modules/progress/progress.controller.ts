import { Controller, Get, Post, Param, Query, Request, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('me')
  me(@Request() req: any) {
    return this.progressService.getUserProgress(req.user.id);
  }

  @Get('journey')
  journey(@Request() req: any, @Query('track') track?: string) {
    const t = track === 'MSA' || track === 'RELIGION' ? track : 'DARIJA';
    return this.progressService.getJourney(req.user.id, t);
  }

  @Post('complete/:lessonId')
  complete(@Request() req: any, @Param('lessonId') lessonId: string) {
    return this.progressService.completeLesson(req.user.id, lessonId);
  }
}
