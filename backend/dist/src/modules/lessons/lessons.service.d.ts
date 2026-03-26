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
        moduleId: string | null;
        authorId: string | null;
        languageId: string;
    }[]>;
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
}
export {};
