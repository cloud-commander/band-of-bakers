import type { Voucher } from "@/lib/validators/voucher";

// ============================================================================
// VOUCHERS - MOCK DATA
// ============================================================================

const futureDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

export const mockVouchers: Voucher[] = [
  {
    id: "vouch-1",
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    min_order_value: 20.0,
    max_uses: 100,
    current_uses: 15,
    max_uses_per_customer: 1,
    valid_from: new Date("2024-01-01T00:00:00Z").toISOString(),
    valid_until: futureDate(365),
    is_active: true,
    created_at: new Date("2024-01-01T00:00:00Z").toISOString(),
    updated_at: new Date("2024-01-01T00:00:00Z").toISOString(),
  },
  {
    id: "vouch-2",
    code: "CHRISTMAS5",
    type: "fixed_amount",
    value: 5.0,
    min_order_value: 30.0,
    max_uses: null, // Unlimited
    current_uses: 42,
    max_uses_per_customer: 1,
    valid_from: new Date("2024-12-01T00:00:00Z").toISOString(),
    valid_until: new Date("2024-12-31T23:59:59Z").toISOString(),
    is_active: true,
    created_at: new Date("2024-11-01T00:00:00Z").toISOString(),
    updated_at: new Date("2024-11-01T00:00:00Z").toISOString(),
  },
  {
    id: "vouch-3",
    code: "BLACKFRIDAY",
    type: "percentage",
    value: 20,
    min_order_value: 50.0,
    max_uses: 50,
    current_uses: 48,
    max_uses_per_customer: 1,
    valid_from: new Date("2024-11-29T00:00:00Z").toISOString(),
    valid_until: new Date("2024-11-30T23:59:59Z").toISOString(),
    is_active: true,
    created_at: new Date("2024-11-15T00:00:00Z").toISOString(),
    updated_at: new Date("2024-11-15T00:00:00Z").toISOString(),
  },
  {
    id: "vouch-4",
    code: "FREEDELIVERY",
    type: "fixed_amount",
    value: 5.0, // Assuming free delivery value
    min_order_value: 40.0,
    max_uses: 20,
    current_uses: 5,
    max_uses_per_customer: 1,
    valid_from: new Date("2024-11-01T00:00:00Z").toISOString(),
    valid_until: new Date("2024-12-31T23:59:59Z").toISOString(),
    is_active: true,
    created_at: new Date("2024-11-01T00:00:00Z").toISOString(),
    updated_at: new Date("2024-11-01T00:00:00Z").toISOString(),
  },
];

export const mockVouchersEmpty: Voucher[] = [];
export const mockVouchersSingle: Voucher[] = [mockVouchers[0]];

// Expired voucher
export const mockVoucherExpired: Voucher = {
  ...mockVouchers[0],
  id: "vouch-expired",
  code: "EXPIRED",
  valid_until: new Date("2024-01-01T00:00:00Z").toISOString(),
};

// Max uses reached
export const mockVoucherMaxUses: Voucher = {
  ...mockVouchers[2],
  id: "vouch-maxed",
  code: "MAXED OUT",
  current_uses: 50,
};
