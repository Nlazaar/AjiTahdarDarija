import { PrismaService } from '../../prisma/prisma.service';
export declare class ShopService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listItems(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        description: string;
        key: string;
        icon: string;
        category: string;
        price: number;
        effect: import("@prisma/client/runtime/library").JsonValue | null;
        isAvailable: boolean;
    }[]>;
    getUserInventory(userId: string): Promise<({
        item: {
            name: string;
            id: string;
            createdAt: Date;
            description: string;
            key: string;
            icon: string;
            category: string;
            price: number;
            effect: import("@prisma/client/runtime/library").JsonValue | null;
            isAvailable: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        itemKey: string;
        quantity: number;
        isActive: boolean;
        expiresAt: Date | null;
    })[]>;
    buyItem(userId: string, itemKey: string): Promise<{
        success: boolean;
        newGemmes: number;
        itemKey: string;
        applied: any;
    }>;
    addGemmes(userId: string, amount: number): Promise<{
        gemmes: number;
    }>;
}
