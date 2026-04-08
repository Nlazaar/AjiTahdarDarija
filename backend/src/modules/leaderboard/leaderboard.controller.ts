import { Controller, Get, Request, UseGuards, Query } from '@nestjs/common'
import { LeaderboardService } from './leaderboard.service'
import { JwtGuard } from '../auth/guards/jwt.guard'

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private svc: LeaderboardService) {}

  @Get('global')
  global(@Query('limit') limit?: string) {
    return this.svc.global(Math.min(parseInt(limit ?? '50') || 50, 100))
  }

  @UseGuards(JwtGuard)
  @Get('weekly')
  weekly(@Query('limit') limit?: string) {
    return this.svc.weekly(Math.min(parseInt(limit ?? '50') || 50, 100))
  }

  @UseGuards(JwtGuard)
  @Get('my-rank')
  myRank(@Request() req: any) { return this.svc.myRank(req.user.id) }

  @UseGuards(JwtGuard)
  @Get('friends')
  friends(@Request() req: any) { return this.svc.friendsRanking(req.user.id) }
}
