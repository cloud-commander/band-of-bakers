import { BaseRepository } from "./base.repository";
import { orders, orderItems, type InsertOrder, type InsertOrderItem } from "@/db/schema";
import { eq, desc, sql, and } from "drizzle-orm";

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
}

export const orderRepository = new OrderRepository();
