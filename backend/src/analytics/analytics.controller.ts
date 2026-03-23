import { Body, Controller, Post, Req } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'

@Controller('analytics')
export class AnalyticsController {
  constructor(private svc: AnalyticsService) {}

  @Post()
  async track(@Req() req: any, @Body() body: { type: string; payload?: any }) {
    const userId = req.user?.id ?? body.payload?.userId ?? null
    await this.svc.logEvent(userId, body.type, body.payload ?? {})
    return { ok: true }
  }
}
