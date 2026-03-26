import { Controller, Get, Post, Param, Request, UseGuards } from '@nestjs/common';
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

  @Post('complete/:lessonId')
  complete(@Request() req: any, @Param('lessonId') lessonId: string) {
    return this.progressService.completeLesson(req.user.id, lessonId);
  }
}
