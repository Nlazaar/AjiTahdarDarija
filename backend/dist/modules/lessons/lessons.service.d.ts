import { PrismaService } from '../../prisma/prisma.service';
type AnswerPayload = {
    exerciseId: string;
    answer: any;
}[];
export declare class LessonsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        level: number;
        title: string;
        subtitle: string | null;
        description: string | null;
        content: import("@prisma/client/runtime/library").JsonValue | null;
        order: number;
        duration: number | null;
        isPublished: boolean;
        moduleId: string | null;
        authorId: string | null;
        languageId: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        level: number;
        title: string;
        subtitle: string | null;
        description: string | null;
        content: import("@prisma/client/runtime/library").JsonValue | null;
        order: number;
        duration: number | null;
        isPublished: boolean;
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
    create(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        level: number;
        title: string;
        subtitle: string | null;
        description: string | null;
        content: import("@prisma/client/runtime/library").JsonValue | null;
        order: number;
        duration: number | null;
        isPublished: boolean;
        moduleId: string | null;
        authorId: string | null;
        languageId: string;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        level: number;
        title: string;
        subtitle: string | null;
        description: string | null;
        content: import("@prisma/client/runtime/library").JsonValue | null;
        order: number;
        duration: number | null;
        isPublished: boolean;
        moduleId: string | null;
        authorId: string | null;
        languageId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        level: number;
        title: string;
        subtitle: string | null;
        description: string | null;
        content: import("@prisma/client/runtime/library").JsonValue | null;
        order: number;
        duration: number | null;
        isPublished: boolean;
        moduleId: string | null;
        authorId: string | null;
        languageId: string;
    }>;
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
        progress: any;
    }>;
}
export {};
