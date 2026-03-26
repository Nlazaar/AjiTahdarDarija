"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard = void 0;
exports.Roles = Roles;
const common_1 = require("@nestjs/common");
function Roles(...roles) {
    return (target, key, descriptor) => {
        Reflect.defineMetadata('roles', roles, descriptor?.value ?? target);
    };
}
let RolesGuard = class RolesGuard {
    canActivate(context) {
        const handler = context.getHandler();
        const required = Reflect.getMetadata('roles', handler) || [];
        if (required.length === 0)
            return true;
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        if (!user)
            return false;
        return required.includes(user.role);
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)()
], RolesGuard);
