import { CoursesService } from '../courses/courses.service';
export declare class ModulesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
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
    lessons(id: string): Promise<{
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
