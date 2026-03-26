import { CoursesService } from './courses.service';
export declare class CoursesController {
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
}
