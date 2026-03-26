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
exports.GamificationController = void 0;
const common_1 = require("@nestjs/common");
const gamification_service_1 = require("./gamification.service");
let GamificationController = class GamificationController {
    constructor(gamificationService) {
        this.gamificationService = gamificationService;
    }
    async addXp(body) {
        const { userId, amount } = body;
        const res = await this.gamificationService.addXp(userId, amount);
        return res;
    }
    async streak(body) {
        const { userId, date } = body;
        const today = date ? new Date(date) : new Date();
        return this.gamificationService.updateStreak(userId, today);
    }
    async hearts(body) {
        const { userId, delta } = body;
        return this.gamificationService.adjustHearts(userId, delta);
    }
    async badges(userId) {
        return this.gamificationService.listBadges(userId);
    }
};
exports.GamificationController = GamificationController;
__decorate([
    (0, common_1.Post)('xp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "addXp", null);
__decorate([
    (0, common_1.Post)('streak'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "streak", null);
__decorate([
    (0, common_1.Post)('hearts'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "hearts", null);
__decorate([
    (0, common_1.Get)('badges'),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "badges", null);
exports.GamificationController = GamificationController = __decorate([
    (0, common_1.Controller)('gamification'),
    __metadata("design:paramtypes", [gamification_service_1.GamificationService])
], GamificationController);
