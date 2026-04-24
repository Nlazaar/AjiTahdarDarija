import { CoursesService } from '../courses/courses.service';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../../storage/storage.service';
export declare class ModulesController {
    private readonly coursesService;
    private readonly prisma;
    private readonly storage;
    constructor(coursesService: CoursesService, prisma: PrismaService, storage: StorageService);
    /** GET /modules?track=DARIJA|MSA|RELIGION (publique — uniquement publiés) */
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
        videoUrl: string | null;
        videoPoster: string | null;
        moduleId: string | null;
        authorId: string | null;
        languageId: string;
    })[]>;
    listAllForAdmin(): Promise<({
        _count: {
            lessons: number;
        };
    } & {
        track: import(".prisma/client").$Enums.ModuleTrack;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        level: number;
        title: string;
        titleAr: string | null;
        subtitle: string | null;
        description: string | null;
        slug: string;
        canonicalOrder: number;
        colorA: string | null;
        colorB: string | null;
        shadowColor: string | null;
        cityName: string | null;
        cityNameAr: string | null;
        emoji: string | null;
        photoCaption: string | null;
        cityInfo: import("@prisma/client/runtime/library").JsonValue | null;
        isPublished: boolean;
    })[]>;
    create(body: any): Promise<{
        track: import(".prisma/client").$Enums.ModuleTrack;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        level: number;
        title: string;
        titleAr: string | null;
        subtitle: string | null;
        description: string | null;
        slug: string;
        canonicalOrder: number;
        colorA: string | null;
        colorB: string | null;
        shadowColor: string | null;
        cityName: string | null;
        cityNameAr: string | null;
        emoji: string | null;
        photoCaption: string | null;
        cityInfo: import("@prisma/client/runtime/library").JsonValue | null;
        isPublished: boolean;
    }>;
    update(id: string, body: any): Promise<{
        track: import(".prisma/client").$Enums.ModuleTrack;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        level: number;
        title: string;
        titleAr: string | null;
        subtitle: string | null;
        description: string | null;
        slug: string;
        canonicalOrder: number;
        colorA: string | null;
        colorB: string | null;
        shadowColor: string | null;
        cityName: string | null;
        cityNameAr: string | null;
        emoji: string | null;
        photoCaption: string | null;
        cityInfo: import("@prisma/client/runtime/library").JsonValue | null;
        isPublished: boolean;
    }>;
    remove(id: string, hard?: string): Promise<{
        track: import(".prisma/client").$Enums.ModuleTrack;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        level: number;
        title: string;
        titleAr: string | null;
        subtitle: string | null;
        description: string | null;
        slug: string;
        canonicalOrder: number;
        colorA: string | null;
        colorB: string | null;
        shadowColor: string | null;
        cityName: string | null;
        cityNameAr: string | null;
        emoji: string | null;
        photoCaption: string | null;
        cityInfo: import("@prisma/client/runtime/library").JsonValue | null;
        isPublished: boolean;
    }>;
    /**
     * Upload photo ville : multipart/form-data, champ "file".
     * Pipeline : multer(memory) → sharp (resize 1200px + WebP q80) → StorageService.
     * Nommage : `cities/{slug}-{uuid}.webp` (slug pour debug, uuid pour éviter
     * les collisions en cas de rename de ville).
     */
    uploadPhoto(id: string, file: Express.Multer.File | undefined): Promise<{
        url: string;
        key: string;
    }>;
}
