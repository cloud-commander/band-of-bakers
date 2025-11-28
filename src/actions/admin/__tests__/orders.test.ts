import { describe, it, expect, vi, beforeEach } from "vitest";
import { type Session } from "next-auth";
import { updateOrderStatus, markOrderReady, markOrderComplete } from "../orders";

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
