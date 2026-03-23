import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RedisCacheService implements OnModuleInit, OnModuleDestroy {
  private client: Redis | null = null

  onModuleInit() {
    const url = process.env.REDIS_URL || 'redis://127.0.0.1:6379'
    this.client = new Redis(url)
  }

  async onModuleDestroy() {
    await this.client?.quit()
    this.client = null
  }

  async get<T = any>(key: string): Promise<T | null> {
    if (!this.client) return null
    const v = await this.client.get(key)
    if (!v) return null
    try { return JSON.parse(v) as T } catch { return null }
  }

  async set(key: string, value: any, ttlSeconds?: number) {
    if (!this.client) return
    const v = typeof value === 'string' ? value : JSON.stringify(value)
    if (ttlSeconds) await this.client.set(key, v, 'EX', ttlSeconds)
    else await this.client.set(key, v)
  }

  async del(key: string) {
    if (!this.client) return
    await this.client.del(key)
  }
}
