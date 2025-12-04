import { describe, it, expect, vi, beforeEach } from "vitest";
import { getDashboardStats } from "../dashboard";

vi.mock("@/lib/repositories/order.repository", () => ({
  orderRepository: {
    count: vi.fn().mockResolvedValue(0),
    sumTotal: vi.fn().mockResolvedValue(0),
    findRecent: vi.fn().mockResolvedValue([]),
    revenueLastNDays: vi.fn().mockResolvedValue([]),
    statusCounts: vi.fn().mockResolvedValue([]),
    topProducts: vi.fn().mockResolvedValue([]),
    countSince: vi.fn().mockResolvedValue(0),
    countBetween: vi.fn().mockResolvedValue(0),
    sumTotalSince: vi.fn().mockResolvedValue(0),
    sumTotalBetween: vi.fn().mockResolvedValue(0),
    overdueCountsByStatus: vi.fn().mockResolvedValue([
      { status: "pending", count: 3 },
      { status: "processing", count: 2 },
      { status: "ready", count: 1 },
    ]),
  },
}));

vi.mock("@/lib/repositories/product.repository", () => ({
  productRepository: {
    countActive: vi.fn().mockResolvedValue(0),
  },
}));

vi.mock("@/lib/repositories/user.repository", () => ({
  userRepository: {
    countCustomers: vi.fn().mockResolvedValue(0),
  },
}));

vi.mock("@/lib/repositories/bake-sale.repository", () => ({
  bakeSaleRepository: {
    findUpcoming: vi.fn().mockResolvedValue([]),
  },
}));

describe("getDashboardStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns overdue counts for pending, processing and ready orders", async () => {
    const result = await getDashboardStats();

    const { orderRepository } = await import("@/lib/repositories/order.repository");

    expect(result.overdue).toEqual([
      { status: "pending", count: 3 },
      { status: "processing", count: 2 },
      { status: "ready", count: 1 },
    ]);
    expect(orderRepository.overdueCountsByStatus).toHaveBeenCalledWith(
      ["pending", "processing", "ready"],
      expect.any(String)
    );
  });
});
