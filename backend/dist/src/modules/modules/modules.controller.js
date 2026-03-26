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
const courses_service_1 = require("../courses/courses.service");
let ModulesController = class ModulesController {
    constructor(coursesService) {
        this.coursesService = coursesService;
    }
    async findAll() {
        // reuse courses service to list modules
        return this.coursesService.findAll();
    }
    async lessons(id) {
        const lessons = await this.coursesService.findLessonsByModule(id);
        if (!lessons)
            throw new common_1.NotFoundException('Module not found');
        return lessons;
    }
};
exports.ModulesController = ModulesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/lessons'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "lessons", null);
exports.ModulesController = ModulesController = __decorate([
    (0, common_1.Controller)('modules'),
    __metadata("design:paramtypes", [courses_service_1.CoursesService])
], ModulesController);
