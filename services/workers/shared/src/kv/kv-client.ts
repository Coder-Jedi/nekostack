// KV Storage client wrapper with common operations

import { Env } from '../types';

export class KVClient {
  private kv: any; // KVNamespace

  constructor(kv: any) {
    this.kv = kv;
  }

  // Get value with optional JSON parsing
  async get<T = any>(key: string, parseJson = true): Promise<T | null> {
    try {
      const value = await this.kv.get(key);
      if (!value) return null;
      
      if (parseJson) {
        return JSON.parse(value) as T;
      }
      return value as T;
    } catch (error: any) {
      console.error('KV get error:', error);
      return null;
    }
  }

  // Set value with optional JSON stringification
  async set(key: string, value: any, options?: any): Promise<void> {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await this.kv.put(key, stringValue, options);
    } catch (error: any) {
      console.error('KV set error:', error);
      throw new Error(`KV set failed: ${error.message}`);
    }
  }

  // Delete value
  async delete(key: string): Promise<void> {
    try {
      await this.kv.delete(key);
    } catch (error: any) {
      console.error('KV delete error:', error);
      throw new Error(`KV delete failed: ${error.message}`);
    }
  }

  // List keys with optional prefix
  async list(prefix?: string, limit?: number): Promise<{ keys: string[] }> {
    try {
      const options: any = {};
      if (prefix) options.prefix = prefix;
      if (limit) options.limit = limit;
      
      const result = await this.kv.list(options);
      return { keys: result.keys.map((k: any) => k.name) };
    } catch (error: any) {
      console.error('KV list error:', error);
      throw new Error(`KV list failed: ${error.message}`);
    }
  }

  // Get multiple values
  async getMany<T = any>(keys: string[], parseJson = true): Promise<(T | null)[]> {
    try {
      const promises = keys.map(key => this.get<T>(key, parseJson));
      return await Promise.all(promises);
    } catch (error: any) {
      console.error('KV getMany error:', error);
      throw new Error(`KV getMany failed: ${error.message}`);
    }
  }

  // Set multiple values
  async setMany(entries: Array<{ key: string; value: any; options?: any }>): Promise<void> {
    try {
      const promises = entries.map(({ key, value, options }) => 
        this.set(key, value, options)
      );
      await Promise.all(promises);
    } catch (error: any) {
      console.error('KV setMany error:', error);
      throw new Error(`KV setMany failed: ${error.message}`);
    }
  }

  // Cache with TTL
  async cache<T = any>(
    key: string, 
    value: T, 
    ttlSeconds: number
  ): Promise<void> {
    await this.set(key, value, { expirationTtl: ttlSeconds });
  }

  // Get from cache or compute
  async getOrCompute<T = any>(
    key: string,
    computeFn: () => Promise<T>,
    ttlSeconds: number = 3600
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const computed = await computeFn();
    await this.cache(key, computed, ttlSeconds);
    return computed;
  }

  // Atomic increment
  async increment(key: string, amount = 1): Promise<number> {
    try {
      const current = await this.get<number>(key, false);
      const newValue = (current || 0) + amount;
      await this.set(key, newValue.toString(), { expirationTtl: 3600 });
      return newValue;
    } catch (error: any) {
      console.error('KV increment error:', error);
      throw new Error(`KV increment failed: ${error.message}`);
    }
  }

  // Atomic decrement
  async decrement(key: string, amount = 1): Promise<number> {
    return this.increment(key, -amount);
  }

  // Set with expiration
  async setWithExpiration(
    key: string, 
    value: any, 
    expirationTtl: number
  ): Promise<void> {
    await this.set(key, value, { expirationTtl });
  }

  // Set with absolute expiration
  async setWithAbsoluteExpiration(
    key: string, 
    value: any, 
    expiration: Date
  ): Promise<void> {
    await this.set(key, value, { expiration });
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const testKey = 'health-check';
      await this.set(testKey, 'ok', { expirationTtl: 60 });
      const result = await this.get(testKey);
      await this.delete(testKey);
      return result === 'ok';
    } catch (error: any) {
      console.error('KV health check failed:', error);
      return false;
    }
  }
}

// Helper function to create KVClient instance
export function createKVClient(env: Env): KVClient {
  return new KVClient(env.CACHE);
}
