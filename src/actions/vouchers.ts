"use server";

import { voucherRepository } from "@/lib/repositories";
import { validateVoucher } from "@/lib/utils/voucher";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const voucherSchema = z.object({
  code: z.string().min(1),
  type: z.enum(["percentage", "fixed_amount"]),
  value: z.number().positive(),
  min_order_value: z.number().min(0),
  max_uses: z.number().int().min(0).nullable().optional(),
  current_uses: z.number().int().min(0).optional(),
  max_uses_per_customer: z.number().int().min(1),
  valid_from: z.string().min(1),
  valid_until: z.string().min(1),
  is_active: z.boolean(),
  notes: z.string().trim().max(1000).optional(),
});

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

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

/**
 * Get all vouchers (admin only)
 */
export async function getVouchers() {
  try {
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager", "staff"].includes(session.user.role)) {
      throw new Error("Unauthorized");
    }
    return await voucherRepository.findAll();
  } catch (error) {
    console.error("Failed to fetch vouchers:", error);
    return [];
  }
}

/**
 * Get top vouchers by usage (admin only)
 */
export async function getTopVouchers(limit: number = 5) {
  try {
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager", "staff"].includes(session.user.role)) {
      throw new Error("Unauthorized");
    }
    const vouchers = await voucherRepository.findAll();
    return [...vouchers].sort((a, b) => b.current_uses - a.current_uses).slice(0, limit);
  } catch (error) {
    console.error("Failed to fetch top vouchers:", error);
    return [];
  }
}

/**
 * Get voucher by ID (admin only)
 */
export async function getVoucherById(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager", "staff"].includes(session.user.role)) {
      throw new Error("Unauthorized");
    }
    return await voucherRepository.findById(id);
  } catch (error) {
    console.error("Failed to fetch voucher:", error);
    return null;
  }
}

/**
 * Update voucher (admin only)
 */
export async function updateVoucher(id: string, formData: FormData): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager", "staff"].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" };
    }

    const rawData = {
      code: formData.get("code") as string,
      type: formData.get("type") as string,
      value: Number(formData.get("value")),
      min_order_value: Number(formData.get("min_order_value")),
      max_uses: formData.get("max_uses")
        ? Number(formData.get("max_uses"))
        : (null as number | null),
      current_uses: Number(formData.get("current_uses") ?? 0),
      max_uses_per_customer: Number(formData.get("max_uses_per_customer")),
      valid_from: formData.get("valid_from") as string,
      valid_until: formData.get("valid_until") as string,
      is_active: (formData.get("is_active") as string) === "true",
      notes: (formData.get("notes") as string) || "",
    };

    const parsed = voucherSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await voucherRepository.update(id, {
      ...parsed.data,
      max_uses: parsed.data.max_uses ?? null,
      updated_at: new Date().toISOString(),
      notes: parsed.data.notes && parsed.data.notes.length > 0 ? parsed.data.notes : null,
    });

    revalidatePath("/admin/vouchers");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to update voucher:", error);
    return { success: false, error: "Failed to update voucher" };
  }
}

/**
 * Create voucher (admin only)
 */
export async function createVoucher(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager", "staff"].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" };
    }

    const rawData = {
      code: formData.get("code") as string,
      type: formData.get("type") as string,
      value: Number(formData.get("value")),
      min_order_value: Number(formData.get("min_order_value")),
      max_uses: formData.get("max_uses")
        ? Number(formData.get("max_uses"))
        : (null as number | null),
      current_uses: Number(formData.get("current_uses") ?? 0),
      max_uses_per_customer: Number(formData.get("max_uses_per_customer")),
      valid_from: formData.get("valid_from") as string,
      valid_until: formData.get("valid_until") as string,
      is_active: (formData.get("is_active") as string) === "true",
      notes: (formData.get("notes") as string) || "",
    };

    const parsed = voucherSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const voucher = await voucherRepository.create({
      ...parsed.data,
      id: crypto.randomUUID(),
      max_uses: parsed.data.max_uses ?? null,
      notes: parsed.data.notes && parsed.data.notes.length > 0 ? parsed.data.notes : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    revalidatePath("/admin/vouchers");
    return { success: true, data: { id: voucher.id } };
  } catch (error) {
    console.error("Failed to create voucher:", error);
    return { success: false, error: "Failed to create voucher" };
  }
}
