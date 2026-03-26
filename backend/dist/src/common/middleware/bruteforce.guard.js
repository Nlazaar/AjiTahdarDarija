"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bruteforceGuard = bruteforceGuard;
const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;
function bruteforceGuard(req, res, next) {
    try {
        const ip = req.ip || req.connection.remoteAddress || 'unknown';
        const key = `bf:${ip}`;
        const now = Date.now();
        const entry = attempts.get(key);
        if (entry && entry.exp > now && entry.count >= MAX_ATTEMPTS) {
            res.status(429).json({ message: 'Too many login attempts, try again later' });
            return;
        }
        // attach a helper to increment on failed login
        ;
        req.__bf_incr = () => {
            const cur = attempts.get(key);
            if (!cur || cur.exp <= Date.now()) {
                attempts.set(key, { count: 1, exp: Date.now() + WINDOW_MS });
            }
            else {
                cur.count += 1;
                attempts.set(key, cur);
            }
        };
        next();
    }
    catch (e) {
        next();
    }
}
