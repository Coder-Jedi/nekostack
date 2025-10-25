// D1 Database client wrapper with common operations

import { Env, ApiResponse } from '../types';

export class D1Client {
  private db: any; // D1Database

  constructor(db: any) {
    this.db = db;
  }

  // Generic query method
  async query<T = any>(sql: string, params: any[] = []): Promise<any> {
    try {
      return await this.db.prepare(sql).bind(...params).all();
    } catch (error: any) {
      console.error('D1 query error:', error);
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  // Generic execute method for mutations
  async execute(sql: string, params: any[] = []): Promise<any> {
    try {
      return await this.db.prepare(sql).bind(...params).run();
    } catch (error: any) {
      console.error('D1 execute error:', error);
      throw new Error(`Database execute failed: ${error.message}`);
    }
  }

  // Get single record
  async get<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    try {
      const result = await this.db.prepare(sql).bind(...params).first();
      return result as T | null;
    } catch (error: any) {
      console.error('D1 get error:', error);
      throw new Error(`Database get failed: ${error.message}`);
    }
  }

  // Get all records
  async getAll<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    try {
      const result = await this.db.prepare(sql).bind(...params).all();
      return result.results as T[];
    } catch (error: any) {
      console.error('D1 getAll error:', error);
      throw new Error(`Database getAll failed: ${error.message}`);
    }
  }

  // Insert record and return ID
  async insert(table: string, data: Record<string, any>): Promise<string> {
    const columns = Object.keys(data);
    const placeholders = columns.map(() => '?').join(', ');
    const values = Object.values(data);
    
    const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
    
    try {
      const result = await this.db.prepare(sql).bind(...values).run();
      return result.meta.last_row_id?.toString() || '';
    } catch (error: any) {
      console.error('D1 insert error:', error);
      throw new Error(`Database insert failed: ${error.message}`);
    }
  }

  // Update record
  async update(table: string, data: Record<string, any>, where: Record<string, any>): Promise<number> {
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
    const values = [...Object.values(data), ...Object.values(where)];
    
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    
    try {
      const result = await this.db.prepare(sql).bind(...values).run();
      return result.meta.changes || 0;
    } catch (error: any) {
      console.error('D1 update error:', error);
      throw new Error(`Database update failed: ${error.message}`);
    }
  }

  // Delete record
  async delete(table: string, where: Record<string, any>): Promise<number> {
    const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
    const values = Object.values(where);
    
    const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
    
    try {
      const result = await this.db.prepare(sql).bind(...values).run();
      return result.meta.changes || 0;
    } catch (error: any) {
      console.error('D1 delete error:', error);
      throw new Error(`Database delete failed: ${error.message}`);
    }
  }

  // Transaction support
  async transaction<T>(operations: (db: D1Client) => Promise<T>): Promise<T> {
    // Note: D1 doesn't support explicit transactions, but we can batch operations
    return operations(this);
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.db.prepare('SELECT 1').first();
      return true;
    } catch (error: any) {
      console.error('D1 health check failed:', error);
      return false;
    }
  }
}

// Helper function to create D1Client instance
export function createD1Client(env: Env): D1Client {
  return new D1Client(env.DB);
}
