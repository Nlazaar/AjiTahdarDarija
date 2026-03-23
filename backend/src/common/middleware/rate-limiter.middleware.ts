import rateLimit from 'express-rate-limit'
import { RequestHandler } from 'express'

// simple rate limiter middleware factory
export const createRateLimiter = (opts?: { windowMs?: number; max?: number }): RequestHandler => {
  return rateLimit({
    windowMs: opts?.windowMs ?? 60 * 1000, // 1 minute
    max: opts?.max ?? 60, // limit each IP to 60 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  })
}
