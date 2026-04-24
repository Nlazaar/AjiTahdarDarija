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
exports.LessonsController = void 0;
const common_1 = require("@nestjs/common");
const lessons_service_1 = require("./lessons.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const admin_guard_1 = require("../../common/guards/admin.guard");
let LessonsController = class LessonsController {
    constructor(lessonsService) {
        this.lessonsService = lessonsService;
    }
    findAll() {
        return this.lessonsService.findAll();
    }
    listLanguages() {
        return this.lessonsService.listLanguages();
    }
    listModulesForAdmin() {
        return this.lessonsService.listModulesForAdmin();
    }
    findBySlug(slug) {
        return this.lessonsService.findBySlug(slug);
    }
    findOne(id) {
        return this.lessonsService.findOne(id);
    }
    getExercises(id) {
        return this.lessonsService.getExercises(id);
    }
    getVocabulary(id) {
        return this.lessonsService.getVocabulary(id);
    }
    submit(id, req, body) {
        return this.lessonsService.submit(id, req.user.id, body.answers ?? []);
    }
    // ── Admin CRUD (header X-Admin-Token requis) ─────────────────────────────
    create(body) {
        return this.lessonsService.create(body);
    }
    update(id, body) {
        return this.lessonsService.update(id, body);
    }
    updateSequence(id, body) {
        return this.lessonsService.updateSequence(id, body ?? {});
    }
    reorderVocabulary(id, body) {
        return this.lessonsService.reorderVocabulary(id, body?.orderedIds ?? []);
    }
    remove(id, hard) {
        return hard === 'true'
            ? this.lessonsService.hardDelete(id)
            : this.lessonsService.softDelete(id);
    }
    // ── Authored exercises (LessonExercise) ──────────────────────────────────
    /** Lecture publique : utilisée par le runtime LessonClient (exos publiés uniquement). */
    listAuthoredExercises(id) {
        return this.lessonsService.listAuthoredExercises(id);
    }
    /** Lecture admin : tous les exos (publiés + brouillons). */
    listAuthoredExercisesAdmin(id) {
        return this.lessonsService.listAuthoredExercisesAdmin(id);
    }
    createAuthoredExercise(id, body) {
        return this.lessonsService.createAuthoredExercise(id, body ?? {});
    }
    reorderAuthoredExercises(id, body) {
        return this.lessonsService.reorderAuthoredExercises(id, body?.orderedIds ?? []);
    }
    updateAuthoredExercise(id, exId, body) {
        return this.lessonsService.updateAuthoredExercise(id, exId, body ?? {});
    }
    deleteAuthoredExercise(id, exId) {
        return this.lessonsService.deleteAuthoredExercise(id, exId);
    }
};
exports.LessonsController = LessonsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('meta/languages'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "listLanguages", null);
__decorate([
    (0, common_1.Get)('meta/modules'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "listModulesForAdmin", null);
__decorate([
    (0, common_1.Get)('slug/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/exercises'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "getExercises", null);
__decorate([
    (0, common_1.Get)(':id/vocabulary'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "getVocabulary", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Post)(':id/submit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "submit", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Patch)(':id/sequence'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "updateSequence", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Patch)(':id/vocab-order'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "reorderVocabulary", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('hard')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/authored-exercises'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "listAuthoredExercises", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Get)(':id/authored-exercises-admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "listAuthoredExercisesAdmin", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Post)(':id/authored-exercises'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "createAuthoredExercise", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Patch)(':id/authored-exercises/reorder'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "reorderAuthoredExercises", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Patch)(':id/authored-exercises/:exId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('exId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "updateAuthoredExercise", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Delete)(':id/authored-exercises/:exId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('exId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "deleteAuthoredExercise", null);
exports.LessonsController = LessonsController = __decorate([
    (0, common_1.Controller)('lessons'),
    __metadata("design:paramtypes", [lessons_service_1.LessonsService])
], LessonsController);
