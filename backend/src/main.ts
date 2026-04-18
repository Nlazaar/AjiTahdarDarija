import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as dotenv from 'dotenv'
import { ValidationPipe, Logger } from '@nestjs/common'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { createRateLimiter } from './common/middleware/rate-limiter.middleware'
import helmet from 'helmet'
import { bruteforceGuard } from './common/middleware/bruteforce.guard'
import { auditLogger } from './common/middleware/audit.middleware'
import * as compression from 'compression'

const logger = new Logger('Bootstrap')

async function bootstrap() {
  dotenv.config()

  // Vérifier les variables d'env critiques au démarrage
  const required = ['JWT_SECRET', 'DATABASE_URL']
  for (const key of required) {
    if (!process.env[key]) {
      logger.error(`[STARTUP] Missing required env variable: ${key}`)
      process.exit(1)
    }
  }

  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] })

  // ── Compression HTTP (réduction ~70% taille réponses JSON)
  app.use(compression())

  // ── Sécurité HTTP headers (X-Frame-Options, CSP, HSTS, etc.)
  app.use(
    helmet({
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
    }),
  )

  // ── Audit logging (auth, progress, soumissions)
  app.use(auditLogger)

  // ── CORS — origines lues depuis l'env pour éviter localhost en prod
  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean)

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })

  // ── Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))

  // ── Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter())

  // ── Rate limiting global (1000 req/min par IP — élevé car /modules + /modules/:id/lessons
  //    déclenchent 30+ requêtes par chargement de la page cours)
  const globalLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 1000 })
  app.use(globalLimiter)

  // ── Rate limiting strict sur /auth (10 req/min par IP)
  const authLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 10 })
  app.use('/auth/login', authLimiter)
  app.use('/auth/register', authLimiter)

  // ── Bruteforce guard sur le login
  app.use('/auth/login', bruteforceGuard)

  const port = process.env.PORT || 3000
  await app.listen(port)
  logger.log(`Server running on http://localhost:${port}`)
}

bootstrap()
