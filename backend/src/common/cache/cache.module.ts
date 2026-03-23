import { Module } from '@nestjs/common'
import { RedisCacheService } from './redis-cache.service'
import { TTLCacheService } from './ttl-cache.service'

@Module({
  providers: [RedisCacheService, TTLCacheService],
  exports: [RedisCacheService, TTLCacheService],
})
export class CacheModule {}
