import { describe, it, expect, vi, beforeEach } from "vitest";
import { cancelBakeSale } from "../bake-sale-management";

// Mocks
const { mockDb } = vi.hoisted(() => {
  return {
    mockDb: {
      query: {
        bakeSales: {
          findFirst: vi.fn(),
          findMany: vi.fn(),
        },
        orders: {
          findMany: vi.fn(),
        },
        vouchers: {
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
  auth: vi.fn(),
}));

vi.mock("@/lib/email/service", () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { auth } from "@/auth";
import { sendEmail } from "@/lib/email/service";

describe("cancelBakeSale", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return unauthorized if user is not admin", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (vi.mocked(auth) as any).mockResolvedValue({ user: { role: "customer" } });
    const result = await cancelBakeSale("sale-1", "Reason");
    expect(result).toEqual({ success: false, error: "Unauthorized" });
  });

  it("should cancel bake sale and refund orders if no alternatives exist", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (auth as any).mockResolvedValue({ user: { role: "owner" } });

    // Mock Bake Sale
    mockDb.query.bakeSales.findFirst.mockResolvedValue({
      id: "sale-1",
      date: "2025-01-01",
      location: { name: "Test Location" },
    });

    // Mock Affected Orders
    mockDb.query.orders.findMany.mockResolvedValue([
      {
        id: "order-1",
        payment_status: "completed",
        user: { email: "user@test.com", name: "User" },
        voucher_id: null,
      },
    ]);

    // Mock No Alternatives
    mockDb.query.bakeSales.findMany.mockResolvedValue([]);

    const result = await cancelBakeSale("sale-1", "Rain");

    expect(result.success).toBe(true);
    // Verify email sent
    expect(sendEmail).toHaveBeenCalledWith(
      "user@test.com",
      "bake_sale_cancelled",
      expect.objectContaining({ reason: "Rain" })
    );
    // Verify DB updates (simplified check)
    expect(mockDb.update).toHaveBeenCalled();
  });

  it("should mark orders as action_required if alternatives exist", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (auth as any).mockResolvedValue({ user: { role: "owner" } });

    // Mock Bake Sale
    mockDb.query.bakeSales.findFirst.mockResolvedValue({
      id: "sale-1",
      date: "2025-01-01",
      location: { name: "Test Location" },
    });

    // Mock Affected Orders
    mockDb.query.orders.findMany.mockResolvedValue([
      {
        id: "order-1",
        payment_status: "completed",
        user: { email: "user@test.com", name: "User" },
      },
    ]);

    // Mock Alternatives Exist
    mockDb.query.bakeSales.findMany.mockResolvedValue([{ id: "sale-2", date: "2025-01-08" }]);

    const result = await cancelBakeSale("sale-1", "Rain");

    expect(result.success).toBe(true);
    // Verify different email sent
    expect(sendEmail).toHaveBeenCalledWith("user@test.com", "action_required", expect.any(Object));
  });

  it("should send admin warning email if no future bake sales remain", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (auth as any).mockResolvedValue({
      user: { role: "owner", email: "admin@test.com", name: "Admin" },
    });

    // Mock Bake Sale
    mockDb.query.bakeSales.findFirst.mockResolvedValue({
      id: "sale-1",
      date: "2025-01-01",
      location: { name: "Test Location" },
    });

    // Mock Affected Orders (none for simplicity)
    mockDb.query.orders.findMany.mockResolvedValue([]);

    // Mock Alternatives (none)
    mockDb.query.bakeSales.findMany.mockResolvedValue([]);

    const result = await cancelBakeSale("sale-1", "Rain");

    expect(result.success).toBe(true);
    // Verify admin warning email
    expect(sendEmail).toHaveBeenCalledWith(
      "admin@test.com",
      "admin_warning_no_bake_sales",
      expect.objectContaining({ admin_name: "Admin" })
    );
  });
});
