import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const RARITY_PRICE: Record<string, number> = {
  common: 20,
  rare: 60,
  epic: 150,
  legendary: 400,
};

@Injectable()
export class CulturalService {
  constructor(private readonly prisma: PrismaService) {}

  async list(category?: string) {
    return this.prisma.culturalItem.findMany({
      where: category ? { category } : {},
      orderBy: [{ category: 'asc' }, { rarity: 'asc' }, { name: 'asc' }],
    });
  }

  async myCollection(userId: string) {
    return this.prisma.userCulturalUnlock.findMany({
      where: { userId },
      include: { item: true },
      orderBy: { unlockedAt: 'desc' },
    });
  }

  async unlock(userId: string, itemKey: string) {
    const item = await this.prisma.culturalItem.findUnique({ where: { key: itemKey } });
    if (!item) throw new NotFoundException('Objet culturel introuvable');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException();

    const price = RARITY_PRICE[item.rarity] ?? 50;
    if (user.gemmes < price) throw new BadRequestException('Gemmes insuffisantes');

    const existing = await this.prisma.userCulturalUnlock.findFirst({
      where: { userId, itemId: item.id },
    });
    if (existing) throw new BadRequestException('Déjà dans ta collection');

    await this.prisma.user.update({
      where: { id: userId },
      data: { gemmes: user.gemmes - price },
    });

    const unlock = await this.prisma.userCulturalUnlock.create({
      data: { userId, itemId: item.id, source: 'shop' },
      include: { item: true },
    });

    return { success: true, remainingGemmes: user.gemmes - price, unlock };
  }
}
