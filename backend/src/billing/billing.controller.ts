import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common'
import { BillingService } from './billing.service'

@Controller('billing')
export class BillingController {
  constructor(private svc: BillingService) {}

  @Post('create-session')
  async createSession(@Req() req: any, @Body() body: { plan: 'monthly' | 'yearly' | 'free' }) {
    const userId = req.user?.id ?? null
    const plan = body.plan ?? 'monthly'
    const s = await this.svc.createCheckoutSession(userId, plan)
    return { url: s.url }
  }

  @Post('webhook')
  async webhook(@Req() req: any, @Res() res: any) {
    // For simplicity, accept parsed payload
    const payload = req.body
    await this.svc.handleWebhook(payload, req.headers['stripe-signature'])
    res.status(200).send('ok')
  }

  @Get('status')
  async status(@Req() req: any) {
    const userId = req.user?.id
    if (!userId) return { subscriptionStatus: 'free' }
    return this.svc.getStatus(userId)
  }
}
