import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name)
  constructor(private prisma: PrismaService) {}

  /**
   * payload: { userId, items: [{ lessonId, answers, clientUpdatedAt }] }
   * naive implementation: update or create UserProgress, add xp, mark finished
   */
  async processSync(payload: any) {
    const results: any[] = []
    const userId = payload.userId
    if (!userId) return { error: 'missing userId' }
    for (const item of payload.items || []) {
      try {
        const lessonId = item.lessonId
        const answers = item.answers || []
        const score = (answers.filter((a:any)=>a.correct).length)
        const xp = Math.max(0, Math.floor(score * 10))
        // upsert progress
        const existing = await this.prisma.userProgress.findUnique({ where: { userId_lessonId: { userId, lessonId } } }).catch(()=>null)
        if (existing) {
          const updated = await this.prisma.userProgress.update({ where: { id: existing.id }, data: { progress: 100, completed: true, xpEarned: (existing.xpEarned||0)+xp, finishedAt: new Date() } })
          results.push({ lessonId, status: 'updated', xp })
        } else {
          const created = await this.prisma.userProgress.create({ data: { userId, lessonId, completed: true, progress: 100, xpEarned: xp } })
          results.push({ lessonId, status: 'created', xp })
        }
        // increment user xp
        await this.prisma.user.update({ where: { id: userId }, data: { xp: { increment: xp } } }).catch(()=>{})
      } catch (e) {
        this.logger.error('sync item failed', e as any)
        results.push({ lessonId: item.lessonId, status: 'error' })
      }
    }
    return { ok: true, results }
  }
}
