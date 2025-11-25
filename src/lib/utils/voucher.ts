import type { Voucher } from "@/lib/validators/voucher";

/**
 * Voucher Utility Functions
 * Helper functions for validating and calculating voucher discounts
 */

export interface VoucherValidationResult {
  valid: boolean;
  error?: string;
  discount?: number;
}

/**
 * Validate if a voucher can be applied to an order
 */
export function validateVoucher(
  voucher: Voucher | null,
  orderTotal: number
): VoucherValidationResult {
  if (!voucher) {
    return { valid: false, error: "Voucher not found" };
  }

  // Check if voucher is active
  if (!voucher.is_active) {
    return { valid: false, error: "This voucher is no longer active" };
  }

  // Check if voucher has started
  const now = new Date();
  const validFrom = new Date(voucher.valid_from);
  if (now < validFrom) {
    return {
      valid: false,
      error: `This voucher is not valid until ${validFrom.toLocaleDateString("en-GB")}`,
    };
  }

  // Check if voucher has expired
  const validUntil = new Date(voucher.valid_until);
  if (now > validUntil) {
    return {
      valid: false,
      error: `This voucher expired on ${validUntil.toLocaleDateString("en-GB")}`,
    };
  }

  // Check minimum order value
  if (orderTotal < voucher.min_order_value) {
    return {
      valid: false,
      error: `Minimum order value of £${voucher.min_order_value.toFixed(2)} required`,
    };
  }

  // Check max uses
  if (
    voucher.max_uses !== null &&
    voucher.max_uses !== undefined &&
    voucher.current_uses >= voucher.max_uses
  ) {
    return {
      valid: false,
      error: "This voucher has reached its maximum number of uses",
    };
  }

  // Calculate discount
  const discount = calculateDiscount(voucher, orderTotal);

  return { valid: true, discount };
}

/**
 * Calculate the discount amount for a voucher
 */
export function calculateDiscount(voucher: Voucher, orderTotal: number): number {
  if (voucher.type === "percentage") {
    // Percentage discount (value is 0-100)
    const discount = (orderTotal * voucher.value) / 100;
    return Math.round(discount * 100) / 100; // Round to 2 decimal places
  } else {
    // Fixed amount discount
    // Don't allow discount to exceed order total
    return Math.min(voucher.value, orderTotal);
  }
}

/**
 * Format voucher type for display
 */
export function formatVoucherType(type: Voucher["type"]): string {
  return type === "percentage" ? "Percentage" : "Fixed Amount";
}

/**
 * Format voucher value for display
 */
export function formatVoucherValue(voucher: Voucher): string {
  if (voucher.type === "percentage") {
    return `${voucher.value}%`;
  } else {
    return `£${voucher.value.toFixed(2)}`;
  }
}

/**
 * Check if voucher is expired
 */
export function isVoucherExpired(voucher: Voucher): boolean {
  const now = new Date();
  const validUntil = new Date(voucher.valid_until);
  return now > validUntil;
}

/**
 * Check if voucher is maxed out
 */
export function isVoucherMaxedOut(voucher: Voucher): boolean {
  if (voucher.max_uses === null || voucher.max_uses === undefined) return false;
  return voucher.current_uses >= voucher.max_uses;
}

/**
 * Get voucher status
 */
export function getVoucherStatus(voucher: Voucher): "active" | "expired" | "maxed" | "inactive" {
  if (!voucher.is_active) return "inactive";
  if (isVoucherExpired(voucher)) return "expired";
  if (isVoucherMaxedOut(voucher)) return "maxed";
  return "active";
}

/**
 * Generate a random voucher code
 */
export function generateVoucherCode(length: number = 10): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

/**
 * Format usage display
 */
export function formatUsage(voucher: Voucher): string {
  if (voucher.max_uses === null || voucher.max_uses === undefined) {
    return `${voucher.current_uses} uses`;
  }
  return `${voucher.current_uses} / ${voucher.max_uses}`;
}
