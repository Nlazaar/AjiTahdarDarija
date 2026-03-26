"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRateLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
// simple rate limiter middleware factory
const createRateLimiter = (opts) => {
    return (0, express_rate_limit_1.default)({
        windowMs: opts?.windowMs ?? 60 * 1000, // 1 minute
        max: opts?.max ?? 60, // limit each IP to 60 requests per windowMs
        standardHeaders: true,
        legacyHeaders: false,
    });
};
exports.createRateLimiter = createRateLimiter;
