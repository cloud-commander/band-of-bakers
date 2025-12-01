"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { nanoid } from "nanoid";
import { auth } from "@/auth";
import { SHIPPING_COST } from "@/lib/constants/app";
import { validateVoucher } from "@/lib/utils/voucher";
import { sendEmail } from "@/lib/email/service";
import { verifyTurnstileToken } from "@/lib/actions/verify-turnstile";
import { formatOrderReference } from "@/lib/utils/order";
import { cache } from "react";
import { requireCsrf, CsrfError } from "@/lib/csrf";
import { CACHE_TAGS } from "@/lib/cache";
import { logger } from "@/lib/logger";

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
  payment_method: z.literal("payment_on_collection").default("payment_on_collection"),
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
  voucherCode: z.preprocess((value) => {
    if (typeof value === "string" && value.trim() === "") {
      return undefined;
    }
    return value;
  }, z.string().trim().optional()),
  turnstileToken: z.string().optional(),
});

export async function createOrder(
  data: z.infer<typeof orderSchema>
): Promise<ActionResult<{ id: string; order_number: number }>> {
  // Track stock reservations to allow rollback on failure
  const stockReservations: Array<{ productId: string; quantity: number }> = [];
  let voucherReservation: string | null = null;

  // Dynamic imports
  const { orderRepository } = await import("@/lib/repositories/order.repository");
  const { userRepository } = await import("@/lib/repositories/user.repository");
  const { productRepository } = await import("@/lib/repositories/product.repository");
  const { voucherRepository } = await import("@/lib/repositories/voucher.repository");

  try {
    try {
      await requireCsrf();
    } catch (e) {
      if (e instanceof CsrfError) {
        return { success: false, error: "Request blocked. Please refresh and try again." };
      }
      throw e;
    }

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
      voucherCode,
      turnstileToken,
    } = validated.data;

    // 0. Turnstile verification if enabled
    if (process.env.BANDOFBAKERS_TURNSTILE_SECRET_KEY) {
      if (!turnstileToken) {
        return { success: false, error: "Please complete the verification challenge" };
      }
      const verification = await verifyTurnstileToken(turnstileToken);
      if (!verification.success) {
        return { success: false, error: verification.error || "Verification failed" };
      }
    }

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

    // 2. Calculate Totals & Verify Prices + Stock
    let subtotal = 0;
    const orderItemsData = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productCache = new Map<string, any>();
    const stockRequirements = new Map<string, number>();

    // Prefetch variants for all products to avoid N+1
    const productIds = Array.from(new Set(items.map((item) => item.productId)));
    const variantsByProduct = await productRepository.getActiveVariantsForProducts(productIds);
    const productsById = new Map(
      ((await productRepository.findByIds)
        ? await productRepository.findByIds(productIds)
        : await Promise.all(productIds.map((id) => productRepository.findById(id)))
      )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((p: any) => p !== null)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((p: any) => [p!.id, p!])
    );

    for (const item of items) {
      const cachedProduct = productCache.get(item.productId);
      const product = cachedProduct ?? productsById.get(item.productId);

      if (!product) {
        return { success: false, error: `Product not found: ${item.productId}` };
      }
      if (!product.is_active) {
        return { success: false, error: `Product is unavailable: ${product.name}` };
      }

      productCache.set(product.id, product);

      let price = product.base_price;
      let variantId = null;

      if (item.variantId) {
        const variants = variantsByProduct.get(product.id) || [];
        const variant = variants.find((v) => v.id === item.variantId && v.is_active);
        if (variant) {
          price += variant.price_adjustment;
          variantId = variant.id;
        } else {
          return { success: false, error: `Variant not available for ${product.name}` };
        }
      }

      const isStockTracked = typeof product.stock_quantity === "number";
      if (isStockTracked) {
        const required = (stockRequirements.get(product.id) || 0) + item.quantity;
        if (product.stock_quantity! < required) {
          return {
            success: false,
            error: `Insufficient stock for ${product.name}`,
          };
        }
        stockRequirements.set(product.id, required);
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

    const deliveryFee = fulfillment_method === "delivery" ? SHIPPING_COST : 0;
    const orderTotalBeforeDiscount = subtotal + deliveryFee;

    let voucherDiscount = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let appliedVoucher: any | null | undefined;

    if (voucherCode) {
      const voucher = await voucherRepository.findByCode(voucherCode.toUpperCase());
      const validation = validateVoucher(voucher as never, orderTotalBeforeDiscount);

      if (!validation.valid || !validation.discount) {
        return {
          success: false,
          error: validation.error || "Voucher is not valid",
        };
      }

      if (voucher?.max_uses_per_customer !== null && voucher?.max_uses_per_customer !== undefined) {
        const perCustomerUses = await orderRepository.countVoucherUses(userId, voucher.id);
        if (perCustomerUses >= voucher.max_uses_per_customer) {
          return {
            success: false,
            error: "You have reached the usage limit for this voucher",
          };
        }
      }

      voucherDiscount = validation.discount;
      appliedVoucher = voucher;
    }

    // 2.5 Reserve stock (decrement tracked quantities)
    for (const [productId, quantity] of stockRequirements.entries()) {
      const updated = await productRepository.decrementStock(productId, quantity);
      if (!updated) {
        return { success: false, error: "Unable to reserve stock; please try again" };
      }
      stockReservations.push({ productId, quantity });
    }

    // 2.6 Reserve voucher usage
    if (appliedVoucher) {
      const updated = await voucherRepository.incrementUsage(appliedVoucher.id);
      if (!updated) {
        return { success: false, error: "This voucher is no longer available" };
      }
      voucherReservation = appliedVoucher.id;
    }

    const total = Math.max(0, orderTotalBeforeDiscount - voucherDiscount);

    // 3. Create Order
    let bakeSaleId = validated.data.bake_sale_id;

    if (!bakeSaleId) {
      const { bakeSaleRepository } = await import("@/lib/repositories/bake-sale.repository");
      const upcomingSales = await bakeSaleRepository.findUpcoming();
      bakeSaleId = upcomingSales[0]?.id;
    }

    // 3.5 Fetch bake sale and location data for snapshot
    let bakeSaleDateSnapshot = null;
    let locationNameSnapshot = null;
    let locationAddressSnapshot = null;
    let locationCitySnapshot = null;
    let locationPostcodeSnapshot = null;
    let collectionHoursSnapshot = null;

    if (bakeSaleId) {
      const { bakeSaleRepository } = await import("@/lib/repositories/bake-sale.repository");
      const bakeSale = await bakeSaleRepository.findByIdWithLocation(bakeSaleId);

      if (bakeSale) {
        bakeSaleDateSnapshot = bakeSale.date;

        if (bakeSale.location) {
          locationNameSnapshot = bakeSale.location.name;
          locationAddressSnapshot = bakeSale.location.address_line1;
          locationCitySnapshot = bakeSale.location.city;
          locationPostcodeSnapshot = bakeSale.location.postcode;
          collectionHoursSnapshot = bakeSale.location.collection_hours;
        }
      }
    }

    const order = await orderRepository.createWithItems(
      {
        id: nanoid(),
        user_id: userId,
        bake_sale_id: bakeSaleId,
        // Snapshot fields for historical accuracy
        bake_sale_date_snapshot: bakeSaleDateSnapshot,
        collection_location_name_snapshot: locationNameSnapshot,
        collection_location_address_snapshot: locationAddressSnapshot,
        collection_location_city_snapshot: locationCitySnapshot,
        collection_location_postcode_snapshot: locationPostcodeSnapshot,
        collection_hours_snapshot: collectionHoursSnapshot,
        status: "pending",
        fulfillment_method,
        payment_method: validated.data.payment_method,
        delivery_fee: deliveryFee,
        voucher_discount: voucherDiscount,
        voucher_id: appliedVoucher?.id,
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
    revalidateTag(CACHE_TAGS.orders);
    revalidateTag(CACHE_TAGS.dashboard);

    return { success: true, data: { id: order.id, order_number: order.order_number } };
  } catch (error) {
    // Roll back any stock reservations
    if (stockReservations.length > 0) {
      await Promise.all(
        stockReservations.map((reservation) =>
          productRepository.incrementStock(reservation.productId, reservation.quantity)
        )
      );
    }
    if (voucherReservation) {
      await voucherRepository.decrementUsage(voucherReservation);
    }

    await logger.error("Create order failed", error, {
      action: "createOrder",
      email: data.email,
      itemCount: data.items?.length,
    });
    return { success: false, error: "Failed to create order" };
  }
}

export async function getOrders() {
  try {
    const { orderRepository } = await import("@/lib/repositories/order.repository");
    const orders = await orderRepository.findAll();
    return orders;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
}

export async function getOrderById(id: string) {
  try {
    const { orderRepository } = await import("@/lib/repositories/order.repository");
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
    const { orderRepository } = await import("@/lib/repositories/order.repository");
    const orders = await orderRepository.findByUserId(session.user.id);
    return orders;
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    return [];
  }
}

export async function getPaginatedOrders(page = 1, pageSize = 20) {
  const limit = Math.max(1, Math.min(pageSize, 100));
  const currentPage = Math.max(1, page);
  const offset = (currentPage - 1) * limit;

  const { orderRepository } = await import("@/lib/repositories/order.repository");
  const result = await orderRepository.findPaginated(limit, offset);
  return {
    orders: result.data,
    total: result.total,
    page: currentPage,
    pageSize: limit,
  };
}

export const getPaginatedUserOrders = cache(async function getPaginatedUserOrders(
  page = 1,
  pageSize = 10,
  sort: "newest" | "oldest" = "newest"
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { orders: [], total: 0, page: 1, pageSize };
    }
    const limit = Math.max(1, Math.min(pageSize, 50));
    const currentPage = Math.max(1, page);
    const offset = (currentPage - 1) * limit;

    const { orderRepository } = await import("@/lib/repositories/order.repository");
    const result = await orderRepository.findPaginatedByUser(session.user.id, limit, offset, sort);
    return {
      orders: result.data,
      total: result.total,
      page: currentPage,
      pageSize: limit,
    };
  } catch (error) {
    console.error("Failed to fetch paginated user orders:", error);
    return { orders: [], total: 0, page: 1, pageSize };
  }
});

const ADMIN_ROLES = ["owner", "manager", "staff"] as const;
const VALID_STATUS_TRANSITIONS: Record<
  "ready" | "fulfilled" | "cancelled" | "refunded" | "action_required" | "processing",
  Array<string>
> = {
  ready: ["pending", "processing", "fulfilled"],
  fulfilled: ["ready"],
  cancelled: ["pending", "processing", "ready"],
  refunded: ["fulfilled", "cancelled"],
  action_required: ["pending", "processing"],
  processing: ["ready", "fulfilled"],
};

export async function updateOrderStatus(
  orderId: string,
  nextStatus: "ready" | "fulfilled" | "cancelled" | "refunded" | "action_required" | "processing"
): Promise<ActionResult<{ id: string; status: string }>> {
  try {
    const session = await auth();
    if (
      !session?.user?.role ||
      !ADMIN_ROLES.includes(session.user.role as (typeof ADMIN_ROLES)[number])
    ) {
      return { success: false, error: "Unauthorized" };
    }

    const { orderRepository } = await import("@/lib/repositories/order.repository");
    const order = await orderRepository.findByIdWithRelations(orderId);
    if (!order) {
      return { success: false, error: "Order not found" };
    }

    const allowedFromStatuses = VALID_STATUS_TRANSITIONS[nextStatus];
    if (!allowedFromStatuses.includes(order.status)) {
      return {
        success: false,
        error: `Cannot change status from "${order.status}" to "${nextStatus}"`,
      };
    }

    const updated = await orderRepository.update(orderId, { status: nextStatus });
    if (!updated) {
      return { success: false, error: "Failed to update order status" };
    }

    // Trigger notifications
    if (order.user?.email) {
      if (nextStatus === "ready") {
        // Use snapshot data for historical accuracy, fallback to live data
        const locationName = order.collection_location_name_snapshot || order.bakeSale?.location?.name;
        const locationAddress = order.collection_location_address_snapshot || order.bakeSale?.location?.address_line1;
        const locationPostcode = order.collection_location_postcode_snapshot || order.bakeSale?.location?.postcode;
        const collectionHours = order.collection_hours_snapshot || order.bakeSale?.location?.collection_hours || "10am - 2pm";

        if (locationName && locationAddress && locationPostcode) {
          void sendEmail(order.user.email, "order_ready_for_collection", {
            customer_name: order.user.name || "Customer",
            order_id: formatOrderReference(order.id, order.order_number),
            location_name: locationName,
            location_address: `${locationAddress}, ${locationPostcode}`,
            collection_time: collectionHours,
          });
        }
      } else if (nextStatus === "fulfilled") {
        void sendEmail(order.user.email, "order_completed", {
          customer_name: order.user.name || "Customer",
          order_id: formatOrderReference(order.id, order.order_number),
        });
      } else if (nextStatus === "cancelled") {
        void sendEmail(order.user.email, "order_cancelled", {
          customer_name: order.user.name || "Customer",
          order_id: formatOrderReference(order.id, order.order_number),
        });
      } else if (nextStatus === "refunded") {
        void sendEmail(order.user.email, "order_refunded", {
          customer_name: order.user.name || "Customer",
          order_id: formatOrderReference(order.id, order.order_number),
        });
      } else if (nextStatus === "action_required") {
        void sendEmail(order.user.email, "order_action_required", {
          customer_name: order.user.name || "Customer",
          order_id: formatOrderReference(order.id, order.order_number),
        });
      }
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/orders/${orderId}`);
    revalidateTag(CACHE_TAGS.orders);
    revalidateTag(CACHE_TAGS.dashboard);

    return { success: true, data: { id: updated.id, status: updated.status } };
  } catch (error) {
    await logger.error("Update order status failed", error, {
      action: "updateOrderStatus",
      orderId,
      newStatus: nextStatus,
    });
    return { success: false, error: "Failed to update order status" };
  }
}
