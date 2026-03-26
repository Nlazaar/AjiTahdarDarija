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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async register(dto) {
        try {
            const existing = await this.prisma.user.findUnique({
                where: { email: dto.email.toLowerCase() },
            });
            if (existing)
                throw new common_1.ConflictException('Cet email est déjà utilisé');
            const passwordHash = await bcrypt.hash(dto.password, 10);
            const user = await this.prisma.user.create({
                data: { email: dto.email.toLowerCase(), name: dto.name ?? null, passwordHash },
            });
            return this.buildResponse(user);
        }
        catch (e) {
            console.error('[REGISTER ERROR]', e?.message ?? e);
            throw e;
        }
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (!user || !user.passwordHash) {
            throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
        }
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid) {
            throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
        }
        return this.buildResponse(user);
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                xp: true,
                level: true,
                streak: true,
                hearts: true,
                createdAt: true,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('Utilisateur introuvable');
        return user;
    }
    buildResponse(user) {
        const payload = { sub: user.id, email: user.email, name: user.name };
        const token = this.jwt.sign(payload);
        return {
            token,
            user: { id: user.id, email: user.email, name: user.name },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
