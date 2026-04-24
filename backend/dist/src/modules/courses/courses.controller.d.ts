import { CoursesService } from './courses.service';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    /** GET /courses?track=DARIJA|MSA|RELIGION */
    findAll(track?: string): Promise<{
        id: string;
        slug: string;
        title: string;
        titleAr: any;
        subtitle: string;
        level: number;
        track: import(".prisma/client").$Enums.ModuleTrack;
        canonicalOrder: number;
        colorA: string;
        colorB: string;
        shadowColor: string;
        cityName: any;
        cityNameAr: any;
        emoji: any;
        photoCaption: any;
        cityInfo: any;
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
