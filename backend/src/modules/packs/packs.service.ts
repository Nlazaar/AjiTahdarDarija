import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class PacksService {
  constructor(private prisma: PrismaService) {}

  async listAll() {
    return this.prisma.vocabularyPack.findMany({ orderBy: { createdAt: 'desc' } })
  }

  async getById(id: string) {
    return this.prisma.vocabularyPack.findUnique({ where: { id } })
  }

  async getWords(packId: string) {
    const items = await this.prisma.packWord.findMany({ where: { packId }, include: { vocabulary: true } })
    return items.map((i) => i.vocabulary)
  }
}
