import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'


@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async global(limit = 50) {
    return this.prisma.user.findMany({ orderBy: { xp: 'desc' }, take: limit, select: { id: true, name: true, xp: true } })
  }

  async weekly(limit = 50) {
    const since = new Date()
    since.setDate(since.getDate() - 7)
    // naive: sum xp changes from UserProgress updatedAt; better with analytics events
    return this.prisma.user.findMany({ where: { updatedAt: { gt: since } }, orderBy: { xp: 'desc' }, take: limit, select: { id: true, name: true, xp: true } })
  }


  async friends(userId: string) {
    // placeholder: return top friends by xp
    // real implementation requires friends relation table
    return this.prisma.user.findMany({ orderBy: { xp: 'desc' }, take: 50, select: { id: true, name: true, xp: true } })
  }
}
