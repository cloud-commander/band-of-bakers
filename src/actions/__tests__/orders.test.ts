import { describe, it, expect, vi, beforeEach } from "vitest";
import { createOrder } from "../orders";
import { auth } from "@/auth";
import { orderRepository } from "@/lib/repositories/order.repository";
import { userRepository } from "@/lib/repositories/user.repository";
import { productRepository } from "@/lib/repositories/product.repository";
import { voucherRepository } from "@/lib/repositories/voucher.repository";
import { validateVoucher } from "@/lib/utils/voucher";
import { verifyTurnstileToken } from "@/lib/actions/verify-turnstile";

// Mock dependencies
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));
vi.mock("@/lib/repositories/order.repository");
vi.mock("@/lib/repositories/user.repository");
vi.mock("@/lib/repositories/product.repository");
vi.mock("@/lib/repositories/voucher.repository");
vi.mock("@/lib/utils/voucher");
vi.mock("@/lib/email/service");
vi.mock("@/lib/actions/verify-turnstile");
vi.mock("next/cache");
vi.mock("@/lib/repositories/bake-sale.repository", () => ({
  bakeSaleRepository: {
    findUpcoming: vi.fn().mockResolvedValue([{ id: "sale-1" }]),
  },
}));

describe("createOrder", () => {
  const validOrderData = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "1234567890",
    fulfillment_method: "collection" as const,
    items: [
      {
        productId: "prod-1",
        quantity: 2,
      },
    ],
    payment_method: "payment_on_collection" as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    (auth as any).mockResolvedValue(null);
    (userRepository.findByEmail as any).mockResolvedValue(null);
    (userRepository.create as any).mockResolvedValue({ id: "new-user-id" });
    (productRepository.findById as any).mockResolvedValue({
      id: "prod-1",
      name: "Test Product",
      base_price: 1000,
      is_active: true,
      stock_quantity: 10,
    });
    (productRepository.decrementStock as any).mockResolvedValue(true);
    (orderRepository.createWithItems as any).mockResolvedValue({ id: "order-1" });
    (verifyTurnstileToken as any).mockResolvedValue({ success: true });
  });

  it("creates an order successfully for a guest user", async () => {
    const result = await createOrder(validOrderData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe("order-1");
    }

    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "john@example.com",
        name: "John Doe",
      })
    );
    expect(orderRepository.createWithItems).toHaveBeenCalled();
  });

  it("validates input data", async () => {
    const invalidData = { ...validOrderData, email: "invalid-email" };
    const result = await createOrder(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeDefined();
    }
  });

  it("checks product availability", async () => {
    (productRepository.findById as any).mockResolvedValue(null);

    const result = await createOrder(validOrderData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Product not found");
    }
  });

  it("checks stock availability", async () => {
    (productRepository.findById as any).mockResolvedValue({
      id: "prod-1",
      name: "Test Product",
      base_price: 1000,
      is_active: true,
      stock_quantity: 1, // Less than requested 2
    });

    const result = await createOrder(validOrderData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Insufficient stock");
    }
  });

  it("applies voucher correctly", async () => {
    const dataWithVoucher = { ...validOrderData, voucherCode: "SAVE10" };

    (voucherRepository.findByCode as any).mockResolvedValue({
      id: "voucher-1",
      code: "SAVE10",
    });
    (validateVoucher as any).mockReturnValue({
      valid: true,
      discount: 200,
    });
    (voucherRepository.incrementUsage as any).mockResolvedValue(true);

    const result = await createOrder(dataWithVoucher);

    expect(result.success).toBe(true);
    expect(validateVoucher).toHaveBeenCalled();
    expect(voucherRepository.incrementUsage).toHaveBeenCalledWith("voucher-1");
  });

  it("handles voucher validation failure", async () => {
    const dataWithVoucher = { ...validOrderData, voucherCode: "INVALID" };

    (voucherRepository.findByCode as any).mockResolvedValue({
      id: "voucher-1",
      code: "INVALID",
    });
    (validateVoucher as any).mockReturnValue({
      valid: false,
      error: "Voucher expired",
    });

    const result = await createOrder(dataWithVoucher);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Voucher expired");
    }
  });
});
