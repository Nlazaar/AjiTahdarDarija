import { RequestHandler } from 'express';
export declare const createRateLimiter: (opts?: {
    windowMs?: number;
    max?: number;
}) => RequestHandler;
