import { PrismaService } from '../../prisma/prisma.service';
export declare class PacksService {
    private prisma;
    constructor(prisma: PrismaService);
    listAll(): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        difficulty: string | null;
        category: string | null;
        premiumOnly: boolean;
    }[]>;
    getById(id: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        difficulty: string | null;
        category: string | null;
        premiumOnly: boolean;
    }>;
    getWords(packId: string): Promise<{
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
