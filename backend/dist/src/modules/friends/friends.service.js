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
exports.FriendsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let FriendsService = class FriendsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sendRequest(fromId, toEmail) {
        const to = await this.prisma.user.findUnique({ where: { email: toEmail.toLowerCase() } });
        if (!to)
            throw new Error('Utilisateur introuvable');
        if (to.id === fromId)
            throw new Error('Tu ne peux pas t\'ajouter toi-même');
        const existing = await this.prisma.friendRequest.findFirst({
            where: { fromId, toId: to.id, status: 'pending' },
        });
        if (existing)
            throw new Error('Demande déjà envoyée');
        return this.prisma.friendRequest.create({ data: { fromId, toId: to.id } });
    }
    async listIncoming(userId) {
        const requests = await this.prisma.friendRequest.findMany({
            where: { toId: userId, status: 'pending' },
        });
        const senderIds = requests.map(r => r.fromId);
        const senders = await this.prisma.user.findMany({
            where: { id: { in: senderIds } },
            select: { id: true, name: true, email: true, xp: true, level: true },
        });
        const senderMap = new Map(senders.map(s => [s.id, s]));
        return requests.map(r => ({ ...r, from: senderMap.get(r.fromId) ?? null }));
    }
    async listFriends(userId) {
        const accepted = await this.prisma.friendRequest.findMany({
            where: { status: 'accepted', OR: [{ fromId: userId }, { toId: userId }] },
        });
        const friendIds = accepted.map(r => r.fromId === userId ? r.toId : r.fromId);
        return this.prisma.user.findMany({
            where: { id: { in: friendIds } },
            select: { id: true, name: true, email: true, xp: true, level: true, streak: true },
            orderBy: { xp: 'desc' },
        });
    }
    async respond(requestId, userId, accept) {
        const req = await this.prisma.friendRequest.findFirst({ where: { id: requestId, toId: userId } });
        if (!req)
            throw new Error('Demande introuvable');
        return this.prisma.friendRequest.update({
            where: { id: requestId },
            data: { status: accept ? 'accepted' : 'rejected' },
        });
    }
    async remove(requestId, userId) {
        const req = await this.prisma.friendRequest.findFirst({
            where: { id: requestId, OR: [{ fromId: userId }, { toId: userId }] },
        });
        if (!req)
            throw new Error('Introuvable');
        return this.prisma.friendRequest.delete({ where: { id: requestId } });
    }
    async searchUsers(q, currentUserId) {
        if (q.length < 2)
            return [];
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
        });
    }
};
exports.FriendsService = FriendsService;
exports.FriendsService = FriendsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FriendsService);
