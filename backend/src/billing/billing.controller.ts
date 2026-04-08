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
    // rawBody requis pour la validation de signature HMAC Stripe
    const rawBody: Buffer = req.rawBody ?? Buffer.from(JSON.stringify(req.body))
    await this.svc.handleWebhook(rawBody, req.headers['stripe-signature'])
    res.status(200).send('ok')
  }

  @Get('status')
  async status(@Req() req: any) {
    const userId = req.user?.id
    if (!userId) return { subscriptionStatus: 'free' }
    return this.svc.getStatus(userId)
  }
}
