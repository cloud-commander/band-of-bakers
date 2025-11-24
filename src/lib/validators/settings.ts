import { z } from "zod";

// ============================================================================
// SETTINGS SCHEMAS
// ============================================================================

export const settingSchema = z.object({
  id: z.string().uuid(),
  key: z.string().min(1, "Setting key is required"),
  value: z.string().min(1, "Setting value is required"), // JSON string
  description: z.string().nullable().optional(),
  updated_at: z.string().datetime(),
});

export const insertSettingSchema = z.object({
  key: z.string().min(1, "Setting key is required"),
  value: z.string().min(1, "Setting value is required"),
  description: z.string().nullable().optional(),
});

export const updateSettingSchema = insertSettingSchema.partial().extend({
  id: z.string().uuid(),
});

// ============================================================================
// SPECIFIC SETTING SCHEMAS
// ============================================================================

// Payment methods enabled setting
export const paymentMethodsEnabledSchema = z.object({
  stripe: z.boolean(),
  paypal: z.boolean(),
  bank_transfer: z.boolean(),
  payment_on_collection: z.boolean(), // Always available, cannot be disabled
});

// Fulfillment methods enabled setting
export const fulfillmentMethodsEnabledSchema = z.object({
  collection: z.boolean(),
  delivery: z.boolean(),
});

// Delivery fee setting
export const deliveryFeeSchema = z.string().regex(/^\d+\.\d{2}$/); // e.g. "5.00"

// Type exports
export type Setting = z.infer<typeof settingSchema>;
export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type UpdateSetting = z.infer<typeof updateSettingSchema>;

export type PaymentMethodsEnabled = z.infer<typeof paymentMethodsEnabledSchema>;
export type FulfillmentMethodsEnabled = z.infer<
  typeof fulfillmentMethodsEnabledSchema
>;
export type DeliveryFee = z.infer<typeof deliveryFeeSchema>;
