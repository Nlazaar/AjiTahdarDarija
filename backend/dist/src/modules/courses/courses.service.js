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
    // ── Admin CRUD ─────────────────────────────────────────────────────────────
    async listAllForAdmin() {
        return this.prisma.module.findMany({
            orderBy: [{ track: 'asc' }, { canonicalOrder: 'asc' }, { level: 'asc' }],
            include: { _count: { select: { lessons: true } } },
        });
    }
    async createModule(data) {
        if (!data.title?.trim())
            throw new common_1.BadRequestException('title is required');
        if (!data.slug?.trim())
            throw new common_1.BadRequestException('slug is required');
        return this.prisma.module.create({ data });
    }
    async updateModule(id, data) {
        const existing = await this.prisma.module.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Module not found');
        return this.prisma.module.update({ where: { id }, data });
    }
    async deleteModule(id, hard = false) {
        const existing = await this.prisma.module.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Module not found');
        if (hard) {
            // Détacher les leçons (onDelete:SetNull est déjà câblé sur Lesson.moduleId)
            return this.prisma.module.delete({ where: { id } });
        }
        return this.prisma.module.update({ where: { id }, data: { isPublished: false } });
    }
    // ── Lecture publique ───────────────────────────────────────────────────────
    async findAll(track) {
        const modules = await this.prisma.module.findMany({
            include: { lessons: { where: { isDeleted: false }, orderBy: { order: 'asc' } } },
            // Tri par track puis par canonicalOrder = ordre pédagogique aligné Darija/MSA
            orderBy: [{ canonicalOrder: 'asc' }, { level: 'asc' }, { createdAt: 'asc' }],
            where: {
                isPublished: true,
                ...(track ? { track } : {}),
            },
        });
        return modules.map((m) => ({
            id: m.id,
            slug: m.slug,
            title: m.title,
            titleAr: m.titleAr ?? null,
            subtitle: m.subtitle,
            level: m.level,
            track: m.track,
            canonicalOrder: m.canonicalOrder,
            colorA: m.colorA || null,
            colorB: m.colorB || null,
            shadowColor: m.shadowColor || null,
            cityName: m.cityName ?? null,
            cityNameAr: m.cityNameAr ?? null,
            emoji: m.emoji ?? null,
            photoCaption: m.photoCaption ?? null,
            cityInfo: m.cityInfo ?? null,
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
    async findLessonsByModule(moduleId) {
        const module = await this.prisma.module.findUnique({ where: { id: moduleId } });
        if (!module)
            return null;
        return this.prisma.lesson.findMany({
            where: { moduleId, isPublished: true, isDeleted: false },
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
