"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacksModule = void 0;
const common_1 = require("@nestjs/common");
const packs_service_1 = require("./packs.service");
const packs_controller_1 = require("./packs.controller");
const prisma_module_1 = require("../../prisma/prisma.module");
let PacksModule = class PacksModule {
};
exports.PacksModule = PacksModule;
exports.PacksModule = PacksModule = __decorate([
    (0, common_1.Module)({ imports: [prisma_module_1.PrismaModule], providers: [packs_service_1.PacksService], controllers: [packs_controller_1.PacksController], exports: [packs_service_1.PacksService] })
], PacksModule);
