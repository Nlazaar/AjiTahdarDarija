import { Injectable } from '@nestjs/common'

type Entry = { value: any; exp: number }

@Injectable()
export class TTLCacheService {
  private store = new Map<string, Entry>()

  get<T = any>(key: string): T | null {
    const e = this.store.get(key)
    if (!e) return null
    if (Date.now() > e.exp) {
      this.store.delete(key)
      return null
    }
    return e.value as T
  }

  set(key: string, value: any, ttlSeconds = 60) {
    this.store.set(key, { value, exp: Date.now() + ttlSeconds * 1000 })
  }

  del(key: string) {
    this.store.delete(key)
  }
}
