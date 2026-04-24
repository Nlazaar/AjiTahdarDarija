import { PrismaService } from '../../prisma/prisma.service';
export declare class VocabularyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(params?: {
        languageId?: string;
        lessonId?: string;
        q?: string;
        includeDrafts?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        languageId: string;
        word: string;
        transliteration: string | null;
        translation: import("@prisma/client/runtime/library").JsonValue | null;
        audioUrl: string | null;
        imageUrl: string | null;
        partOfSpeech: import(".prisma/client").$Enums.PartOfSpeech | null;
        examples: import("@prisma/client/runtime/library").JsonValue | null;
        tags: string[];
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        languageId: string;
        word: string;
        transliteration: string | null;
        translation: import("@prisma/client/runtime/library").JsonValue | null;
        audioUrl: string | null;
        imageUrl: string | null;
        partOfSpeech: import(".prisma/client").$Enums.PartOfSpeech | null;
        examples: import("@prisma/client/runtime/library").JsonValue | null;
        tags: string[];
    }>;
    /**
     * Retourne un item du jour, déterministe selon la date courante (UTC).
     * Choix dans le pool des items publiés (filtrage langue optionnel).
     */
    daily(params?: {
        languageId?: string;
    }): Promise<{
        id: string;
        word: string;
        transliteration: string;
        translation: import("@prisma/client/runtime/library").JsonValue;
        audioUrl: string;
    }>;
    create(data: {
        word: string;
        languageId: string;
        transliteration?: string;
        translation?: any;
        audioUrl?: string;
        imageUrl?: string;
        tags?: string[];
        isPublished?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        languageId: string;
        word: string;
        transliteration: string | null;
        translation: import("@prisma/client/runtime/library").JsonValue | null;
        audioUrl: string | null;
        imageUrl: string | null;
        partOfSpeech: import(".prisma/client").$Enums.PartOfSpeech | null;
        examples: import("@prisma/client/runtime/library").JsonValue | null;
        tags: string[];
    }>;
    update(id: string, data: Partial<{
        word: string;
        transliteration: string | null;
        translation: any;
        audioUrl: string | null;
        imageUrl: string | null;
        tags: string[];
        isPublished: boolean;
    }>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        languageId: string;
        word: string;
        transliteration: string | null;
        translation: import("@prisma/client/runtime/library").JsonValue | null;
        audioUrl: string | null;
        imageUrl: string | null;
        partOfSpeech: import(".prisma/client").$Enums.PartOfSpeech | null;
        examples: import("@prisma/client/runtime/library").JsonValue | null;
        tags: string[];
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        languageId: string;
        word: string;
        transliteration: string | null;
        translation: import("@prisma/client/runtime/library").JsonValue | null;
        audioUrl: string | null;
        imageUrl: string | null;
        partOfSpeech: import(".prisma/client").$Enums.PartOfSpeech | null;
        examples: import("@prisma/client/runtime/library").JsonValue | null;
        tags: string[];
    }>;
    /**
     * Sauvegarde un fichier audio uploadé (mp3/wav) sous public/audio/vocab/<sha>.mp3
     * et met à jour Vocabulary.audioUrl avec l'URL publique.
     */
    saveAudio(id: string, file: {
        buffer: Buffer;
        mimetype: string;
        originalname: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        languageId: string;
        word: string;
        transliteration: string | null;
        translation: import("@prisma/client/runtime/library").JsonValue | null;
        audioUrl: string | null;
        imageUrl: string | null;
        partOfSpeech: import(".prisma/client").$Enums.PartOfSpeech | null;
        examples: import("@prisma/client/runtime/library").JsonValue | null;
        tags: string[];
    }>;
    /**
     * Lie un vocabulaire à une leçon en créant un Exercise minimal de type LISTENING
     * (ou retourne celui existant). Idempotent — ne crée pas de doublon.
     */
    attachToLesson(vocabularyId: string, lessonId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        type: import(".prisma/client").$Enums.ExerciseType;
        prompt: string | null;
        answer: import("@prisma/client/runtime/library").JsonValue | null;
        points: number;
        lessonId: string | null;
        vocabularyId: string | null;
    }>;
    detachFromLesson(vocabularyId: string, lessonId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
