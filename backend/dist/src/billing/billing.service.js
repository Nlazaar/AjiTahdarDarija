"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BillingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const STRIPE_SECRET = process.env.STRIPE_SECRET || '';
let StripeClient = null;
if (STRIPE_SECRET) {
    // late require so package isn't required if not used
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Stripe = require('stripe');
    StripeClient = new Stripe(STRIPE_SECRET, { apiVersion: '2022-11-15' });
}
let BillingService = BillingService_1 = class BillingService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(BillingService_1.name);
    }
    async createCheckoutSession(userId, plan) {
        if (!StripeClient) {
            // fallback: return a dummy URL or error
            return { url: process.env.PAYMENT_FALLBACK_URL ?? 'https://example.com/checkout-placeholder' };
        }
        const priceLookup = {
            monthly: process.env.STRIPE_PRICE_MONTHLY,
            yearly: process.env.STRIPE_PRICE_YEARLY,
        };
        const priceId = priceLookup[plan];
        if (!priceId)
            throw new Error('Price not configured');
        const session = await StripeClient.checkout.sessions.create({
            mode: 'subscription',
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: process.env.STRIPE_SUCCESS_URL || 'https://example.com/success',
            cancel_url: process.env.STRIPE_CANCEL_URL || 'https://example.com/cancel',
            metadata: { userId: userId ?? '' },
        });
        return { url: session.url };
    }
    async handleWebhook(payload, sig) {
        // Minimal handling: react to checkout.session.completed
        try {
            const evt = payload; // assume already parsed
            if (evt.type === 'checkout.session.completed') {
                const session = evt.data.object;
                const userId = session.metadata?.userId;
                // mark subscription active; expiry handled via webhook/subscription events in real implementation
                if (userId) {
                    await this.prisma.user.update({ where: { id: userId }, data: { subscriptionStatus: 'active' } });
                }
            }
        }
        catch (e) {
            this.logger.error('Webhook processing failed', e);
        }
    }
    async getStatus(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { subscriptionStatus: true, subscriptionExpiresAt: true } });
        return user || { subscriptionStatus: 'free', subscriptionExpiresAt: null };
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = BillingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BillingService);
