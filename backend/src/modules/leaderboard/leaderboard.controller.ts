import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import { LeaderboardService } from './leaderboard.service'
import { JwtGuard } from '../auth/guards/jwt.guard'

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private svc: LeaderboardService) {}

  @Get('global')
  global() { return this.svc.global() }

  @UseGuards(JwtGuard)
  @Get('weekly')
  weekly() { return this.svc.weekly() }

  @UseGuards(JwtGuard)
  @Get('friends')
  friends(@Request() req: any) { return this.svc.friendsRanking(req.user.id) }
}
