import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { QuestsService } from './quests.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('quests')
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Get()
  getState(@Request() req: any) {
    return this.questsService.getQuestState(req.user.id);
  }

  @Post('claim/:key')
  claim(@Param('key') key: string, @Request() req: any) {
    return this.questsService.claimReward(req.user.id, key);
  }
}
