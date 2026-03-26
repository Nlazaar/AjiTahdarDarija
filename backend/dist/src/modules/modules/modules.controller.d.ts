import { CoursesService } from '../courses/courses.service';
export declare class ModulesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    findAll(): Promise<{
        id: string;
        title: string;
        subtitle: string;
        level: number;
        colorA: string;
        colorB: string;
        shadowColor: string;
        lessons: {
            id: string;
            title: string;
            label: string;
            slug: string;
            subtitle: string;
            order: number;
            moduleId: string;
        }[];
    }[]>;
    lessons(id: string): Promise<({
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
    })[]>;
}
