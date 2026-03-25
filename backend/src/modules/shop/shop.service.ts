import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ShopService {
  constructor(private readonly prisma: PrismaService) {}

  async listItems() {
    return this.prisma.shopItem.findMany({
      where: { isAvailable: true },
      orderBy: [{ category: 'asc' }, { price: 'asc' }],
    });
  }

  async getUserInventory(userId: string) {
    return this.prisma.userInventory.findMany({
      where: { userId },
      include: { item: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async buyItem(userId: string, itemKey: string) {
    const item = await this.prisma.shopItem.findUnique({ where: { key: itemKey } });
    if (!item || !item.isAvailable) throw new NotFoundException('Article introuvable');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    if (user.gemmes < item.price) throw new BadRequestException('Gemmes insuffisantes');

    const effect = item.effect as any;

    // Deduct gemmes
    const newGemmes = user.gemmes - item.price;
    await this.prisma.user.update({ where: { id: userId }, data: { gemmes: newGemmes } });

    // Apply effect
    let applied: any = {};
    if (effect?.action === 'set_hearts') {
      const newHearts = Math.min(5, effect.value ?? 5);
      await this.prisma.user.update({ where: { id: userId }, data: { hearts: newHearts } });
      applied = { hearts: newHearts };
    } else {
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
      } else {
        await this.prisma.userInventory.create({
          data: { userId, itemKey, quantity: 1, isActive: item.category === 'cosmetic' ? false : true },
        });
        applied = { inventoryCreated: true };
      }
    }

    return { success: true, newGemmes, itemKey, applied };
  }

  async addGemmes(userId: string, amount: number) {
    if (amount <= 0) return;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;
    return this.prisma.user.update({
      where: { id: userId },
      data: { gemmes: user.gemmes + amount },
      select: { gemmes: true },
    });
  }
}
