import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

const LEAGUES = ['Bronze','Silver','Gold','Diamond','Master']

@Injectable()
export class LeaguesService {
  constructor(private prisma: PrismaService) {}

  async getLeagueFor(userId: string) {
    return this.prisma.leagueMembership.findFirst({ where: { userId } })
  }

  async getLeagueStandings(league: string, limit = 50) {
    return this.prisma.leagueMembership.findMany({ where: { league }, orderBy: { points: 'desc' }, take: limit })
  }

  async assignLeague(userId: string, league: string) {
    if (!LEAGUES.includes(league)) throw new Error('Invalid league')
    return this.prisma.leagueMembership.upsert({ where: { userId }, create: { userId, league }, update: { league } })
  }
}
