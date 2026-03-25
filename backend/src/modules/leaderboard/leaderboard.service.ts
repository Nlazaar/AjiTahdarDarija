import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async global(limit = 50) {
    return this.prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: limit,
      select: { id: true, name: true, xp: true, level: true, streak: true },
    })
  }

  async weekly(limit = 50) {
    const since = new Date()
    since.setDate(since.getDate() - 7)
    return this.prisma.user.findMany({
      where: { updatedAt: { gt: since } },
      orderBy: { xp: 'desc' },
      take: limit,
      select: { id: true, name: true, xp: true, level: true, streak: true },
    })
  }

  async friendsRanking(userId: string) {
    const accepted = await this.prisma.friendRequest.findMany({
      where: { status: 'accepted', OR: [{ fromId: userId }, { toId: userId }] },
    })
    const friendIds = accepted.map(r => r.fromId === userId ? r.toId : r.fromId)
    const ids = [userId, ...friendIds]
    return this.prisma.user.findMany({
      where: { id: { in: ids } },
      orderBy: { xp: 'desc' },
      select: { id: true, name: true, xp: true, level: true, streak: true },
    })
  }
}
