import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { GamificationService } from './gamification.service';

@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Post('xp')
  async addXp(@Body() body: { userId: string; amount: number }) {
    const { userId, amount } = body;
    const res = await this.gamificationService.addXp(userId, amount);
    return res;
  }

  @Post('streak')
  async streak(@Body() body: { userId: string; date?: string }) {
    const { userId, date } = body;
    const today = date ? new Date(date) : new Date();
    return this.gamificationService.updateStreak(userId, today);
  }

  @Post('hearts')
  async hearts(@Body() body: { userId: string; delta: number }) {
    const { userId, delta } = body;
    return this.gamificationService.adjustHearts(userId, delta);
  }

  @Get('badges')
  async badges(@Query('userId') userId?: string) {
    return this.gamificationService.listBadges(userId as string | undefined);
  }
}
