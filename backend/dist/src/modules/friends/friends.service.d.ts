import { PrismaService } from '../../prisma/prisma.service';
export declare class FriendsService {
    private prisma;
    constructor(prisma: PrismaService);
    sendRequest(fromId: string, toEmail: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        fromId: string;
        toId: string;
    }>;
    listIncoming(userId: string): Promise<{
        from: {
            email: string;
            name: string;
            id: string;
            xp: number;
            level: number;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        fromId: string;
        toId: string;
    }[]>;
    listFriends(userId: string): Promise<{
        email: string;
        name: string;
        id: string;
        xp: number;
        level: number;
        streak: number;
    }[]>;
    respond(requestId: string, userId: string, accept: boolean): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        fromId: string;
        toId: string;
    }>;
    remove(requestId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        fromId: string;
        toId: string;
    }>;
    searchUsers(q: string, currentUserId: string): Promise<{
        email: string;
        name: string;
        id: string;
        xp: number;
        level: number;
    }[]>;
}
