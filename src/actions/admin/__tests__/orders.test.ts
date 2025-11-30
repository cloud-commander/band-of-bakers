import { describe, it, expect, vi, beforeEach } from "vitest";
import { type Session } from "next-auth";
import { updateOrderStatus, markOrderReady, markOrderComplete, updateOrderItems } from "../orders";

// Mocks
const { mockDb } = vi.hoisted(() => {
  return {
    mockDb: {
      query: {
        orders: {
          findFirst: vi.fn(),
        },
      },
      update: vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn().mockResolvedValue(undefined),
        })),
      })),
    },
  };
});

vi.mock("@/lib/db", () => ({
  getDb: vi.fn().mockResolvedValue(mockDb),
}));

vi.mock("@/auth", () => ({
  auth: vi.fn<() => Promise<Session | null>>(),
}));

vi.mock("@/lib/email/service", () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/db/schema", () => ({
  orders: { id: "orders" },
  orderItems: { id: "orderItems" },
}));

import { auth } from "@/auth";
import { sendEmail } from "@/lib/email/service";

describe("updateOrderStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return unauthorized if user is not admin/staff", async () => {
    vi.mocked(auth as () => Promise<Session | null>).mockResolvedValue({
      user: { role: "customer" },
    } as Session);
    const result = await updateOrderStatus("order-1", "ready");
    expect(result).toEqual({ success: false, error: "Unauthorized" });
  });

  it("should return error if order not found", async () => {
    vi.mocked(auth as () => Promise<Session | null>).mockResolvedValue({
      user: { role: "staff" },
    } as Session);
    mockDb.query.orders.findFirst.mockResolvedValue(null);

    const result = await updateOrderStatus("order-1", "ready");
    expect(result).toEqual({ success: false, error: "Order not found" });
  });

  it("should update status to ready and send email", async () => {
    vi.mocked(auth as () => Promise<Session | null>).mockResolvedValue({
      user: { role: "staff" },
    } as Session);

    mockDb.query.orders.findFirst.mockResolvedValue({
      id: "order-1",
      user: { email: "user@test.com", name: "User" },
      bakeSale: {
        location: {
          name: "Test Location",
          address_line1: "123 St",
          postcode: "AB1 2CD",
          collection_hours: "10am - 2pm",
        },
      },
    });

    const result = await markOrderReady("order-1");

    expect(result.success).toBe(true);
    expect(sendEmail).toHaveBeenCalledWith(
      "user@test.com",
      "order_ready_for_collection",
      expect.objectContaining({
        location_name: "Test Location",
        collection_time: "10am - 2pm",
      })
    );
    expect(mockDb.update).toHaveBeenCalled();
  });

  it("should update status to completed and send email", async () => {
    vi.mocked(auth as () => Promise<Session | null>).mockResolvedValue({
      user: { role: "staff" },
    } as Session);

    mockDb.query.orders.findFirst.mockResolvedValue({
      id: "order-1",
      user: { email: "user@test.com", name: "User" },
      bakeSale: { location: { name: "Test Location" } },
    });

    const result = await markOrderComplete("order-1");

    expect(result.success).toBe(true);
    expect(sendEmail).toHaveBeenCalledWith("user@test.com", "order_completed", expect.any(Object));
    expect(mockDb.update).toHaveBeenCalled();
  });
});

describe("updateOrderItems", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update item quantities and recalculate total", async () => {
    vi.mocked(auth as () => Promise<Session | null>).mockResolvedValue({
      user: { role: "staff" },
    } as Session);

    const mockOrder = {
      id: "order-1",
      user: { email: "user@test.com", name: "User" },
      items: [
        {
          id: "item-1",
          quantity: 2,
          unit_price: 10,
          product: { name: "Cookie" },
        },
        {
          id: "item-2",
          quantity: 1,
          unit_price: 5,
          product: { name: "Brownie" },
        },
      ],
    };

    mockDb.query.orders.findFirst.mockResolvedValue(mockOrder);

    const result = await updateOrderItems({
      orderId: "order-1",
      updatedItems: [
        { itemId: "item-1", newQuantity: 3 }, // +10
        { itemId: "item-2", newQuantity: 0 }, // -5
      ],
      changeType: "bakery",
    });

    expect(result.success).toBe(true);

    // Check item updates
    expect(mockDb.update).toHaveBeenCalledTimes(3); // 2 items + 1 order total

    // Check total update (3*10 + 0*5 = 30)
    // The mockDb.update is called multiple times, we'd need to check the specific call for order total
    // But since we mock the chain, it's hard to inspect specific args without more complex mocks.
    // We can at least verify sendEmail was called with expected details.

    expect(sendEmail).toHaveBeenCalledWith(
      "user@test.com",
      "order_update_bakery",
      expect.objectContaining({
        new_total: "30.00",
        change_details: expect.stringContaining("Cookie"),
      })
    );
  });
});
