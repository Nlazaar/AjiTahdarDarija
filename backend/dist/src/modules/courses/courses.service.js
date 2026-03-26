"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CoursesService = class CoursesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const modules = await this.prisma.module.findMany({
            include: { lessons: { orderBy: { order: 'asc' } } },
            orderBy: [{ level: 'asc' }, { createdAt: 'asc' }],
            where: { isPublished: true },
        });
        return modules.map((m) => ({
            id: m.id,
            title: m.title,
            subtitle: m.subtitle,
            level: m.level,
            colorA: m.colorA || null,
            colorB: m.colorB || null,
            shadowColor: m.shadowColor || null,
            lessons: (m.lessons || []).map((l) => ({
                id: l.id,
                title: l.title,
                label: l.title,
                slug: l.slug || null,
                subtitle: l.subtitle,
                order: l.order,
                moduleId: m.id,
            })),
        }));
    }
    // Return lessons grouped by module or simple modules list
    async findLessonsByModule(moduleId) {
        const module = await this.prisma.module.findUnique({ where: { id: moduleId } });
        if (!module)
            return null;
        return this.prisma.lesson.findMany({
            where: { moduleId, isPublished: true },
            orderBy: { order: 'asc' },
            include: { _count: { select: { exercises: true } } },
        });
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoursesService);
