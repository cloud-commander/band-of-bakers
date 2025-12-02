import { and, eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { productBakeSaleAvailability } from "@/db/schema";

export type ProductBakeSaleAvailabilityRow = typeof productBakeSaleAvailability.$inferSelect;

export class ProductAvailabilityRepository {
  async get(productId: string, bakeSaleId: string): Promise<ProductBakeSaleAvailabilityRow | null> {
    const db = await getDb();
    const [row] = await db
      .select()
      .from(productBakeSaleAvailability)
      .where(
        and(
          eq(productBakeSaleAvailability.product_id, productId),
          eq(productBakeSaleAvailability.bake_sale_id, bakeSaleId)
        )
      )
      .limit(1);

    return row || null;
  }

  async setAvailability(productId: string, bakeSaleId: string, isAvailable: boolean) {
    const db = await getDb();
    const now = new Date().toISOString();

    await db
      .insert(productBakeSaleAvailability)
      .values({
        product_id: productId,
        bake_sale_id: bakeSaleId,
        is_available: isAvailable,
        updated_at: now,
      })
      .onConflictDoUpdate({
        target: [productBakeSaleAvailability.product_id, productBakeSaleAvailability.bake_sale_id],
        set: { is_available: isAvailable, updated_at: now },
      });
  }

  async getAvailabilityForBakeSales(productId: string, bakeSaleIds: string[]) {
    if (bakeSaleIds.length === 0) return new Map<string, boolean>();
    const db = await getDb();
    const rows = await db
      .select()
      .from(productBakeSaleAvailability)
      .where(
        and(
          eq(productBakeSaleAvailability.product_id, productId),
          inArray(productBakeSaleAvailability.bake_sale_id, bakeSaleIds)
        )
      );

    const map = new Map<string, boolean>();
    for (const row of rows) {
      map.set(row.bake_sale_id, row.is_available);
    }
    return map;
  }

  async getAvailabilityForBakeSale(bakeSaleId: string, productIds?: string[]) {
    const db = await getDb();
    let whereClause = eq(productBakeSaleAvailability.bake_sale_id, bakeSaleId);
    if (productIds && productIds.length > 0) {
      whereClause = and(whereClause, inArray(productBakeSaleAvailability.product_id, productIds))!;
    }

    const rows = await db.select().from(productBakeSaleAvailability).where(whereClause);

    const map = new Map<string, boolean>();
    for (const row of rows) {
      map.set(row.product_id, row.is_available);
    }
    return map;
  }

  async getUnavailableProducts(bakeSaleId: string): Promise<string[]> {
    const db = await getDb();
    const rows = await db
      .select({
        product_id: productBakeSaleAvailability.product_id,
      })
      .from(productBakeSaleAvailability)
      .where(
        and(
          eq(productBakeSaleAvailability.bake_sale_id, bakeSaleId),
          eq(productBakeSaleAvailability.is_available, false)
        )
      );

    return rows.map((row: { product_id: string }) => row.product_id);
  }

  async copyUnavailability(fromBakeSaleId: string, toBakeSaleId: string) {
    if (fromBakeSaleId === toBakeSaleId) return;
    const db = await getDb();
    const unavailableProductIds = await this.getUnavailableProducts(fromBakeSaleId);
    if (unavailableProductIds.length === 0) return;

    const now = new Date().toISOString();
    await db
      .insert(productBakeSaleAvailability)
      .values(
        unavailableProductIds.map((productId) => ({
          product_id: productId,
          bake_sale_id: toBakeSaleId,
          is_available: false,
          updated_at: now,
        }))
      )
      .onConflictDoUpdate({
        target: [productBakeSaleAvailability.product_id, productBakeSaleAvailability.bake_sale_id],
        set: { is_available: false, updated_at: now },
      });
  }
}

export const productAvailabilityRepository = new ProductAvailabilityRepository();
