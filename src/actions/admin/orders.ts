"use server";

import { getDb } from "@/lib/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { sendEmail } from "@/lib/email/service";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

async function checkAdmin() {
  const session = await auth();
  return (
    session?.user?.role === "owner" ||
    session?.user?.role === "manager" ||
    session?.user?.role === "staff"
  );
}

export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<ActionResult<void>> {
  if (!(await checkAdmin())) return { success: false, error: "Unauthorized" };

  try {
    const db = await getDb();
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        user: true,
        bakeSale: {
          with: { location: true },
        },
      },
    });

    if (!order) return { success: false, error: "Order not found" };

    await db.update(orders).set({ status }).where(eq(orders.id, orderId));

    // Send emails based on status
    if (status === "ready") {
      await sendEmail(order.user.email, "order_ready_for_collection", {
        customer_name: order.user.name,
        order_id: order.id.slice(0, 8),
        location_name: order.bakeSale.location.name,
        location_address: `${order.bakeSale.location.address_line1}, ${order.bakeSale.location.postcode}`,
        collection_time: order.bakeSale.location.collection_hours || "10am - 2pm",
      });
    } else if (status === "completed") {
      await sendEmail(order.user.email, "order_completed", {
        customer_name: order.user.name,
        order_id: order.id.slice(0, 8),
      });
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Update status error:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

export async function markOrderReady(orderId: string) {
  return updateOrderStatus(orderId, "ready");
}

export async function markOrderComplete(orderId: string) {
  return updateOrderStatus(orderId, "completed");
}
