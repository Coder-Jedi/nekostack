import { Env } from '../types';
export declare class KVClient {
    private kv;
    constructor(kv: any);
    get<T = any>(key: string, parseJson?: boolean): Promise<T | null>;
    set(key: string, value: any, options?: any): Promise<void>;
    delete(key: string): Promise<void>;
    list(prefix?: string, limit?: number): Promise<{
        keys: string[];
    }>;
    getMany<T = any>(keys: string[], parseJson?: boolean): Promise<(T | null)[]>;
    setMany(entries: Array<{
        key: string;
        value: any;
        options?: any;
    }>): Promise<void>;
    cache<T = any>(key: string, value: T, ttlSeconds: number): Promise<void>;
    getOrCompute<T = any>(key: string, computeFn: () => Promise<T>, ttlSeconds?: number): Promise<T>;
    increment(key: string, amount?: number): Promise<number>;
    decrement(key: string, amount?: number): Promise<number>;
    setWithExpiration(key: string, value: any, expirationTtl: number): Promise<void>;
    setWithAbsoluteExpiration(key: string, value: any, expiration: Date): Promise<void>;
    healthCheck(): Promise<boolean>;
}
export declare function createKVClient(env: Env): KVClient;
//# sourceMappingURL=kv-client.d.ts.map