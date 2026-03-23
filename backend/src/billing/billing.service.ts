import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

const STRIPE_SECRET = process.env.STRIPE_SECRET || ''
let StripeClient: any = null
if (STRIPE_SECRET) {
  // late require so package isn't required if not used
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Stripe = require('stripe')
  StripeClient = new Stripe(STRIPE_SECRET, { apiVersion: '2022-11-15' })
}

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name)
  constructor(private prisma: PrismaService) {}

  async createCheckoutSession(userId: string | null, plan: 'monthly' | 'yearly' | 'free') {
    if (!StripeClient) {
      // fallback: return a dummy URL or error
      return { url: process.env.PAYMENT_FALLBACK_URL ?? 'https://example.com/checkout-placeholder' }
    }
    const priceLookup = {
      monthly: process.env.STRIPE_PRICE_MONTHLY,
      yearly: process.env.STRIPE_PRICE_YEARLY,
    }
    const priceId = priceLookup[plan as 'monthly' | 'yearly']
    if (!priceId) throw new Error('Price not configured')
    const session = await StripeClient.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: process.env.STRIPE_SUCCESS_URL || 'https://example.com/success',
      cancel_url: process.env.STRIPE_CANCEL_URL || 'https://example.com/cancel',
      metadata: { userId: userId ?? '' },
    })
    return { url: session.url }
  }

  async handleWebhook(payload: any, sig?: string) {
    // Minimal handling: react to checkout.session.completed
    try {
      const evt = payload // assume already parsed
      if (evt.type === 'checkout.session.completed') {
        const session = evt.data.object
        const userId = session.metadata?.userId
        // mark subscription active; expiry handled via webhook/subscription events in real implementation
        if (userId) {
          await this.prisma.user.update({ where: { id: userId }, data: { subscriptionStatus: 'active' } })
        }
      }
    } catch (e) {
      this.logger.error('Webhook processing failed', e as any)
    }
  }

  async getStatus(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { subscriptionStatus: true, subscriptionExpiresAt: true } })
    return user || { subscriptionStatus: 'free', subscriptionExpiresAt: null }
  }
}
