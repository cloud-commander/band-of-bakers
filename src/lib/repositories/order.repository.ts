import { BaseRepository } from "./base.repository";
import {
  orders,
  orderItems,
  products,
  bakeSales,
  locations,
  type InsertOrder,
  type InsertOrderItem,
} from "@/db/schema";
import { eq, desc, sql, and, gte, lte, lt, inArray } from "drizzle-orm";

export class OrderRepository extends BaseRepository<typeof orders> {
  constructor() {
    super(orders);
  }

  async nextOrderNumber() {
    const db = await this.getDatabase();
    const result = await db
      .select({ max: sql<number>`coalesce(max(${orders.order_number}), 0)` })
      .from(orders);
    const currentMax = Number(result[0]?.max ?? 0);
    return currentMax + 1;
  }

  /**
   * Create order with items inside a transaction, assigning an atomic order_number.
   */
  async createWithItems(order: Omit<InsertOrder, "order_number">, items: InsertOrderItem[]) {
    const db = await this.getDatabase();

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await db.transaction(async (tx: any) => {
        // Assign next order number atomically within this transaction
        const next = await tx
          .select({ max: sql<number>`coalesce(max(${orders.order_number}), 0)` })
          .from(orders);
        const orderNumber = Number(next[0]?.max ?? 0) + 1;

        const [newOrder] = await tx
          .insert(orders)
          .values({
            ...order,
            order_number: orderNumber,
          })
          .returning();

        if (items.length > 0) {
          const itemsWithOrderId = items.map((item) => ({
            ...item,
            order_id: newOrder.id,
          }));
          await tx.insert(orderItems).values(itemsWithOrderId);
        }

        return newOrder;
      });

      return result;
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

    // Get the order IDs first with pagination
    const orderIds = await db
      .select({ id: orders.id })
      .from(orders)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(orders.created_at));

    if (orderIds.length === 0) {
      const totalResult = await db.select({ count: sql<number>`count(*)` }).from(orders);
      return { data: [], total: Number(totalResult[0]?.count || 0) };
    }

    // Get full order data with relations
    const data = await db.query.orders.findMany({
      where: inArray(
        orders.id,
        orderIds.map((o: { id: string }) => o.id)
      ),
      with: {
        user: {
          columns: {
            name: true,
            email: true,
          },
        },
        bakeSale: {
          columns: {
            date: true,
          },
          with: {
            location: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
      extras: {
        item_count:
          sql<number>`(SELECT count(*) FROM ${orderItems} oi WHERE oi.order_id = ${orders.id})`.as(
            "item_count"
          ),
      },
      orderBy: desc(orders.created_at),
    });

    const totalResult = await db.select({ count: sql<number>`count(*)` }).from(orders);
    return { data, total: Number(totalResult[0]?.count || 0) };
  }

  async findPaginatedByUser(
    userId: string,
    limit: number,
    offset: number,
    sort: "newest" | "oldest" = "newest"
  ) {
    const db = await this.getDatabase();
    const orderBy = sort === "newest" ? desc(orders.created_at) : orders.created_at;
    const data = await db
      .select({
        id: orders.id,
        order_number: orders.order_number,
        created_at: orders.created_at,
        total: orders.total,
        status: orders.status,
        fulfillment_method: orders.fulfillment_method,
        bake_sale_id: orders.bake_sale_id,
        bakeSaleDate: bakeSales.date,
        bakeSaleLocation: locations.name,
        item_count:
          sql<number>`(SELECT count(*) FROM ${orderItems} oi WHERE oi.order_id = ${orders.id})`.as(
            "item_count"
          ),
      })
      .from(orders)
      .leftJoin(bakeSales, eq(bakeSales.id, orders.bake_sale_id))
      .leftJoin(locations, eq(locations.id, bakeSales.location_id))
      .where(eq(orders.user_id, userId))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.user_id, userId));
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows.map((row: any) => ({
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return counts.map((row: any) => ({
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows.map((row: any) => ({
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

  async overdueCountsByStatus(targetStatuses: Array<string>, todayIsoDate: string) {
    const db = await this.getDatabase();
    const rows = await db
      .select({
        status: orders.status,
        count: sql<number>`count(*)`.as("count"),
      })
      .from(orders)
      .leftJoin(bakeSales, eq(bakeSales.id, orders.bake_sale_id))
      .where(and(inArray(orders.status, targetStatuses), lt(bakeSales.date, todayIsoDate)))
      .groupBy(orders.status);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows.map((row: any) => ({
      status: row.status,
      count: Number(row.count ?? 0),
    }));
  }
}

export const orderRepository = new OrderRepository();
