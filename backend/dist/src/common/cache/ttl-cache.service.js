"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TTLCacheService = void 0;
const common_1 = require("@nestjs/common");
let TTLCacheService = class TTLCacheService {
    constructor() {
        this.store = new Map();
    }
    get(key) {
        const e = this.store.get(key);
        if (!e)
            return null;
        if (Date.now() > e.exp) {
            this.store.delete(key);
            return null;
        }
        return e.value;
    }
    set(key, value, ttlSeconds = 60) {
        this.store.set(key, { value, exp: Date.now() + ttlSeconds * 1000 });
    }
    del(key) {
        this.store.delete(key);
    }
};
exports.TTLCacheService = TTLCacheService;
exports.TTLCacheService = TTLCacheService = __decorate([
    (0, common_1.Injectable)()
], TTLCacheService);
