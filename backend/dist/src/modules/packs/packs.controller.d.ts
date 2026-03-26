import { PacksService } from './packs.service';
export declare class PacksController {
    private svc;
    constructor(svc: PacksService);
    list(): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        difficulty: string | null;
        category: string | null;
        premiumOnly: boolean;
    }[]>;
    get(id: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        difficulty: string | null;
        category: string | null;
        premiumOnly: boolean;
    }>;
    words(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        languageId: string;
        word: string;
        transliteration: string | null;
        translation: import("@prisma/client/runtime/library").JsonValue | null;
        partOfSpeech: import(".prisma/client").$Enums.PartOfSpeech | null;
        examples: import("@prisma/client/runtime/library").JsonValue | null;
        tags: string[];
    }[]>;
}
