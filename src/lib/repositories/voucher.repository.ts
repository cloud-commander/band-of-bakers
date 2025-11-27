import { BaseRepository } from "./base.repository";
import { vouchers } from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";

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
}

export const voucherRepository = new VoucherRepository();
