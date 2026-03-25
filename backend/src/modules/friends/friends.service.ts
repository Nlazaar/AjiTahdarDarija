import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  async sendRequest(fromId: string, toEmail: string) {
    const to = await this.prisma.user.findUnique({ where: { email: toEmail.toLowerCase() } })
    if (!to) throw new Error('Utilisateur introuvable')
    if (to.id === fromId) throw new Error('Tu ne peux pas t\'ajouter toi-même')
    const existing = await this.prisma.friendRequest.findFirst({
      where: { fromId, toId: to.id, status: 'pending' },
    })
    if (existing) throw new Error('Demande déjà envoyée')
    return this.prisma.friendRequest.create({ data: { fromId, toId: to.id } })
  }

  async listIncoming(userId: string) {
    const requests = await this.prisma.friendRequest.findMany({
      where: { toId: userId, status: 'pending' },
    })
    const senderIds = requests.map(r => r.fromId)
    const senders = await this.prisma.user.findMany({
      where: { id: { in: senderIds } },
      select: { id: true, name: true, email: true, xp: true, level: true },
    })
    const senderMap = new Map(senders.map(s => [s.id, s]))
    return requests.map(r => ({ ...r, from: senderMap.get(r.fromId) ?? null }))
  }

  async listFriends(userId: string) {
    const accepted = await this.prisma.friendRequest.findMany({
      where: { status: 'accepted', OR: [{ fromId: userId }, { toId: userId }] },
    })
    const friendIds = accepted.map(r => r.fromId === userId ? r.toId : r.fromId)
    return this.prisma.user.findMany({
      where: { id: { in: friendIds } },
      select: { id: true, name: true, email: true, xp: true, level: true, streak: true },
      orderBy: { xp: 'desc' },
    })
  }

  async respond(requestId: string, userId: string, accept: boolean) {
    const req = await this.prisma.friendRequest.findFirst({ where: { id: requestId, toId: userId } })
    if (!req) throw new Error('Demande introuvable')
    return this.prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: accept ? 'accepted' : 'rejected' },
    })
  }

  async remove(requestId: string, userId: string) {
    const req = await this.prisma.friendRequest.findFirst({
      where: { id: requestId, OR: [{ fromId: userId }, { toId: userId }] },
    })
    if (!req) throw new Error('Introuvable')
    return this.prisma.friendRequest.delete({ where: { id: requestId } })
  }

  async searchUsers(q: string, currentUserId: string) {
    if (q.length < 2) return []
    return this.prisma.user.findMany({
      where: {
        id: { not: currentUserId },
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: { id: true, name: true, email: true, xp: true, level: true },
      take: 10,
    })
  }
}
