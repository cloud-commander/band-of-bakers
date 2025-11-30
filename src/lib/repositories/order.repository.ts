import { BaseRepository } from "./base.repository";
import { orders, orderItems, products, type InsertOrder, type InsertOrderItem } from "@/db/schema";
import { eq, desc, sql, and, gte, lte } from "drizzle-orm";

export class OrderRepository extends BaseRepository<typeof orders> {
  constructor() {
    super(orders);
  }

  /**
   * Create order with items
   */
  async createWithItems(order: InsertOrder, items: InsertOrderItem[]) {
    const db = await this.getDatabase();

    try {
      // Create order
      const [newOrder] = await db.insert(orders).values(order).returning();

      // Create items
      if (items.length > 0) {
        const itemsWithOrderId = items.map((item) => ({
          ...item,
          order_id: newOrder.id,
        }));
        await db.insert(orderItems).values(itemsWithOrderId);
      }

      return newOrder;
    } catch (error) {
      console.error("Error creating order with items:", error);
      throw error;
    }
  }

  /**
   * Find orders by user ID
   */
  async findByUserId(userId: string) {
    const db = await this.getDatabase();
    return await db.query.orders.findMany({
      where: eq(orders.user_id, userId),
      with: {
        items: {
          with: {
            product: true,
            variant: true,
          },
        },
        bakeSale: {
          with: {
            location: true,
          },
        },
      },
      orderBy: desc(orders.created_at),
    });
  }

  /**
   * Find all orders with relations
   */
  async findAll() {
    const db = await this.getDatabase();
    return await db.query.orders.findMany({
      with: {
        user: true,
        items: {
          with: {
            product: true,
            variant: true,
          },
        },
        bakeSale: {
          with: {
            location: true,
          },
        },
      },
      orderBy: desc(orders.created_at),
    });
  }

  /**
   * Find orders with pagination (offset/limit) and relations.
   */
  async findPaginated(limit: number, offset: number) {
    const db = await this.getDatabase();
    const data = await db.query.orders.findMany({
      limit,
      offset,
      with: {
        user: true,
        items: {
          with: {
            product: true,
            variant: true,
          },
        },
        bakeSale: {
          with: {
            location: true,
          },
        },
      },
      orderBy: desc(orders.created_at),
    });
    const totalResult = await db.select({ count: sql<number>`count(*)` }).from(orders);
    return { data, total: Number(totalResult[0]?.count || 0) };
  }

  /**
   * Find order by ID with relations
   */
  async findByIdWithRelations(id: string) {
    const db = await this.getDatabase();
    return await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        user: true,
        items: {
          with: {
            product: true,
            variant: true,
          },
        },
        bakeSale: {
          with: {
            location: true,
          },
        },
      },
    });
  }

  /**
   * Count total orders
   */
  async count() {
    const db = await this.getDatabase();
    const result = await db.select({ count: sql<number>`count(*)` }).from(orders);
    return Number(result[0]?.count || 0);
  }

  /**
   * Sum total revenue
   */
  async sumTotal() {
    const db = await this.getDatabase();
    const result = await db.select({ total: sql<number>`sum(${orders.total})` }).from(orders);
    return Number(result[0]?.total || 0);
  }

  /**
   * Count how many times a user has used a voucher.
   */
  async countVoucherUses(userId: string, voucherId: string) {
    const db = await this.getDatabase();
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(and(eq(orders.user_id, userId), eq(orders.voucher_id, voucherId)));
    return Number(result[0]?.count || 0);
  }

  /**
   * Find recent orders with user
   */
  async findRecent(limit: number) {
    const db = await this.getDatabase();
    return await db.query.orders.findMany({
      limit,
      orderBy: desc(orders.created_at),
      with: {
        user: true,
      },
    });
  }

  /**
   * Revenue grouped by day for the last N days (ISO date strings, ascending).
   */
  async revenueLastNDays(days: number) {
    const db = await this.getDatabase();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffIso = cutoff.toISOString();
    const day = sql<string>`substr(${orders.created_at}, 1, 10)`.as("day");
    const revenue = sql<number>`sum(${orders.total})`.as("revenue");

    const rows = await db
      .select({ day, revenue })
      .from(orders)
      .where(gte(orders.created_at, cutoffIso))
      .groupBy(day)
      .orderBy(day);

    return rows.map((row) => ({
      day: row.day,
      revenue: Number(row.revenue ?? 0),
    }));
  }

  /**
   * Order counts per status.
   */
  async statusCounts() {
    const db = await this.getDatabase();
    const counts = await db
      .select({
        status: orders.status,
        count: sql<number>`count(*)`.as("count"),
      })
      .from(orders)
      .groupBy(orders.status);

    return counts.map((row) => ({
      status: row.status,
      count: Number(row.count ?? 0),
    }));
  }

  /**
   * Top products by units sold.
   */
  async topProducts(limit = 5) {
    const db = await this.getDatabase();
    const units = sql<number>`sum(${orderItems.quantity})`.as("units");
    const revenue = sql<number>`sum(${orderItems.total_price})`.as("revenue");

    const rows = await db
      .select({
        product_id: products.id,
        name: products.name,
        units,
        revenue,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.product_id, products.id))
      .groupBy(products.id, products.name)
      .orderBy(desc(units))
      .limit(limit);

    return rows.map((row) => ({
      product_id: row.product_id,
      name: row.name,
      units: Number(row.units ?? 0),
      revenue: Number(row.revenue ?? 0),
    }));
  }

  async countSince(dateISO: string) {
    const db = await this.getDatabase();
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(gte(orders.created_at, dateISO));
    return Number(result[0]?.count || 0);
  }

  async countBetween(startISO: string, endISO: string) {
    const db = await this.getDatabase();
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(and(gte(orders.created_at, startISO), lte(orders.created_at, endISO)));
    return Number(result[0]?.count || 0);
  }

  async sumTotalSince(dateISO: string) {
    const db = await this.getDatabase();
    const result = await db
      .select({ total: sql<number>`sum(${orders.total})` })
      .from(orders)
      .where(gte(orders.created_at, dateISO));
    return Number(result[0]?.total || 0);
  }

  async sumTotalBetween(startISO: string, endISO: string) {
    const db = await this.getDatabase();
    const result = await db
      .select({ total: sql<number>`sum(${orders.total})` })
      .from(orders)
      .where(and(gte(orders.created_at, startISO), lte(orders.created_at, endISO)));
    return Number(result[0]?.total || 0);
  }
}

export const orderRepository = new OrderRepository();
