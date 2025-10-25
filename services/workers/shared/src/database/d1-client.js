// D1 Database client wrapper with common operations
export class D1Client {
    db; // D1Database
    constructor(db) {
        this.db = db;
    }
    // Generic query method
    async query(sql, params = []) {
        try {
            return await this.db.prepare(sql).bind(...params).all();
        }
        catch (error) {
            console.error('D1 query error:', error);
            throw new Error(`Database query failed: ${error.message}`);
        }
    }
    // Generic execute method for mutations
    async execute(sql, params = []) {
        try {
            return await this.db.prepare(sql).bind(...params).run();
        }
        catch (error) {
            console.error('D1 execute error:', error);
            throw new Error(`Database execute failed: ${error.message}`);
        }
    }
    // Get single record
    async get(sql, params = []) {
        try {
            const result = await this.db.prepare(sql).bind(...params).first();
            return result;
        }
        catch (error) {
            console.error('D1 get error:', error);
            throw new Error(`Database get failed: ${error.message}`);
        }
    }
    // Get all records
    async getAll(sql, params = []) {
        try {
            const result = await this.db.prepare(sql).bind(...params).all();
            return result.results;
        }
        catch (error) {
            console.error('D1 getAll error:', error);
            throw new Error(`Database getAll failed: ${error.message}`);
        }
    }
    // Insert record and return ID
    async insert(table, data) {
        const columns = Object.keys(data);
        const placeholders = columns.map(() => '?').join(', ');
        const values = Object.values(data);
        const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
        try {
            const result = await this.db.prepare(sql).bind(...values).run();
            return result.meta.last_row_id?.toString() || '';
        }
        catch (error) {
            console.error('D1 insert error:', error);
            throw new Error(`Database insert failed: ${error.message}`);
        }
    }
    // Update record
    async update(table, data, where) {
        const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
        const values = [...Object.values(data), ...Object.values(where)];
        const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
        try {
            const result = await this.db.prepare(sql).bind(...values).run();
            return result.meta.changes || 0;
        }
        catch (error) {
            console.error('D1 update error:', error);
            throw new Error(`Database update failed: ${error.message}`);
        }
    }
    // Delete record
    async delete(table, where) {
        const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
        const values = Object.values(where);
        const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
        try {
            const result = await this.db.prepare(sql).bind(...values).run();
            return result.meta.changes || 0;
        }
        catch (error) {
            console.error('D1 delete error:', error);
            throw new Error(`Database delete failed: ${error.message}`);
        }
    }
    // Transaction support
    async transaction(operations) {
        // Note: D1 doesn't support explicit transactions, but we can batch operations
        return operations(this);
    }
    // Health check
    async healthCheck() {
        try {
            await this.db.prepare('SELECT 1').first();
            return true;
        }
        catch (error) {
            console.error('D1 health check failed:', error);
            return false;
        }
    }
}
// Helper function to create D1Client instance
export function createD1Client(env) {
    return new D1Client(env.DB);
}
//# sourceMappingURL=d1-client.js.map