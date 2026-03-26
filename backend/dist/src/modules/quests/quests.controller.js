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
exports.QuestsController = void 0;
const common_1 = require("@nestjs/common");
const quests_service_1 = require("./quests.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
let QuestsController = class QuestsController {
    constructor(questsService) {
        this.questsService = questsService;
    }
    getState(req) {
        return this.questsService.getQuestState(req.user.id);
    }
    claim(key, req) {
        return this.questsService.claimReward(req.user.id, key);
    }
};
exports.QuestsController = QuestsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QuestsController.prototype, "getState", null);
__decorate([
    (0, common_1.Post)('claim/:key'),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuestsController.prototype, "claim", null);
exports.QuestsController = QuestsController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('quests'),
    __metadata("design:paramtypes", [quests_service_1.QuestsService])
], QuestsController);
