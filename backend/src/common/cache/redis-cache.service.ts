import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RedisCacheService implements OnModuleInit, OnModuleDestroy {
  private client: Redis | null = null
  private readonly logger = new Logger('Redis')

  onModuleInit() {
    const url = process.env.REDIS_URL || 'redis://127.0.0.1:6379'
    try {
      this.client = new Redis(url, {
        maxRetriesPerRequest: 1,
        retryStrategy: (times) => {
          if (times > 2) {
            this.logger.warn('Redis indisponible — cache désactivé')
            return null // stop retrying
          }
          return 500
        },
        lazyConnect: true,
      })
      this.client.on('error', () => {}) // silence errors after warning
      this.client.connect().catch(() => {
        this.logger.warn('Redis non connecté — fallback mémoire')
        this.client = null
      })
    } catch {
      this.client = null
    }
  }

  async onModuleDestroy() {
    await this.client?.quit()
    this.client = null
  }

  async get<T = any>(key: string): Promise<T | null> {
    if (!this.client) return null
    try {
      const v = await this.client.get(key)
      if (!v) return null
      return JSON.parse(v) as T
    } catch { return null }
  }

  async set(key: string, value: any, ttlSeconds?: number) {
    if (!this.client) return
    try {
      const v = typeof value === 'string' ? value : JSON.stringify(value)
      if (ttlSeconds) await this.client.set(key, v, 'EX', ttlSeconds)
      else await this.client.set(key, v)
    } catch {}
  }

  async del(key: string) {
    if (!this.client) return
    try { await this.client.del(key) } catch {}
  }
}
