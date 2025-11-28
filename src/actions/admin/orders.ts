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

interface UpdatedItem {
  itemId: string;
  newQuantity: number;
}

interface UpdateOrderItemsParams {
  orderId: string;
  updatedItems: UpdatedItem[];
  changeType: "bakery" | "customer";
}

export async function updateOrderItems({
  orderId,
  updatedItems,
  changeType,
}: UpdateOrderItemsParams): Promise<ActionResult<void>> {
  if (!(await checkAdmin())) return { success: false, error: "Unauthorized" };

  try {
    const db = await getDb();

    // Get the full order with items
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        user: true,
        items: {
          with: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!order) return { success: false, error: "Order not found" };

    // Import orderItems schema
    const { orderItems } = await import("@/db/schema");

    // Update each item's quantity
    let newTotal = 0;
    const changesList: string[] = [];

    for (const update of updatedItems) {
      const item = order.items.find((i: { id: string }) => i.id === update.itemId);
      if (!item) continue;

      const oldQuantity = item.quantity;
      const newQuantity = update.newQuantity;

      // Update the item quantity in the database
      if (newQuantity !== oldQuantity) {
        await db
          .update(orderItems)
          .set({ quantity: newQuantity })
          .where(eq(orderItems.id, update.itemId));

        // Build change description
        const productName = item.product?.name || "Unknown Product";
        const variantName = item.variant?.name ? ` - ${item.variant.name}` : "";
        const fullName = `${productName}${variantName}`;

        if (newQuantity === 0) {
          changesList.push(`<li>${fullName}: Removed (was ${oldQuantity})</li>`);
        } else {
          changesList.push(
            `<li>${fullName}: Quantity changed from ${oldQuantity} to ${newQuantity}</li>`
          );
        }
      }

      // Calculate new total
      newTotal += item.unit_price * newQuantity;
    }

    // Update order total
    await db.update(orders).set({ total: newTotal }).where(eq(orders.id, orderId));

    // Send appropriate email based on change type
    const templateName = changeType === "customer" ? "order_update_customer" : "order_update_bakery";
    const changeDetails = changesList.length > 0 ? `<ul>${changesList.join("")}</ul>` : "<p>No changes</p>";

    await sendEmail(order.user.email, templateName, {
      customer_name: order.user.name || "Customer",
      order_id: order.id.slice(0, 8),
      change_details: changeDetails,
      new_total: newTotal.toFixed(2),
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Update order items error:", error);
    return { success: false, error: "Failed to update order items" };
  }
}
