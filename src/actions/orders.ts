"use server";

import { auth } from "@/auth";
import { orderRepository } from "@/lib/repositories/order.repository";
import { userRepository } from "@/lib/repositories/user.repository";
import { productRepository } from "@/lib/repositories/product.repository";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { nanoid } from "nanoid";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

// Input schema matching checkout form
const orderSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  // Address (optional for collection)
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
  payment_method: z.string().default("stripe"),
  fulfillment_method: z.enum(["delivery", "collection"]),
  bake_sale_id: z.string().optional(),
  notes: z.string().optional(),
  // Items
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      quantity: z.number().min(1),
    })
  ),
});

export async function createOrder(
  data: z.infer<typeof orderSchema>
): Promise<ActionResult<{ id: string }>> {
  try {
    const validated = orderSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      address1,
      address2,
      city,
      postcode,
      fulfillment_method,
      items,
    } = validated.data;

    // 1. Find or Create User
    let userId: string;
    const session = await auth();

    if (session?.user?.id) {
      userId = session.user.id;
    } else {
      // Guest checkout - check if user exists by email
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Create guest user
        const newUser = await userRepository.create({
          id: nanoid(),
          email,
          name: `${firstName} ${lastName}`,
          phone,
          role: "customer",
          email_verified: false,
        });
        userId = newUser.id;
      }
    }

    // 2. Calculate Totals & Verify Prices
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await productRepository.findById(item.productId);
      if (!product) {
        return { success: false, error: `Product not found: ${item.productId}` };
      }

      let price = product.base_price;
      let variantId = null;

      if (item.variantId) {
        const variants = await productRepository.getVariants(product.id);
        const variant = variants.find((v) => v.id === item.variantId);
        if (variant) {
          price += variant.price_adjustment;
          variantId = variant.id;
        }
      }

      const totalItemPrice = price * item.quantity;
      subtotal += totalItemPrice;

      orderItemsData.push({
        id: nanoid(),
        order_id: "", // Filled later
        product_id: product.id,
        product_variant_id: variantId,
        quantity: item.quantity,
        unit_price: price,
        total_price: totalItemPrice,
        is_available: true,
      });
    }

    const deliveryFee = fulfillment_method === "delivery" ? 3.99 : 0; // TODO: Use constant
    const total = subtotal + deliveryFee;

    // 3. Create Order
    let bakeSaleId = validated.data.bake_sale_id;

    if (!bakeSaleId) {
      const { bakeSaleRepository } = await import("@/lib/repositories/bake-sale.repository");
      const upcomingSales = await bakeSaleRepository.findUpcoming();
      bakeSaleId = upcomingSales[0]?.id;
    }

    const order = await orderRepository.createWithItems(
      {
        id: nanoid(),
        user_id: userId,
        bake_sale_id: bakeSaleId,
        status: "pending",
        fulfillment_method,
        payment_method: validated.data.payment_method,
        delivery_fee: deliveryFee,
        subtotal,
        total,
        notes: validated.data.notes,
        // Billing
        billing_address_line1: address1 || "Collection",
        billing_address_line2: address2,
        billing_city: city || "Collection",
        billing_postcode: postcode || "Collection",
        // Shipping
        shipping_address_line1: address1,
        shipping_address_line2: address2,
        shipping_city: city,
        shipping_postcode: postcode,
      },
      orderItemsData
    );

    revalidatePath("/admin/orders");

    return { success: true, data: { id: order.id } };
  } catch (error) {
    console.error("Create order error:", error);
    return { success: false, error: "Failed to create order" };
  }
}

export async function getOrders() {
  try {
    const orders = await orderRepository.findAll();
    return orders;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await orderRepository.findByIdWithRelations(id);
    return order;
  } catch (error) {
    console.error(`Failed to fetch order ${id}:`, error);
    return null;
  }
}

export async function getUserOrders() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }
    const orders = await orderRepository.findByUserId(session.user.id);
    return orders;
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    return [];
  }
}
