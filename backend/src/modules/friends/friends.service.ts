import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  async sendRequest(fromId: string, toId: string) {
    return this.prisma.friendRequest.create({ data: { fromId, toId } })
  }

  async listRequestsFor(userId: string) {
    return this.prisma.friendRequest.findMany({ where: { toId: userId, status: 'pending' } })
  }

  async respond(requestId: string, accept: boolean) {
    const req = await this.prisma.friendRequest.update({ where: { id: requestId }, data: { status: accept ? 'accepted' : 'rejected' } })
    if (accept) {
      // create reciprocal entries or handle friends list elsewhere
    }
    return req
  }

  async remove(requestId: string) {
    return this.prisma.friendRequest.delete({ where: { id: requestId } })
  }
}
