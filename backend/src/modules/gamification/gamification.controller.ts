import { Controller, Post, Get, Body, Request, UseGuards, Query } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('me')
  getProfile(@Request() req: any) {
    return this.gamificationService.getFullProfile(req.user.id);
  }

  @Post('xp')
  addXp(@Request() req: any, @Body() body: { amount: number }) {
    return this.gamificationService.addXp(req.user.id, body.amount ?? 0);
  }

  @Post('streak')
  streak(@Request() req: any, @Body() body: { date?: string }) {
    const today = body?.date ? new Date(body.date) : new Date();
    return this.gamificationService.updateStreak(req.user.id, today);
  }

  @Post('hearts')
  hearts(@Request() req: any, @Body() body: { delta: number }) {
    return this.gamificationService.adjustHearts(req.user.id, body.delta ?? 0);
  }

  // Public: badges list (no auth required for public badge catalog)
  @Get('badges')
  @UseGuards()
  badges(@Query('userId') userId?: string) {
    return this.gamificationService.listBadges(userId);
  }
}
