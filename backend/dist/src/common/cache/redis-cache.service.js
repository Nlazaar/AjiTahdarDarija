"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCacheService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
let RedisCacheService = class RedisCacheService {
    constructor() {
        this.client = null;
    }
    onModuleInit() {
        const url = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
        this.client = new ioredis_1.default(url);
    }
    async onModuleDestroy() {
        await this.client?.quit();
        this.client = null;
    }
    async get(key) {
        if (!this.client)
            return null;
        const v = await this.client.get(key);
        if (!v)
            return null;
        try {
            return JSON.parse(v);
        }
        catch {
            return null;
        }
    }
    async set(key, value, ttlSeconds) {
        if (!this.client)
            return;
        const v = typeof value === 'string' ? value : JSON.stringify(value);
        if (ttlSeconds)
            await this.client.set(key, v, 'EX', ttlSeconds);
        else
            await this.client.set(key, v);
    }
    async del(key) {
        if (!this.client)
            return;
        await this.client.del(key);
    }
};
exports.RedisCacheService = RedisCacheService;
exports.RedisCacheService = RedisCacheService = __decorate([
    (0, common_1.Injectable)()
], RedisCacheService);
