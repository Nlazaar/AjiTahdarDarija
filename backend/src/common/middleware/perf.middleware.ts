import { Request, Response, NextFunction } from 'express'

export function perfMiddleware(thresholdMs = 300) {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now()
    res.on('finish', () => {
      const ms = Date.now() - start
      res.setHeader('X-Response-Time', `${ms}ms`)
      if (ms > thresholdMs) {
        // eslint-disable-next-line no-console
        console.warn(`Slow request: ${req.method} ${req.originalUrl} — ${ms}ms`)
      }
    })
    next()
  }
}
