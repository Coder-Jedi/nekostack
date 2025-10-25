// KV Storage client wrapper with common operations
export class KVClient {
    kv; // KVNamespace
    constructor(kv) {
        this.kv = kv;
    }
    // Get value with optional JSON parsing
    async get(key, parseJson = true) {
        try {
            const value = await this.kv.get(key);
            if (!value)
                return null;
            if (parseJson) {
                return JSON.parse(value);
            }
            return value;
        }
        catch (error) {
            console.error('KV get error:', error);
            return null;
        }
    }
    // Set value with optional JSON stringification
    async set(key, value, options) {
        try {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            await this.kv.put(key, stringValue, options);
        }
        catch (error) {
            console.error('KV set error:', error);
            throw new Error(`KV set failed: ${error.message}`);
        }
    }
    // Delete value
    async delete(key) {
        try {
            await this.kv.delete(key);
        }
        catch (error) {
            console.error('KV delete error:', error);
            throw new Error(`KV delete failed: ${error.message}`);
        }
    }
    // List keys with optional prefix
    async list(prefix, limit) {
        try {
            const options = {};
            if (prefix)
                options.prefix = prefix;
            if (limit)
                options.limit = limit;
            const result = await this.kv.list(options);
            return { keys: result.keys.map((k) => k.name) };
        }
        catch (error) {
            console.error('KV list error:', error);
            throw new Error(`KV list failed: ${error.message}`);
        }
    }
    // Get multiple values
    async getMany(keys, parseJson = true) {
        try {
            const promises = keys.map(key => this.get(key, parseJson));
            return await Promise.all(promises);
        }
        catch (error) {
            console.error('KV getMany error:', error);
            throw new Error(`KV getMany failed: ${error.message}`);
        }
    }
    // Set multiple values
    async setMany(entries) {
        try {
            const promises = entries.map(({ key, value, options }) => this.set(key, value, options));
            await Promise.all(promises);
        }
        catch (error) {
            console.error('KV setMany error:', error);
            throw new Error(`KV setMany failed: ${error.message}`);
        }
    }
    // Cache with TTL
    async cache(key, value, ttlSeconds) {
        await this.set(key, value, { expirationTtl: ttlSeconds });
    }
    // Get from cache or compute
    async getOrCompute(key, computeFn, ttlSeconds = 3600) {
        const cached = await this.get(key);
        if (cached !== null) {
            return cached;
        }
        const computed = await computeFn();
        await this.cache(key, computed, ttlSeconds);
        return computed;
    }
    // Atomic increment
    async increment(key, amount = 1) {
        try {
            const current = await this.get(key, false);
            const newValue = (current || 0) + amount;
            await this.set(key, newValue.toString(), { expirationTtl: 3600 });
            return newValue;
        }
        catch (error) {
            console.error('KV increment error:', error);
            throw new Error(`KV increment failed: ${error.message}`);
        }
    }
    // Atomic decrement
    async decrement(key, amount = 1) {
        return this.increment(key, -amount);
    }
    // Set with expiration
    async setWithExpiration(key, value, expirationTtl) {
        await this.set(key, value, { expirationTtl });
    }
    // Set with absolute expiration
    async setWithAbsoluteExpiration(key, value, expiration) {
        await this.set(key, value, { expiration });
    }
    // Health check
    async healthCheck() {
        try {
            const testKey = 'health-check';
            await this.set(testKey, 'ok', { expirationTtl: 60 });
            const result = await this.get(testKey);
            await this.delete(testKey);
            return result === 'ok';
        }
        catch (error) {
            console.error('KV health check failed:', error);
            return false;
        }
    }
}
// Helper function to create KVClient instance
export function createKVClient(env) {
    return new KVClient(env.CACHE);
}
//# sourceMappingURL=kv-client.js.map