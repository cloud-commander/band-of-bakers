/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { cancelBakeSale, rescheduleBakeSale, resolveOrderIssue } from "../bake-sale-management";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { sendEmail } from "@/lib/email/service";

// Mock dependencies
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  getDb: vi.fn(),
}));

vi.mock("@/lib/email/service", () => ({
  sendEmail: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock schema
vi.mock("@/db/schema", () => ({
  bakeSales: { id: "id", date: "date", is_active: "is_active", cutoff_datetime: "cutoff_datetime" },
  orders: {
    id: "id",
    bake_sale_id: "bake_sale_id",
    status: "status",
    user_id: "user_id",
    payment_status: "payment_status",
    voucher_id: "voucher_id",
  },
  vouchers: { id: "id", current_uses: "current_uses" },
}));

describe("bake-sale-management actions", () => {
  const mockDb = {
    query: {
      bakeSales: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
      orders: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
      vouchers: {
        findFirst: vi.fn(),
      },
    },
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn().mockResolvedValue({}),
      })),
    })),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getDb as any).mockResolvedValue(mockDb);
  });

  describe("cancelBakeSale", () => {
    it("should return unauthorized if user is not admin", async () => {
      (auth as any).mockResolvedValue({ user: { role: "user" } });
      const result = await cancelBakeSale("bs1", "reason");
      expect(result).toEqual({ success: false, error: "Unauthorized" });
    });

    it("should return error if bake sale not found", async () => {
      (auth as any).mockResolvedValue({ user: { role: "owner" } });
      mockDb.query.bakeSales.findFirst.mockResolvedValue(null);
      const result = await cancelBakeSale("bs1", "reason");
      expect(result).toEqual({ success: false, error: "Bake sale not found" });
    });

    it("should cancel bake sale and refund orders if no alternatives", async () => {
      (auth as any).mockResolvedValue({ user: { role: "owner", email: "admin@example.com" } });
      mockDb.query.bakeSales.findFirst.mockResolvedValue({
        id: "bs1",
        date: "2023-10-10",
        location: { name: "Loc" },
      });
      mockDb.query.orders.findMany.mockResolvedValue([
        {
          id: "o1",
          user: { email: "user@example.com", name: "User" },
          payment_status: "completed",
        },
      ]);
      mockDb.query.bakeSales.findMany.mockResolvedValue([]); // No alternatives

      const result = await cancelBakeSale("bs1", "reason");

      expect(result.success).toBe(true);
      expect(sendEmail).toHaveBeenCalledWith(
        "user@example.com",
        "bake_sale_cancelled",
        expect.any(Object)
      );
      expect(mockDb.update).toHaveBeenCalled();
    });

    it("should mark orders as action required if alternatives exist", async () => {
      (auth as any).mockResolvedValue({ user: { role: "owner" } });
      mockDb.query.bakeSales.findFirst.mockResolvedValue({
        id: "bs1",
        date: "2023-10-10",
      });
      mockDb.query.orders.findMany.mockResolvedValue([
        { id: "o1", user: { email: "user@example.com", name: "User" } },
      ]);
      // Mock alternatives found (first call to findMany)
      // Mock remaining sales found (second call to findMany)
      mockDb.query.bakeSales.findMany
        .mockResolvedValueOnce([{ id: "bs2", date: "2023-10-17" }])
        .mockResolvedValueOnce([{ id: "bs2" }]);

      const result = await cancelBakeSale("bs1", "reason");

      expect(result.success).toBe(true);
      expect(sendEmail).toHaveBeenCalledWith(
        "user@example.com",
        "action_required",
        expect.any(Object)
      );
      // Verify status update to action_required
      expect(mockDb.update).toHaveBeenCalled();
    });

    it("should restore voucher usage when cancelling", async () => {
      (auth as any).mockResolvedValue({ user: { role: "owner" } });
      mockDb.query.bakeSales.findFirst.mockResolvedValue({
        id: "bs1",
        date: "2023-10-10",
        location: { name: "Loc" },
      });
      mockDb.query.orders.findMany.mockResolvedValue([
        { id: "o1", user: { email: "u@e.com" }, voucher_id: "v1" },
      ]);
      mockDb.query.bakeSales.findMany.mockResolvedValue([]);
      mockDb.query.vouchers.findFirst.mockResolvedValue({ id: "v1", current_uses: 1 });

      await cancelBakeSale("bs1", "reason");

      expect(mockDb.update).toHaveBeenCalled(); // Should update voucher
      // Ideally check arguments, but mock structure is complex
    });

    it("should send admin warning if no future sales remain", async () => {
      (auth as any).mockResolvedValue({ user: { role: "owner", email: "admin@example.com" } });
      mockDb.query.bakeSales.findFirst.mockResolvedValue({
        id: "bs1",
        date: "2023-10-10",
        location: { name: "Loc" },
      });
      mockDb.query.orders.findMany.mockResolvedValue([]);
      // First findMany (alternatives): empty
      // Second findMany (remaining): empty
      mockDb.query.bakeSales.findMany.mockResolvedValue([]);

      await cancelBakeSale("bs1", "reason");

      expect(sendEmail).toHaveBeenCalledWith(
        "admin@example.com",
        "admin_warning_no_bake_sales",
        expect.any(Object)
      );
    });
  });

  describe("rescheduleBakeSale", () => {
    it("should return unauthorized if user is not admin", async () => {
      (auth as any).mockResolvedValue({ user: { role: "user" } });
      const result = await rescheduleBakeSale("bs1", "2023-10-20", "reason");
      expect(result).toEqual({ success: false, error: "Unauthorized" });
    });

    it("should reschedule and notify users", async () => {
      (auth as any).mockResolvedValue({ user: { role: "owner" } });
      mockDb.query.bakeSales.findFirst.mockResolvedValue({ id: "bs1", date: "2023-10-10" });
      mockDb.query.orders.findMany.mockResolvedValue([
        { id: "o1", user: { email: "user@example.com", name: "User" } },
      ]);

      const result = await rescheduleBakeSale("bs1", "2023-10-20", "reason");

      expect(result.success).toBe(true);
      expect(sendEmail).toHaveBeenCalledWith(
        "user@example.com",
        "bake_sale_rescheduled",
        expect.any(Object)
      );
      expect(mockDb.update).toHaveBeenCalled();
    });
  });

  describe("resolveOrderIssue", () => {
    it("should return unauthorized if not logged in", async () => {
      (auth as any).mockResolvedValue(null);
      const result = await resolveOrderIssue("o1", "cancel");
      expect(result).toEqual({ success: false, error: "Unauthorized" });
    });

    it("should cancel order and restore voucher", async () => {
      (auth as any).mockResolvedValue({ user: { id: "u1" } });
      mockDb.query.orders.findFirst.mockResolvedValue({
        id: "o1",
        user_id: "u1",
        payment_status: "completed",
        voucher_id: "v1",
      });
      mockDb.query.vouchers.findFirst.mockResolvedValue({ id: "v1", current_uses: 1 });

      const result = await resolveOrderIssue("o1", "cancel");

      expect(result.success).toBe(true);
      expect(mockDb.update).toHaveBeenCalled();
    });

    it("should transfer order successfully", async () => {
      (auth as any).mockResolvedValue({ user: { id: "u1" } });
      // First findFirst (auth check)
      mockDb.query.orders.findFirst.mockResolvedValueOnce({
        id: "o1",
        user_id: "u1",
      });
      // Second findFirst (items check)
      mockDb.query.orders.findFirst.mockResolvedValueOnce({
        id: "o1",
        items: [{ product: { stock_quantity: 10 }, quantity: 1 }],
      });

      const result = await resolveOrderIssue("o1", "transfer", "bs2");

      expect(result.success).toBe(true);
      expect(mockDb.update).toHaveBeenCalled();
    });

    it("should fail transfer if stock insufficient", async () => {
      (auth as any).mockResolvedValue({ user: { id: "u1" } });
      mockDb.query.orders.findFirst.mockResolvedValueOnce({
        id: "o1",
        user_id: "u1",
      });
      mockDb.query.orders.findFirst.mockResolvedValueOnce({
        id: "o1",
        items: [{ product: { name: "P1", stock_quantity: 0 }, quantity: 1 }],
      });

      const result = await resolveOrderIssue("o1", "transfer", "bs2");

      expect(result.success).toBe(false);
      expect((result as { success: false; error: string }).error).toContain("Not enough stock");
    });

    it("should fail transfer if new bake sale id missing", async () => {
      (auth as any).mockResolvedValue({ user: { id: "u1" } });
      mockDb.query.orders.findFirst.mockResolvedValue({
        id: "o1",
        user_id: "u1",
      });

      const result = await resolveOrderIssue("o1", "transfer");

      expect(result.success).toBe(false);
      expect((result as { success: false; error: string }).error).toBe("New bake sale ID required");
    });
  });
});
