import { describe, it, expect } from "vitest";
import {
  validateVoucher,
  calculateDiscount,
  formatVoucherType,
  formatVoucherValue,
  isVoucherExpired,
  isVoucherMaxedOut,
  getVoucherStatus,
  generateVoucherCode,
  formatUsage,
} from "../voucher";
import type { Voucher } from "@/lib/validators/voucher";

describe("Voucher Utils", () => {
  const mockVoucher: Voucher = {
    id: "v1",
    code: "TEST10",
    type: "percentage",
    value: 10,
    min_order_value: 0,
    max_discount: null,
    valid_from: new Date(Date.now() - 10000).toISOString(), // Started
    valid_until: new Date(Date.now() + 10000).toISOString(), // Not expired
    is_active: true,
    current_uses: 0,
    max_uses: 100,
    max_uses_per_customer: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  describe("validateVoucher", () => {
    it("returns error if voucher is null", () => {
      const result = validateVoucher(null, 100);
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Voucher not found");
    });

    it("returns error if voucher is inactive", () => {
      const result = validateVoucher({ ...mockVoucher, is_active: false }, 100);
      expect(result.valid).toBe(false);
      expect(result.error).toBe("This voucher is no longer active");
    });

    it("returns error if voucher has not started", () => {
      const futureDate = new Date(Date.now() + 100000).toISOString();
      const result = validateVoucher({ ...mockVoucher, valid_from: futureDate }, 100);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("not valid until");
    });

    it("returns error if voucher is expired", () => {
      const pastDate = new Date(Date.now() - 100000).toISOString();
      const result = validateVoucher({ ...mockVoucher, valid_until: pastDate }, 100);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("expired on");
    });

    it("returns error if order total is below minimum", () => {
      const result = validateVoucher({ ...mockVoucher, min_order_value: 50 }, 40);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Minimum order value");
    });

    it("returns error if max uses reached", () => {
      const result = validateVoucher({ ...mockVoucher, max_uses: 10, current_uses: 10 }, 100);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("maximum number of uses");
    });

    it("returns valid result with discount", () => {
      const result = validateVoucher(mockVoucher, 100);
      expect(result.valid).toBe(true);
      expect(result.discount).toBe(10); // 10% of 100
    });
  });

  describe("calculateDiscount", () => {
    it("calculates percentage discount", () => {
      const voucher = { ...mockVoucher, type: "percentage" as const, value: 20 };
      expect(calculateDiscount(voucher, 100)).toBe(20);
      expect(calculateDiscount(voucher, 50)).toBe(10);
    });

    it("calculates fixed amount discount", () => {
      const voucher = { ...mockVoucher, type: "fixed_amount" as const, value: 15 };
      expect(calculateDiscount(voucher, 100)).toBe(15);
    });

    it("caps fixed discount at order total", () => {
      const voucher = { ...mockVoucher, type: "fixed_amount" as const, value: 50 };
      expect(calculateDiscount(voucher, 30)).toBe(30);
    });
  });

  describe("formatters", () => {
    it("formats voucher type", () => {
      expect(formatVoucherType("percentage")).toBe("Percentage");
      expect(formatVoucherType("fixed_amount")).toBe("Fixed Amount");
    });

    it("formats voucher value", () => {
      expect(formatVoucherValue({ ...mockVoucher, type: "percentage", value: 10 })).toBe("10%");
      expect(formatVoucherValue({ ...mockVoucher, type: "fixed_amount", value: 10 })).toBe(
        "£10.00"
      );
    });

    it("formats usage", () => {
      expect(formatUsage({ ...mockVoucher, current_uses: 5, max_uses: 10 })).toBe("5 / 10");
      expect(formatUsage({ ...mockVoucher, current_uses: 5, max_uses: null })).toBe("5 uses");
    });
  });

  describe("status checks", () => {
    it("checks if expired", () => {
      expect(
        isVoucherExpired({ ...mockVoucher, valid_until: new Date(Date.now() - 1000).toISOString() })
      ).toBe(true);
      expect(
        isVoucherExpired({ ...mockVoucher, valid_until: new Date(Date.now() + 1000).toISOString() })
      ).toBe(false);
    });

    it("checks if maxed out", () => {
      expect(isVoucherMaxedOut({ ...mockVoucher, max_uses: 10, current_uses: 10 })).toBe(true);
      expect(isVoucherMaxedOut({ ...mockVoucher, max_uses: 10, current_uses: 9 })).toBe(false);
      expect(isVoucherMaxedOut({ ...mockVoucher, max_uses: null })).toBe(false);
    });

    it("gets correct status", () => {
      expect(getVoucherStatus({ ...mockVoucher, is_active: false })).toBe("inactive");
      expect(
        getVoucherStatus({ ...mockVoucher, valid_until: new Date(Date.now() - 1000).toISOString() })
      ).toBe("expired");
      expect(getVoucherStatus({ ...mockVoucher, max_uses: 10, current_uses: 10 })).toBe("maxed");
      expect(getVoucherStatus(mockVoucher)).toBe("active");
    });
  });

  describe("generateVoucherCode", () => {
    it("generates code of specified length", () => {
      const code = generateVoucherCode(8);
      expect(code).toHaveLength(8);
    });

    it("generates code with default length 10", () => {
      const code = generateVoucherCode();
      expect(code).toHaveLength(10);
    });
  });
});
