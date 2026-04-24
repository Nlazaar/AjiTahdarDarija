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
exports.VocabularyController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const vocabulary_service_1 = require("./vocabulary.service");
const admin_guard_1 = require("../../common/guards/admin.guard");
let VocabularyController = class VocabularyController {
    constructor(vocabularyService) {
        this.vocabularyService = vocabularyService;
    }
    // ── Lecture publique ───────────────────────────────────────────────────────
    list(languageId, lessonId, q, includeDrafts) {
        return this.vocabularyService.list({
            languageId,
            lessonId,
            q,
            includeDrafts: includeDrafts === 'true' || includeDrafts === '1',
        });
    }
    /** Item du jour (déterministe par date, choisi parmi les items publiés) */
    daily(languageId) {
        return this.vocabularyService.daily({ languageId });
    }
    findOne(id) {
        return this.vocabularyService.findOne(id);
    }
    // ── Admin CRUD (header X-Admin-Token) ──────────────────────────────────────
    create(body) {
        return this.vocabularyService.create(body);
    }
    update(id, body) {
        return this.vocabularyService.update(id, body);
    }
    remove(id) {
        return this.vocabularyService.remove(id);
    }
    /** Upload audio (multipart/form-data champ "file", mp3/wav, max 5MB) */
    uploadAudio(id, file) {
        if (!file)
            throw new common_1.BadRequestException('file is required (multipart field "file")');
        return this.vocabularyService.saveAudio(id, file);
    }
    attach(id, lessonId) {
        return this.vocabularyService.attachToLesson(id, lessonId);
    }
    detach(id, lessonId) {
        return this.vocabularyService.detachFromLesson(id, lessonId);
    }
};
exports.VocabularyController = VocabularyController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('languageId')),
    __param(1, (0, common_1.Query)('lessonId')),
    __param(2, (0, common_1.Query)('q')),
    __param(3, (0, common_1.Query)('includeDrafts')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], VocabularyController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('daily'),
    __param(0, (0, common_1.Query)('languageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VocabularyController.prototype, "daily", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VocabularyController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VocabularyController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VocabularyController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VocabularyController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Post)(':id/audio'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 5 * 1024 * 1024 } })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VocabularyController.prototype, "uploadAudio", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Post)(':id/attach/:lessonId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], VocabularyController.prototype, "attach", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Delete)(':id/attach/:lessonId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], VocabularyController.prototype, "detach", null);
exports.VocabularyController = VocabularyController = __decorate([
    (0, common_1.Controller)('vocabulary'),
    __metadata("design:paramtypes", [vocabulary_service_1.VocabularyService])
], VocabularyController);
