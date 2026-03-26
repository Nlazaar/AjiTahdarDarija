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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ShopService = class ShopService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listItems() {
        return this.prisma.shopItem.findMany({
            where: { isAvailable: true },
            orderBy: [{ category: 'asc' }, { price: 'asc' }],
        });
    }
    async getUserInventory(userId) {
        return this.prisma.userInventory.findMany({
            where: { userId },
            include: { item: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async buyItem(userId, itemKey) {
        const item = await this.prisma.shopItem.findUnique({ where: { key: itemKey } });
        if (!item || !item.isAvailable)
            throw new common_1.NotFoundException('Article introuvable');
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Utilisateur introuvable');
        if (user.gemmes < item.price)
            throw new common_1.BadRequestException('Gemmes insuffisantes');
        const effect = item.effect;
        // Deduct gemmes
        const newGemmes = user.gemmes - item.price;
        await this.prisma.user.update({ where: { id: userId }, data: { gemmes: newGemmes } });
        // Apply effect
        let applied = {};
        if (effect?.action === 'set_hearts') {
            const newHearts = Math.min(5, effect.value ?? 5);
            await this.prisma.user.update({ where: { id: userId }, data: { hearts: newHearts } });
            applied = { hearts: newHearts };
        }
        else {
            // Add to inventory (stack for stackable items, or create new)
            const existing = await this.prisma.userInventory.findFirst({
                where: { userId, itemKey, isActive: false, expiresAt: null },
            });
            if (existing && ['protect_streak', 'boost_xp'].includes(effect?.action)) {
                await this.prisma.userInventory.update({
                    where: { id: existing.id },
                    data: { quantity: existing.quantity + 1 },
                });
                applied = { inventoryUpdated: true };
            }
            else {
                await this.prisma.userInventory.create({
                    data: { userId, itemKey, quantity: 1, isActive: item.category === 'cosmetic' ? false : true },
                });
                applied = { inventoryCreated: true };
            }
        }
        return { success: true, newGemmes, itemKey, applied };
    }
    async addGemmes(userId, amount) {
        if (amount <= 0)
            return;
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            return;
        return this.prisma.user.update({
            where: { id: userId },
            data: { gemmes: user.gemmes + amount },
            select: { gemmes: true },
        });
    }
};
exports.ShopService = ShopService;
exports.ShopService = ShopService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShopService);
