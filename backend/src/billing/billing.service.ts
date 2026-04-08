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

  async handleWebhook(rawBody: Buffer, sig?: string) {
    if (!StripeClient) {
      this.logger.warn('Stripe not configured — webhook ignored')
      return
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      this.logger.error('STRIPE_WEBHOOK_SECRET is not set — cannot validate webhook')
      throw new Error('Webhook secret not configured')
    }

    let evt: any
    try {
      // Valider la signature HMAC Stripe pour prévenir les requêtes forgées
      evt = StripeClient.webhooks.constructEvent(rawBody, sig ?? '', webhookSecret)
    } catch (e) {
      this.logger.error('Stripe webhook signature validation failed', e as any)
      throw new Error('Invalid webhook signature')
    }

    try {
      if (evt.type === 'checkout.session.completed') {
        const session = evt.data.object
        const userId = session.metadata?.userId
        if (userId) {
          await this.prisma.user.update({ where: { id: userId }, data: { subscriptionStatus: 'active' } })
          this.logger.log(`Subscription activated for user ${userId}`)
        }
      } else if (evt.type === 'customer.subscription.deleted') {
        const sub = evt.data.object
        const userId = sub.metadata?.userId
        if (userId) {
          await this.prisma.user.update({ where: { id: userId }, data: { subscriptionStatus: 'free' } })
          this.logger.log(`Subscription cancelled for user ${userId}`)
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
