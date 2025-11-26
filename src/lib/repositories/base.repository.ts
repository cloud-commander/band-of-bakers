import { getDb } from '@/lib/db';
import type { SQLiteTableWithColumns } from 'drizzle-orm/sqlite-core';
import { eq } from 'drizzle-orm';

/**
 * Base Repository Pattern
 * Provides common CRUD operations for all entities
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class BaseRepository<T extends SQLiteTableWithColumns<any>> {
  constructor(protected table: T) {}

  /**
   * Get database instance
   */
  protected async getDatabase() {
    return await getDb();
  }

  /**
   * Find record by ID
   */
  async findById(id: string) {
    const db = await this.getDatabase();
    const results = await db.select().from(this.table).where(eq(this.table.id, id)).limit(1);
    return results[0] || null;
  }

  /**
   * Find all records
   */
  async findAll() {
    const db = await this.getDatabase();
    return await db.select().from(this.table);
  }

  /**
   * Create a new record
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(data: any) {
    const db = await this.getDatabase();
    const results = await db.insert(this.table).values(data).returning();
    return results[0];
  }

  /**
   * Update a record by ID
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async update(id: string, data: any) {
    const db = await this.getDatabase();
    const results = await db
      .update(this.table)
      .set({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .where(eq(this.table.id, id))
      .returning();
    return results[0] || null;
  }

  /**
   * Delete a record by ID
   */
  async delete(id: string) {
    const db = await this.getDatabase();
    await db.delete(this.table).where(eq(this.table.id, id));
    return true;
  }

  /**
   * Count all records
   */
  async count(): Promise<number> {
    const db = await this.getDatabase();
    const results = await db.select().from(this.table);
    return results.length;
  }
}
