import { PrismaService } from '../../prisma/prisma.service';
export declare class CoursesService {
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
    findLessonsByModule(moduleId: string): Promise<{
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
}
