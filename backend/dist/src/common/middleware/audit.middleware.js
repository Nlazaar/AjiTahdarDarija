"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogger = auditLogger;
const fs = require("fs");
const path = require("path");
const LOG_PATH = process.env.AUDIT_LOG_PATH || path.join(process.cwd(), 'logs', 'audit.log');
try {
    fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
}
catch { }
function auditLogger(req, res, next) {
    const start = Date.now();
    res.on('finish', () => {
        try {
            const ms = Date.now() - start;
            const entry = {
                time: new Date().toISOString(),
                method: req.method,
                path: req.originalUrl,
                status: res.statusCode,
                durationMs: ms,
                user: req.user?.id ?? null,
            };
            // only log important events
            if (/auth\/(login|register)|progress|lessons\/submit|review\/submit/i.test(req.originalUrl)) {
                fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + '\n');
            }
        }
        catch (e) {
            // ignore logging errors
        }
    });
    next();
}
