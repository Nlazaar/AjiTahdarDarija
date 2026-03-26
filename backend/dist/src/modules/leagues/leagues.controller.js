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
exports.LeaguesController = void 0;
const common_1 = require("@nestjs/common");
const leagues_service_1 = require("./leagues.service");
let LeaguesController = class LeaguesController {
    constructor(svc) {
        this.svc = svc;
    }
    async me(req) { return this.svc.getLeagueFor(req.user?.id); }
    async standings(league) { return this.svc.getLeagueStandings(league); }
    async assign(req, league) { return this.svc.assignLeague(req.user?.id, league); }
};
exports.LeaguesController = LeaguesController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeaguesController.prototype, "me", null);
__decorate([
    (0, common_1.Get)('standings/:league'),
    __param(0, (0, common_1.Param)('league')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeaguesController.prototype, "standings", null);
__decorate([
    (0, common_1.Post)('assign/:league'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('league')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LeaguesController.prototype, "assign", null);
exports.LeaguesController = LeaguesController = __decorate([
    (0, common_1.Controller)('leagues'),
    __metadata("design:paramtypes", [leagues_service_1.LeaguesService])
], LeaguesController);
