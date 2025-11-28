"use server";

import { getDb } from "@/lib/db";
import { bakeSales, orders, vouchers } from "@/db/schema";
import { eq, and, gt, ne } from "drizzle-orm";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { sendEmail } from "@/lib/email/service";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

async function checkAdmin() {
  const session = await auth();
  return session?.user?.role === "owner" || session?.user?.role === "manager";
}

export async function cancelBakeSale(
  id: string,
  reason: string
): Promise<ActionResult<{ affectedOrders: number }>> {
  if (!(await checkAdmin())) return { success: false, error: "Unauthorized" };

  try {
    const db = await getDb();
    // 1. Get bake sale details
    const bakeSale = await db.query.bakeSales.findFirst({
      where: eq(bakeSales.id, id),
      with: {
        location: true,
      },
    });

    if (!bakeSale) return { success: false, error: "Bake sale not found" };

    // 2. Find affected orders (pending or processing)
    const affectedOrders = await db.query.orders.findMany({
      where: and(
        eq(orders.bake_sale_id, id),
        ne(orders.status, "cancelled"),
        ne(orders.status, "refunded"),
        ne(orders.status, "fulfilled")
      ),
      with: {
        user: true,
      },
    });

    // 3. Check for alternative bake sales
    const upcomingSales = await db.query.bakeSales.findMany({
      where: and(
        gt(bakeSales.date, new Date().toISOString().split("T")[0]),
        ne(bakeSales.id, id),
        eq(bakeSales.is_active, true)
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      orderBy: (sales: any, { asc }: { asc: (column: unknown) => unknown }) => [asc(sales.date)],
      limit: 1,
    });

    const hasAlternatives = upcomingSales.length > 0;

    // 4. Process orders
    for (const order of affectedOrders) {
      if (hasAlternatives) {
        // Mark as action required
        await db.update(orders).set({ status: "action_required" }).where(eq(orders.id, order.id));

        // Send "Action Required" email
        await sendEmail(order.user.email, "action_required", {
          customer_name: order.user.name,
          date: new Date(bakeSale.date).toLocaleDateString("en-GB"),
          resolution_link: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}/resolution`,
        });
      } else {
        // Auto-cancel/refund
        const newStatus = order.payment_status === "completed" ? "refunded" : "cancelled";
        await db.update(orders).set({ status: newStatus }).where(eq(orders.id, order.id));

        // Restore voucher if used
        if (order.voucher_id) {
          const voucher = await db.query.vouchers.findFirst({
            where: eq(vouchers.id, order.voucher_id),
          });
          if (voucher) {
            await db
              .update(vouchers)
              .set({ current_uses: voucher.current_uses - 1 })
              .where(eq(vouchers.id, order.voucher_id));
          }
        }

        // Send "Cancelled" email
        await sendEmail(order.user.email, "bake_sale_cancelled", {
          customer_name: order.user.name,
          date: new Date(bakeSale.date).toLocaleDateString("en-GB"),
          location_name: bakeSale.location.name,
          reason: reason,
          order_id: order.id.slice(0, 8),
        });
      }
    }

    // 5. Deactivate bake sale
    await db.update(bakeSales).set({ is_active: false }).where(eq(bakeSales.id, id));

    revalidatePath("/admin/bake-sales");
    return { success: true, data: { affectedOrders: affectedOrders.length } };
  } catch (error) {
    console.error("Cancel bake sale error:", error);
    return { success: false, error: "Failed to cancel bake sale" };
  }
}

export async function rescheduleBakeSale(
  id: string,
  newDate: string,
  reason: string
): Promise<ActionResult<{ affectedOrders: number }>> {
  if (!(await checkAdmin())) return { success: false, error: "Unauthorized" };

  try {
    const db = await getDb();
    const bakeSale = await db.query.bakeSales.findFirst({
      where: eq(bakeSales.id, id),
    });

    if (!bakeSale) return { success: false, error: "Bake sale not found" };
    const oldDate = bakeSale.date;

    // Update date
    // Also update cutoff (noon day before)
    const newDateObj = new Date(newDate);
    const cutoffDate = new Date(newDateObj);
    cutoffDate.setDate(newDateObj.getDate() - 1);
    cutoffDate.setHours(12, 0, 0, 0);

    await db
      .update(bakeSales)
      .set({
        date: newDate,
        cutoff_datetime: cutoffDate.toISOString(),
      })
      .where(eq(bakeSales.id, id));

    // Find affected orders
    const affectedOrders = await db.query.orders.findMany({
      where: and(
        eq(orders.bake_sale_id, id),
        ne(orders.status, "cancelled"),
        ne(orders.status, "refunded"),
        ne(orders.status, "fulfilled")
      ),
      with: {
        user: true,
      },
    });

    // Notify customers
    for (const order of affectedOrders) {
      await sendEmail(order.user.email, "bake_sale_rescheduled", {
        customer_name: order.user.name,
        old_date: new Date(oldDate).toLocaleDateString("en-GB"),
        new_date: new Date(newDate).toLocaleDateString("en-GB"),
        reason: reason,
        order_id: order.id.slice(0, 8),
      });
    }

    revalidatePath("/admin/bake-sales");
    return { success: true, data: { affectedOrders: affectedOrders.length } };
  } catch (error) {
    console.error("Reschedule error:", error);
    return { success: false, error: "Failed to reschedule bake sale" };
  }
}

export async function resolveOrderIssue(
  orderId: string,
  resolution: "cancel" | "transfer",
  newBakeSaleId?: string
): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    const db = await getDb();
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: { user: true },
    });

    if (!order) return { success: false, error: "Order not found" };
    if (order.user_id !== session.user.id) return { success: false, error: "Unauthorized" };

    if (resolution === "cancel") {
      const newStatus = order.payment_status === "completed" ? "refunded" : "cancelled";
      await db.update(orders).set({ status: newStatus }).where(eq(orders.id, orderId));

      // Restore voucher
      if (order.voucher_id) {
        const voucher = await db.query.vouchers.findFirst({
          where: eq(vouchers.id, order.voucher_id),
        });
        if (voucher) {
          await db
            .update(vouchers)
            .set({ current_uses: voucher.current_uses - 1 })
            .where(eq(vouchers.id, order.voucher_id));
        }
      }
    } else if (resolution === "transfer") {
      if (!newBakeSaleId) return { success: false, error: "New bake sale ID required" };

      // TODO: Check stock availability for new bake sale (omitted for MVP as per plan)

      await db
        .update(orders)
        .set({
          bake_sale_id: newBakeSaleId,
          status: "pending", // Reset status
        })
        .where(eq(orders.id, orderId));
    }

    revalidatePath("/orders");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Resolve issue error:", error);
    return { success: false, error: "Failed to resolve order issue" };
  }
}
