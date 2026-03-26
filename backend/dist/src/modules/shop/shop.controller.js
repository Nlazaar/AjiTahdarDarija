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
exports.ShopController = void 0;
const common_1 = require("@nestjs/common");
const shop_service_1 = require("./shop.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
let ShopController = class ShopController {
    constructor(shopService) {
        this.shopService = shopService;
    }
    listItems() {
        return this.shopService.listItems();
    }
    getInventory(req) {
        return this.shopService.getUserInventory(req.user.id);
    }
    buy(key, req) {
        return this.shopService.buyItem(req.user.id, key);
    }
};
exports.ShopController = ShopController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShopController.prototype, "listItems", null);
__decorate([
    (0, common_1.Get)('inventory'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ShopController.prototype, "getInventory", null);
__decorate([
    (0, common_1.Post)('buy/:key'),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ShopController.prototype, "buy", null);
exports.ShopController = ShopController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('shop'),
    __metadata("design:paramtypes", [shop_service_1.ShopService])
], ShopController);
