import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as dotenv from 'dotenv'
import { ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { createRateLimiter } from './common/middleware/rate-limiter.middleware'
import helmet from 'helmet'
import cors from 'cors'
import { bruteforceGuard } from './common/middleware/bruteforce.guard'
import { auditLogger } from './common/middleware/audit.middleware'
import compression from 'compression'
import { perfMiddleware } from './common/middleware/perf.middleware'

async function bootstrap() {
  dotenv.config()
  const app = await NestFactory.create(AppModule)

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  // CORS — autoriser le frontend Next.js
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter())
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



  const port = process.env.PORT || 3000
  await app.listen(port)
  console.log(`Server running on http://localhost:${port}`)
}

bootstrap()
