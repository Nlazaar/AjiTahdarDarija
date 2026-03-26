import { LessonsService } from './lessons.service';
export declare class LessonsController {
    private readonly lessonsService;
    constructor(lessonsService: LessonsService);
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
    getExercises(id: string): Promise<{
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
    submit(id: string, req: any, body: any): Promise<{
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
