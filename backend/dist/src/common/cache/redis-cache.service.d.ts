import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
export declare class RedisCacheService implements OnModuleInit, OnModuleDestroy {
    private client;
    onModuleInit(): void;
    onModuleDestroy(): Promise<void>;
    get<T = any>(key: string): Promise<T | null>;
    set(key: string, value: any, ttlSeconds?: number): Promise<void>;
    del(key: string): Promise<void>;
}
