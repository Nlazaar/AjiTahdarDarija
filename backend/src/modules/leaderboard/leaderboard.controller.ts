import { Controller, Get, Req } from '@nestjs/common'
import { LeaderboardService } from './leaderboard.service'

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private svc: LeaderboardService) {}

  @Get('global')
  async global() { return this.svc.global() }

  @Get('weekly')
  async weekly() { return this.svc.weekly() }

  @Get('friends')
  async friends(@Req() req: any) { return this.svc.friends(req.user?.id) }
}
