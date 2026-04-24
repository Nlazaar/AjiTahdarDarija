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
        this.logger = new common_1.Logger('Redis');
    }
    onModuleInit() {
        const url = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
        try {
            this.client = new ioredis_1.default(url, {
                maxRetriesPerRequest: 1,
                retryStrategy: (times) => {
                    if (times > 2) {
                        this.logger.warn('Redis indisponible — cache désactivé');
                        return null; // stop retrying
                    }
                    return 500;
                },
                lazyConnect: true,
            });
            this.client.on('error', () => { }); // silence errors after warning
            this.client.connect().catch(() => {
                this.logger.warn('Redis non connecté — fallback mémoire');
                this.client = null;
            });
        }
        catch {
            this.client = null;
        }
    }
    async onModuleDestroy() {
        await this.client?.quit();
        this.client = null;
    }
    async get(key) {
        if (!this.client)
            return null;
        try {
            const v = await this.client.get(key);
            if (!v)
                return null;
            return JSON.parse(v);
        }
        catch {
            return null;
        }
    }
    async set(key, value, ttlSeconds) {
        if (!this.client)
            return;
        try {
            const v = typeof value === 'string' ? value : JSON.stringify(value);
            if (ttlSeconds)
                await this.client.set(key, v, 'EX', ttlSeconds);
            else
                await this.client.set(key, v);
        }
        catch { }
    }
    async del(key) {
        if (!this.client)
            return;
        try {
            await this.client.del(key);
        }
        catch { }
    }
};
exports.RedisCacheService = RedisCacheService;
exports.RedisCacheService = RedisCacheService = __decorate([
    (0, common_1.Injectable)()
], RedisCacheService);
