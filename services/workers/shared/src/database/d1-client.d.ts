import { Env } from '../types';
export declare class D1Client {
    private db;
    constructor(db: any);
    query<T = any>(sql: string, params?: any[]): Promise<any>;
    execute(sql: string, params?: any[]): Promise<any>;
    get<T = any>(sql: string, params?: any[]): Promise<T | null>;
    getAll<T = any>(sql: string, params?: any[]): Promise<T[]>;
    insert(table: string, data: Record<string, any>): Promise<string>;
    update(table: string, data: Record<string, any>, where: Record<string, any>): Promise<number>;
    delete(table: string, where: Record<string, any>): Promise<number>;
    transaction<T>(operations: (db: D1Client) => Promise<T>): Promise<T>;
    healthCheck(): Promise<boolean>;
}
export declare function createD1Client(env: Env): D1Client;
//# sourceMappingURL=d1-client.d.ts.map