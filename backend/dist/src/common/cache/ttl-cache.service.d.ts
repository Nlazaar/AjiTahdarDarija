export declare class TTLCacheService {
    private store;
    get<T = any>(key: string): T | null;
    set(key: string, value: any, ttlSeconds?: number): void;
    del(key: string): void;
}
