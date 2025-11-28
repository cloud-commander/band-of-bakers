import { describe, it, expect } from "vitest";
import { insertVoucherSchema, updateVoucherSchema, applyVoucherSchema } from "../voucher";

describe("Voucher Validators", () => {
  describe("insertVoucherSchema", () => {
    const validPercentageVoucher = {
      code: "SAVE20",
      type: "percentage" as const,
      value: 20,
      min_order_value: 10,
      max_uses: 100,
      max_uses_per_customer: 1,
      valid_from: "2025-01-01T00:00:00Z",
      valid_until: "2025-12-31T23:59:59Z",
      is_active: true,
    };

    const validFixedAmountVoucher = {
      code: "SAVE5",
      type: "fixed_amount" as const,
      value: 5,
      min_order_value: 20,
      max_uses: 50,
      max_uses_per_customer: 1,
      valid_from: "2025-01-01T00:00:00Z",
      valid_until: "2025-12-31T23:59:59Z",
      is_active: true,
    };

    it("should validate a correct percentage voucher", () => {
      const result = insertVoucherSchema.safeParse(validPercentageVoucher);
      expect(result.success).toBe(true);
    });

    it("should validate a correct fixed amount voucher", () => {
      const result = insertVoucherSchema.safeParse(validFixedAmountVoucher);
      expect(result.success).toBe(true);
    });

    it("should convert voucher code to uppercase", () => {
      const result = insertVoucherSchema.safeParse({
        ...validPercentageVoucher,
        code: "save20",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.code).toBe("SAVE20");
      }
    });

    it("should fail if code is empty", () => {
      const result = insertVoucherSchema.safeParse({
        ...validPercentageVoucher,
        code: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("code is required");
      }
    });

    it("should fail if type is invalid", () => {
      const result = insertVoucherSchema.safeParse({
        ...validPercentageVoucher,
        type: "invalid_type",
      });
      expect(result.success).toBe(false);
    });

    it("should fail if value is zero", () => {
      const result = insertVoucherSchema.safeParse({
        ...validPercentageVoucher,
        value: 0,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("must be positive");
      }
    });

    it("should fail if value is negative", () => {
      const result = insertVoucherSchema.safeParse({
        ...validPercentageVoucher,
        value: -10,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("must be positive");
      }
    });

    it("should fail if percentage value is greater than 100", () => {
      const result = insertVoucherSchema.safeParse({
        ...validPercentageVoucher,
        value: 150,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("between 0 and 100");
      }
    });

    it("should accept percentage value of 100", () => {
      const result = insertVoucherSchema.safeParse({
        ...validPercentageVoucher,
        value: 100,
      });
      expect(result.success).toBe(true);
    });

    it("should accept percentage value of 1", () => {
      const result = insertVoucherSchema.safeParse({
        ...validPercentageVoucher,
        value: 1,
      });
      expect(result.success).toBe(true);
    });

    it("should allow fixed amount vouchers with value greater than 100", () => {
      const result = insertVoucherSchema.safeParse({
        ...validFixedAmountVoucher,
        value: 500,
      });
      expect(result.success).toBe(true);
    });

    it("should fail if min_order_value is negative", () => {
      const result = insertVoucherSchema.safeParse({
        ...validPercentageVoucher,
        min_order_value: -5,
      });
      expect(result.success).toBe(false);
    });

    it("should accept min_order_value of 0", () => {
      const result = insertVoucherSchema.safeParse({
        ...validPercentageVoucher,
        min_order_value: 0,
      });
      expect(result.success).toBe(true);
    });

    it("should allow null max_uses (unlimited)", () => {
      const result = insertVoucherSchema.safeParse({
        ...validPercentageVoucher,
        max_uses: null,
      });
      expect(result.success).toBe(true);
    });

    it("should fail if max_uses is zero", () => {
      const result = insertVoucherSchema.safeParse({
        ...validPercentageVoucher,
        max_uses: 0,
      });
      expect(result.success).toBe(false);
    });

    it("should fail if max_uses is negative", () => {
      const result = insertVoucherSchema.safeParse({
        ...validPercentageVoucher,
        max_uses: -10,
      });
      expect(result.success).toBe(false);
    });

    it("should default current_uses to 0", () => {
      const voucherWithoutCurrentUses = { ...validPercentageVoucher };
      const result = insertVoucherSchema.safeParse(voucherWithoutCurrentUses);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.current_uses).toBe(0);
      }
    });
    it("should fail if current_uses is negative", () => {
      const result = insertVoucherSchema.safeParse({
        ...validPercentageVoucher,
        current_uses: -5,
      });
      expect(result.success).toBe(false);
    });

    it("should default max_uses_per_customer to 1", () => {
      const voucherWithoutMaxPerCustomer = { ...validPercentageVoucher };
      const result = insertVoucherSchema.safeParse(voucherWithoutMaxPerCustomer);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.max_uses_per_customer).toBe(1);
      }
    });

    it("should fail if max_uses_per_customer is zero", () => {
      const result = insertVoucherSchema.safeParse({
        ...validPercentageVoucher,
        max_uses_per_customer: 0,
      });
      expect(result.success).toBe(false);
    });

    it("should fail if valid_until is before valid_from", () => {
      const result = insertVoucherSchema.safeParse({
        ...validPercentageVoucher,
        valid_from: "2025-12-31T23:59:59Z",
        valid_until: "2025-01-01T00:00:00Z",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("must be after");
      }
    });

    it("should fail if valid_until equals valid_from", () => {
      const sameDate = "2025-06-01T12:00:00Z";
      const result = insertVoucherSchema.safeParse({
        ...validPercentageVoucher,
        valid_from: sameDate,
        valid_until: sameDate,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("must be after");
      }
    });

    it("should default is_active to true", () => {
      const voucherWithoutActive = { ...validPercentageVoucher };
      const result = insertVoucherSchema.safeParse(voucherWithoutActive);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.is_active).toBe(true);
      }
    });

    it("should accept is_active as false", () => {
      const result = insertVoucherSchema.safeParse({
        ...validPercentageVoucher,
        is_active: false,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("updateVoucherSchema", () => {
    const validUpdate = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      code: "UPDATED20",
      value: 25,
    };

    it("should validate a partial update", () => {
      const result = updateVoucherSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it("should allow updating only is_active status", () => {
      const result = updateVoucherSchema.safeParse({
        id: "123e4567-e89b-12d3-a456-426614174000",
        is_active: false,
      });
      expect(result.success).toBe(true);
    });

    it("should require valid UUID for id", () => {
      const result = updateVoucherSchema.safeParse({
        id: "invalid-uuid",
        value: 30,
      });
      expect(result.success).toBe(false);
    });

    it("should convert updated code to uppercase", () => {
      const result = updateVoucherSchema.safeParse({
        id: "123e4567-e89b-12d3-a456-426614174000",
        code: "newcode",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.code).toBe("NEWCODE");
      }
    });

    it("should fail if updated percentage value exceeds 100", () => {
      const result = updateVoucherSchema.safeParse({
        id: "123e4567-e89b-12d3-a456-426614174000",
        type: "percentage",
        value: 150,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("between 0 and 100");
      }
    });

    it("should validate date range when updating dates", () => {
      const result = updateVoucherSchema.safeParse({
        id: "123e4567-e89b-12d3-a456-426614174000",
        valid_from: "2025-12-31T23:59:59Z",
        valid_until: "2025-01-01T00:00:00Z",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("must be after");
      }
    });
  });

  describe("applyVoucherSchema", () => {
    it("should validate voucher application", () => {
      const result = applyVoucherSchema.safeParse({
        code: "SAVE20",
        order_subtotal: 50.0,
      });
      expect(result.success).toBe(true);
    });

    it("should convert voucher code to uppercase", () => {
      const result = applyVoucherSchema.safeParse({
        code: "save20",
        order_subtotal: 50.0,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.code).toBe("SAVE20");
      }
    });

    it("should fail if code is empty", () => {
      const result = applyVoucherSchema.safeParse({
        code: "",
        order_subtotal: 50.0,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("code is required");
      }
    });

    it("should fail if order_subtotal is negative", () => {
      const result = applyVoucherSchema.safeParse({
        code: "SAVE20",
        order_subtotal: -10,
      });
      expect(result.success).toBe(false);
    });

    it("should accept order_subtotal of 0", () => {
      const result = applyVoucherSchema.safeParse({
        code: "SAVE20",
        order_subtotal: 0,
      });
      expect(result.success).toBe(true);
    });
  });
});
