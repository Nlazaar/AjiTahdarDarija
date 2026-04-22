import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { UserVocabularyService } from './user-vocabulary.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('user-vocabulary')
export class UserVocabularyController {
  constructor(private readonly svc: UserVocabularyService) {}

  @Post('seen')
  seen(@Request() req: any, @Body() body: { vocabularyId: string }) {
    return this.svc.seen(req.user.id, body.vocabularyId);
  }

  @Post(':id/result')
  result(
    @Request() req: any,
    @Param('id') vocabularyId: string,
    @Body() body: { correct: boolean },
  ) {
    return this.svc.result(req.user.id, vocabularyId, !!body.correct);
  }

  @Get('due')
  due(@Request() req: any, @Query('limit') limit?: string) {
    const n = limit ? Math.max(1, Math.min(50, parseInt(limit, 10) || 20)) : 20;
    return this.svc.due(req.user.id, n);
  }

  @Get('stats')
  stats(@Request() req: any) {
    return this.svc.stats(req.user.id);
  }
}
