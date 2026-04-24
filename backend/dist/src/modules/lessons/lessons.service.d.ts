import { PrismaService } from '../../prisma/prisma.service';
import { QuestsService } from '../quests/quests.service';
type AnswerPayload = {
    exerciseId: string;
    answer: any;
}[];
export declare class LessonsService {
    private readonly prisma;
    private readonly questsService;
    constructor(prisma: PrismaService, questsService: QuestsService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        level: number;
        title: string;
        subtitle: string | null;
        description: string | null;
        slug: string | null;
        isPublished: boolean;
        order: number;
        content: import("@prisma/client/runtime/library").JsonValue | null;
        duration: number | null;
        videoUrl: string | null;
        videoPoster: string | null;
        moduleId: string | null;
        authorId: string | null;
        languageId: string;
    }[]>;
    listLanguages(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        code: string;
    }[]>;
    listModulesForAdmin(): Promise<{
        id: string;
        level: number;
        title: string;
        slug: string;
        isPublished: boolean;
    }[]>;
    create(data: {
        title: string;
        languageId: string;
        moduleId?: string;
        slug?: string;
        subtitle?: string;
        description?: string;
        content?: any;
        order?: number;
        duration?: number;
        level?: number;
        videoUrl?: string;
        videoPoster?: string;
        isPublished?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        level: number;
        title: string;
        subtitle: string | null;
        description: string | null;
        slug: string | null;
        isPublished: boolean;
        order: number;
        content: import("@prisma/client/runtime/library").JsonValue | null;
        duration: number | null;
        videoUrl: string | null;
        videoPoster: string | null;
        moduleId: string | null;
        authorId: string | null;
        languageId: string;
    }>;
    update(id: string, data: Partial<{
        title: string;
        moduleId: string | null;
        slug: string | null;
        subtitle: string | null;
        description: string | null;
        content: any;
        order: number;
        duration: number | null;
        level: number;
        videoUrl: string | null;
        videoPoster: string | null;
        isPublished: boolean;
        languageId: string;
    }>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        level: number;
        title: string;
        subtitle: string | null;
        description: string | null;
        slug: string | null;
        isPublished: boolean;
        order: number;
        content: import("@prisma/client/runtime/library").JsonValue | null;
        duration: number | null;
        videoUrl: string | null;
        videoPoster: string | null;
        moduleId: string | null;
        authorId: string | null;
        languageId: string;
    }>;
    softDelete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        level: number;
        title: string;
        subtitle: string | null;
        description: string | null;
        slug: string | null;
        isPublished: boolean;
        order: number;
        content: import("@prisma/client/runtime/library").JsonValue | null;
        duration: number | null;
        videoUrl: string | null;
        videoPoster: string | null;
        moduleId: string | null;
        authorId: string | null;
        languageId: string;
    }>;
    hardDelete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        level: number;
        title: string;
        subtitle: string | null;
        description: string | null;
        slug: string | null;
        isPublished: boolean;
        order: number;
        content: import("@prisma/client/runtime/library").JsonValue | null;
        duration: number | null;
        videoUrl: string | null;
        videoPoster: string | null;
        moduleId: string | null;
        authorId: string | null;
        languageId: string;
    }>;
    /**
     * Met à jour la séquence d'exercices d'une leçon (typologies + items vocab).
     * Stocke dans Lesson.content : { sequence: string[], itemIds: string[], mode?: 'lettre'|'mot' }
     * Préserve les autres clés de content déjà présentes.
     */
    updateSequence(id: string, payload: {
        sequence?: string[];
        itemIds?: string[];
        mode?: 'lettre' | 'mot';
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        level: number;
        title: string;
        subtitle: string | null;
        description: string | null;
        slug: string | null;
        isPublished: boolean;
        order: number;
        content: import("@prisma/client/runtime/library").JsonValue | null;
        duration: number | null;
        videoUrl: string | null;
        videoPoster: string | null;
        moduleId: string | null;
        authorId: string | null;
        languageId: string;
    }>;
    findBySlug(slug: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        level: number;
        title: string;
        subtitle: string | null;
        description: string | null;
        slug: string | null;
        isPublished: boolean;
        order: number;
        content: import("@prisma/client/runtime/library").JsonValue | null;
        duration: number | null;
        videoUrl: string | null;
        videoPoster: string | null;
        moduleId: string | null;
        authorId: string | null;
        languageId: string;
    }>;
    findOne(id: string): Promise<{
        _count: {
            exercises: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        level: number;
        title: string;
        subtitle: string | null;
        description: string | null;
        slug: string | null;
        isPublished: boolean;
        order: number;
        content: import("@prisma/client/runtime/library").JsonValue | null;
        duration: number | null;
        videoUrl: string | null;
        videoPoster: string | null;
        moduleId: string | null;
        authorId: string | null;
        languageId: string;
    }>;
    getExercises(lessonId: string): Promise<{
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
    }[]>;
    getVocabulary(lessonId: string): Promise<{
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
    /**
     * Submit answers for a lesson. Returns score, errors, xpEarned and updated progress.
     * Simple scoring: exact equality for answers; XP = sum(points) for correct answers.
     */
    submit(lessonId: string, userId: string, answers: AnswerPayload): Promise<{
        score: number;
        errors: {
            exerciseId: string;
            expected: any;
            got: any;
        }[];
        xpEarned: number;
        gemmesEarned: number;
        progress: any;
    }>;
    private static readonly KNOWN_TYPOLOGIES;
    listAuthoredExercises(lessonId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        order: number;
        lessonId: string;
        typology: string;
        config: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    listAuthoredExercisesAdmin(lessonId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        order: number;
        lessonId: string;
        typology: string;
        config: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    createAuthoredExercise(lessonId: string, data: {
        typology?: string;
        config?: any;
        order?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        order: number;
        lessonId: string;
        typology: string;
        config: import("@prisma/client/runtime/library").JsonValue;
    }>;
    updateAuthoredExercise(lessonId: string, exId: string, data: {
        typology?: string;
        config?: any;
        order?: number;
        isPublished?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        order: number;
        lessonId: string;
        typology: string;
        config: import("@prisma/client/runtime/library").JsonValue;
    }>;
    deleteAuthoredExercise(lessonId: string, exId: string): Promise<{
        ok: boolean;
    }>;
    reorderVocabulary(lessonId: string, orderedIds: string[]): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        level: number;
        title: string;
        subtitle: string | null;
        description: string | null;
        slug: string | null;
        isPublished: boolean;
        order: number;
        content: import("@prisma/client/runtime/library").JsonValue | null;
        duration: number | null;
        videoUrl: string | null;
        videoPoster: string | null;
        moduleId: string | null;
        authorId: string | null;
        languageId: string;
    }>;
    reorderAuthoredExercises(lessonId: string, orderedIds: string[]): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        order: number;
        lessonId: string;
        typology: string;
        config: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
}
export {};
