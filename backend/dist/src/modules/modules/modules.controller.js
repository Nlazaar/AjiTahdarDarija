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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModulesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const crypto_1 = require("crypto");
const sharp = require("sharp");
const courses_service_1 = require("../courses/courses.service");
const admin_guard_1 = require("../../common/guards/admin.guard");
const prisma_service_1 = require("../../prisma/prisma.service");
const storage_service_1 = require("../../storage/storage.service");
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_MIME = /^image\/(jpe?g|png|webp|avif)$/i;
let ModulesController = class ModulesController {
    constructor(coursesService, prisma, storage) {
        this.coursesService = coursesService;
        this.prisma = prisma;
        this.storage = storage;
    }
    /** GET /modules?track=DARIJA|MSA|RELIGION (publique — uniquement publiés) */
    async findAll(track) {
        return this.coursesService.findAll(track?.toUpperCase());
    }
    async lessons(id) {
        const lessons = await this.coursesService.findLessonsByModule(id);
        if (!lessons)
            throw new common_1.NotFoundException('Module not found');
        return lessons;
    }
    // ── Admin CRUD (header X-Admin-Token requis) ─────────────────────────────
    listAllForAdmin() {
        return this.coursesService.listAllForAdmin();
    }
    create(body) {
        return this.coursesService.createModule(body);
    }
    update(id, body) {
        return this.coursesService.updateModule(id, body);
    }
    remove(id, hard) {
        return this.coursesService.deleteModule(id, hard === 'true');
    }
    /**
     * Upload photo ville : multipart/form-data, champ "file".
     * Pipeline : multer(memory) → sharp (resize 1200px + WebP q80) → StorageService.
     * Nommage : `cities/{slug}-{uuid}.webp` (slug pour debug, uuid pour éviter
     * les collisions en cas de rename de ville).
     */
    async uploadPhoto(id, file) {
        if (!file)
            throw new common_1.BadRequestException('file is required');
        if (!ACCEPTED_MIME.test(file.mimetype)) {
            throw new common_1.BadRequestException('Format non supporté (jpg/png/webp/avif)');
        }
        const mod = await this.prisma.module.findUnique({ where: { id } });
        if (!mod)
            throw new common_1.NotFoundException('Module not found');
        const webp = await sharp(file.buffer)
            .rotate()
            .resize({ width: 1200, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();
        const slugSafe = (mod.slug || 'module').toLowerCase().replace(/[^a-z0-9-]/g, '-');
        const key = `cities/${slugSafe}-${(0, crypto_1.randomUUID)()}.webp`;
        const saved = await this.storage.save(webp, key, 'image/webp');
        // Supprime l'ancienne photo si elle pointait vers notre storage
        const previous = mod.cityInfo?.photoUrl;
        if (typeof previous === 'string' && previous.startsWith('/uploads/')) {
            const prevKey = previous.replace(/^\/uploads\//, '');
            if (prevKey && prevKey !== key) {
                await this.storage.delete(prevKey).catch(() => undefined);
            }
        }
        const nextCityInfo = { ...(mod.cityInfo ?? {}), photoUrl: saved.url };
        await this.prisma.module.update({
            where: { id },
            data: { cityInfo: nextCityInfo },
        });
        return { url: saved.url, key: saved.key };
    }
};
exports.ModulesController = ModulesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('track')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/lessons'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "lessons", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Get)('admin/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ModulesController.prototype, "listAllForAdmin", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ModulesController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ModulesController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('hard')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ModulesController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Post)(':id/photo'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: { fileSize: MAX_UPLOAD_BYTES },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "uploadPhoto", null);
exports.ModulesController = ModulesController = __decorate([
    (0, common_1.Controller)('modules'),
    __param(2, (0, common_1.Inject)(storage_service_1.STORAGE)),
    __metadata("design:paramtypes", [courses_service_1.CoursesService,
        prisma_service_1.PrismaService, Object])
], ModulesController);
