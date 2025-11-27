"use server";

import { voucherRepository } from "@/lib/repositories";
import { validateVoucher } from "@/lib/utils/voucher";

export async function validateVoucherCode(code: string, cartTotal: number) {
  try {
    const voucher = await voucherRepository.findByCode(code);

    // Convert DB voucher to Validator voucher type if needed,
    // but validateVoucher expects Validator type which is similar to DB type.
    // Let's check if types are compatible.
    // DB Voucher has snake_case fields, Validator Voucher also has snake_case.
    // They should be compatible.

    // However, validateVoucher expects `Voucher` from `@/lib/validators/voucher`.
    // The DB voucher is `typeof vouchers.$inferSelect`.
    // They should be identical or close enough.

    const result = validateVoucher(voucher, cartTotal);

    if (result.valid) {
      return { ...result, voucher };
    }

    return result;
  } catch (error) {
    console.error("Failed to validate voucher:", error);
    return { valid: false, error: "Failed to validate voucher" };
  }
}
