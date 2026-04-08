import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { TTLCacheService } from '../../common/cache/ttl-cache.service'

const GLOBAL_TTL  = 60       // 1 minute
const WEEKLY_TTL  = 120      // 2 minutes

@Injectable()
export class LeaderboardService {
  private readonly logger = new Logger(LeaderboardService.name)

  constructor(
    private prisma: PrismaService,
    private cache: TTLCacheService,
  ) {}

  async global(limit = 50) {
    const key = `lb:global:${limit}`
    const cached = this.cache.get<any[]>(key)
    if (cached) return cached

    const result = await this.prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: limit,
      select: { id: true, name: true, xp: true, level: true, streak: true },
    })
    this.cache.set(key, result, GLOBAL_TTL)
    return result
  }

  async weekly(limit = 50) {
    const key = `lb:weekly:${limit}`
    const cached = this.cache.get<any[]>(key)
    if (cached) return cached

    const since = new Date()
    since.setDate(since.getDate() - 7)
    const result = await this.prisma.user.findMany({
      where: { updatedAt: { gt: since } },
      orderBy: { xp: 'desc' },
      take: limit,
      select: { id: true, name: true, xp: true, level: true, streak: true },
    })
    this.cache.set(key, result, WEEKLY_TTL)
    return result
  }

  async myRank(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { xp: true } })
    if (!user) return { rank: null, xp: 0 }
    const ahead = await this.prisma.user.count({ where: { xp: { gt: user.xp } } })
    return { rank: ahead + 1, xp: user.xp }
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
