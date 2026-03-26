"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv = require("dotenv");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    dotenv.config();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Global validation pipe
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    // CORS — autoriser le frontend Next.js
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    // Global exception filter
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    // app.use(compression()) — missing dependency in demo
    // app.use(helmet()) — missing dependency in demo
    // app.use(auditLogger)
    // app.use(perfMiddleware(300))
    // Rate limiter for auth endpoints (protect sensitive routes)
    /*
    const limiter = createRateLimiter({ windowMs: 60 * 1000, max: 30 })
    app.use('/auth', limiter)
    app.post('/auth/login', bruteforceGuard)
    */
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
