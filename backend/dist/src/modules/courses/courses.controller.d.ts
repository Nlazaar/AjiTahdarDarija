import { CoursesService } from './courses.service';
export declare class CoursesController {
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
}
