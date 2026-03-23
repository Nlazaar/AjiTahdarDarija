import { Controller, Get, Param, Post, Req } from '@nestjs/common'
import { LeaguesService } from './leagues.service'

@Controller('leagues')
export class LeaguesController {
  constructor(private svc: LeaguesService) {}

  @Get('me')
  async me(@Req() req: any) { return this.svc.getLeagueFor(req.user?.id) }

  @Get('standings/:league')
  async standings(@Param('league') league: string) { return this.svc.getLeagueStandings(league) }

  @Post('assign/:league')
  async assign(@Req() req: any, @Param('league') league: string) { return this.svc.assignLeague(req.user?.id, league) }
}
