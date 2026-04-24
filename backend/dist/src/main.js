"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv = require("dotenv");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const rate_limiter_middleware_1 = require("./common/middleware/rate-limiter.middleware");
const helmet_1 = require("helmet");
const bruteforce_guard_1 = require("./common/middleware/bruteforce.guard");
const audit_middleware_1 = require("./common/middleware/audit.middleware");
const compression = require("compression");
const logger = new common_1.Logger('Bootstrap');
async function bootstrap() {
    dotenv.config();
    // Vérifier les variables d'env critiques au démarrage
    const required = ['JWT_SECRET', 'DATABASE_URL'];
    for (const key of required) {
        if (!process.env[key]) {
            logger.error(`[STARTUP] Missing required env variable: ${key}`);
            process.exit(1);
        }
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger: ['error', 'warn', 'log'] });
    // ── Compression HTTP (réduction ~70% taille réponses JSON)
    app.use(compression());
    // ── Sécurité HTTP headers (X-Frame-Options, CSP, HSTS, etc.)
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'https:'],
                connectSrc: ["'self'", 'https:'],
            },
        },
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));
    // ── Audit logging (auth, progress, soumissions)
    app.use(audit_middleware_1.auditLogger);
    // ── CORS — origines lues depuis l'env pour éviter localhost en prod
    const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000')
        .split(',')
        .map(o => o.trim())
        .filter(Boolean);
    app.enableCors({
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    // ── Global validation pipe
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    // ── Global exception filter
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    // ── Rate limiting global (1000 req/min par IP — élevé car /modules + /modules/:id/lessons
    //    déclenchent 30+ requêtes par chargement de la page cours)
    const globalLimiter = (0, rate_limiter_middleware_1.createRateLimiter)({ windowMs: 60 * 1000, max: 1000 });
    app.use(globalLimiter);
    // ── Rate limiting strict sur /auth (10 req/min par IP)
    const authLimiter = (0, rate_limiter_middleware_1.createRateLimiter)({ windowMs: 60 * 1000, max: 10 });
    app.use('/auth/login', authLimiter);
    app.use('/auth/register', authLimiter);
    // ── Bruteforce guard sur le login
    app.use('/auth/login', bruteforce_guard_1.bruteforceGuard);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`Server running on http://localhost:${port}`);
}
bootstrap();
