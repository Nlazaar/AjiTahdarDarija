import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async logEvent(userId: string | null, type: string, payload: any) {
    return this.prisma.analyticsEvent.create({ data: { userId: userId ?? null, type, payload } })
  }

  async queryRecent(limit = 100) {
    return this.prisma.analyticsEvent.findMany({ orderBy: { createdAt: 'desc' }, take: limit })
  }
}
