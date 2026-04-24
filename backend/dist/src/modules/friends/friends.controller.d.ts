import { FriendsService } from './friends.service';
export declare class FriendsController {
    private svc;
    constructor(svc: FriendsService);
    list(req: any): Promise<{
        email: string;
        name: string;
        id: string;
        xp: number;
        level: number;
        streak: number;
    }[]>;
    incoming(req: any): Promise<{
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
    search(req: any, q: string): Promise<{
        email: string;
        name: string;
        id: string;
        xp: number;
        level: number;
    }[]>;
    send(req: any, body: {
        email: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        fromId: string;
        toId: string;
    }>;
    respond(req: any, id: string, body: {
        accept: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        fromId: string;
        toId: string;
    }>;
    remove(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        fromId: string;
        toId: string;
    }>;
}
