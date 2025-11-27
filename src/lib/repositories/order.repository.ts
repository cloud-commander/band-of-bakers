import { BaseRepository } from "./base.repository";
import { orders, orderItems, type InsertOrder, type InsertOrderItem } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export class OrderRepository extends BaseRepository<typeof orders> {
  constructor() {
    super(orders);
  }

  /**
   * Create order with items
   */
  async createWithItems(order: InsertOrder, items: InsertOrderItem[]) {
    const db = await this.getDatabase();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await db.transaction(async (tx: any) => {
      // Create order
      const [newOrder] = await tx.insert(orders).values(order).returning();

      // Create items
      if (items.length > 0) {
        const itemsWithOrderId = items.map((item) => ({
          ...item,
          order_id: newOrder.id,
        }));
        await tx.insert(orderItems).values(itemsWithOrderId);
      }

      return newOrder;
    });
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
}

export const orderRepository = new OrderRepository();
