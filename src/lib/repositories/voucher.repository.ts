import { BaseRepository } from "./base.repository";
import { vouchers } from "@/db/schema";
import { eq, and, gte, lte, lt, isNull, sql, or } from "drizzle-orm";

export class VoucherRepository extends BaseRepository<typeof vouchers> {
  constructor() {
    super(vouchers);
  }

  async findByCode(code: string) {
    const db = await this.getDatabase();
    const result = await db.select().from(vouchers).where(eq(vouchers.code, code)).limit(1);

    return result[0] || null;
  }

  async findActive() {
    const db = await this.getDatabase();
    const now = new Date().toISOString();

    return await db
      .select()
      .from(vouchers)
      .where(
        and(
          eq(vouchers.is_active, true),
          lte(vouchers.valid_from, now),
          gte(vouchers.valid_until, now)
        )
      );
  }

  /**
   * Increment voucher usage if within max_uses (or unlimited).
   */
  async incrementUsage(voucherId: string) {
    const db = await this.getDatabase();
    const [updated] = await db
      .update(vouchers)
      .set({
        current_uses: sql`${vouchers.current_uses} + 1`,
        updated_at: new Date().toISOString(),
      })
      .where(
        and(
          eq(vouchers.id, voucherId),
          or(isNull(vouchers.max_uses), lt(vouchers.current_uses, vouchers.max_uses))
        )
      )
      .returning();

    return updated || null;
  }

  /**
   * Decrement voucher usage (for rollback).
   */
  async decrementUsage(voucherId: string) {
    const db = await this.getDatabase();
    const [updated] = await db
      .update(vouchers)
      .set({
        current_uses: sql`${vouchers.current_uses} - 1`,
        updated_at: new Date().toISOString(),
      })
      .where(eq(vouchers.id, voucherId))
      .returning();

    return updated || null;
  }
}

export const voucherRepository = new VoucherRepository();
