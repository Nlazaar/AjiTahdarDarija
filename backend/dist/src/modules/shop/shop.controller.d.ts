import { ShopService } from './shop.service';
export declare class ShopController {
    private readonly shopService;
    constructor(shopService: ShopService);
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
    getInventory(req: any): Promise<({
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
    buy(key: string, req: any): Promise<{
        success: boolean;
        newGemmes: number;
        itemKey: string;
        applied: any;
    }>;
}
