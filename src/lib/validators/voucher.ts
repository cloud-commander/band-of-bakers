import { z } from "zod";

// ============================================================================
// VOUCHER SCHEMAS
// ============================================================================

export const voucherTypes = ["percentage", "fixed_amount"] as const;
export type VoucherType = (typeof voucherTypes)[number];

export const voucherSchema = z
  .object({
    id: z.string().uuid(),
    code: z.string().min(1, "Voucher code is required").toUpperCase(),
    type: z.enum(voucherTypes),
    value: z.number().positive("Value must be positive"),
    min_order_value: z.number().nonnegative().default(0),
    max_uses: z.number().int().positive().nullable().optional(), // NULL = unlimited
    current_uses: z.number().int().nonnegative().default(0),
    max_uses_per_customer: z.number().int().positive().default(1),
    valid_from: z.string().datetime(),
    valid_until: z.string().datetime(),
    is_active: z.boolean().default(true),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
  })
  .refine(
    (data) => {
      // Percentage vouchers must be between 0-100
      if (data.type === "percentage") {
        return data.value > 0 && data.value <= 100;
      }
      return true;
    },
    {
      message: "Percentage value must be between 0 and 100",
      path: ["value"],
    }
  )
  .refine(
    (data) => {
      // valid_until must be after valid_from
      return new Date(data.valid_until) > new Date(data.valid_from);
    },
    {
      message: "Valid until date must be after valid from date",
      path: ["valid_until"],
    }
  );

export const insertVoucherSchema = z
  .object({
    code: z.string().min(1, "Voucher code is required").toUpperCase(),
    type: z.enum(voucherTypes),
    value: z.number().positive("Value must be positive"),
    min_order_value: z.number().nonnegative().default(0),
    max_uses: z.number().int().positive().nullable().optional(),
    current_uses: z.number().int().nonnegative().default(0),
    max_uses_per_customer: z.number().int().positive().default(1),
    valid_from: z.string().datetime(),
    valid_until: z.string().datetime(),
    is_active: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (data.type === "percentage") {
        return data.value > 0 && data.value <= 100;
      }
      return true;
    },
    {
      message: "Percentage value must be between 0 and 100",
      path: ["value"],
    }
  )
  .refine(
    (data) => {
      return new Date(data.valid_until) > new Date(data.valid_from);
    },
    {
      message: "Valid until date must be after valid from date",
      path: ["valid_until"],
    }
  );

export const updateVoucherSchema = insertVoucherSchema
  .partial()
  .extend({
    id: z.string().uuid(),
  })
  .refine(
    (data) => {
      if (data.type === "percentage" && data.value !== undefined) {
        return data.value > 0 && data.value <= 100;
      }
      return true;
    },
    {
      message: "Percentage value must be between 0 and 100",
      path: ["value"],
    }
  )
  .refine(
    (data) => {
      if (data.valid_from && data.valid_until) {
        return new Date(data.valid_until) > new Date(data.valid_from);
      }
      return true;
    },
    {
      message: "Valid until date must be after valid from date",
      path: ["valid_until"],
    }
  );

// Voucher application schema (for checking at checkout)
export const applyVoucherSchema = z.object({
  code: z.string().min(1, "Voucher code is required").toUpperCase(),
  order_subtotal: z.number().nonnegative(),
});

// Type exports
export type Voucher = z.infer<typeof voucherSchema>;
export type InsertVoucher = z.infer<typeof insertVoucherSchema>;
export type UpdateVoucher = z.infer<typeof updateVoucherSchema>;
export type ApplyVoucher = z.infer<typeof applyVoucherSchema>;
