"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { bakeSaleRepository } from "@/lib/repositories/bake-sale.repository";
import { z } from "zod";
import { bakeSales, type BakeSale } from "@/db/schema";

// Validation schema
const bakeSaleSchema = z.object({
  date: z.string().min(1, "Date is required"),
  location_id: z.string().min(1, "Location is required"),
  cutoff_datetime: z.string().min(1, "Cutoff time is required"),
  is_active: z.boolean().default(true),
});

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

/**
 * Get all bake sales (upcoming and archived)
 */
export async function getBakeSales() {
  try {
    const upcoming = await bakeSaleRepository.findUpcoming();
    const archived = await bakeSaleRepository.findArchived();
    return { upcoming, archived };
  } catch (error) {
    console.error("Get bake sales error:", error);
    return { upcoming: [], archived: [] };
  }
}

/**
 * Get all active locations for dropdowns
 */
export async function getLocations() {
  try {
    const { locationRepository } = await import("@/lib/repositories/location.repository");
    return await locationRepository.findActive();
  } catch (error) {
    console.error("Get locations error:", error);
    return [];
  }
}

/**
 * Get a single bake sale by ID
 */
export async function getBakeSaleById(id: string) {
  try {
    return await bakeSaleRepository.findByIdWithLocation(id);
  } catch (error) {
    console.error("Get bake sale error:", error);
    return null;
  }
}

/**
 * Create a new bake sale
 */
export async function createBakeSale(formData: FormData): Promise<ActionResult<any>> {
  try {
    // 1. Auth check
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager", "staff"].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" };
    }

    // 2. Validation
    const rawData = {
      date: formData.get("date"),
      location_id: formData.get("location_id"),
      cutoff_datetime: formData.get("cutoff_datetime"),
      is_active: formData.get("is_active") === "true",
    };

    const validated = bakeSaleSchema.safeParse(rawData);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    // 3. Create record
    const id = crypto.randomUUID();
    const bakeSale = await bakeSaleRepository.create({
      id,
      ...validated.data,
    });

    // 4. Revalidate
    revalidatePath("/admin/bake-sales");
    revalidatePath("/"); // Homepage usually shows upcoming bake sales

    return { success: true, data: bakeSale };
  } catch (error) {
    console.error("Create bake sale error:", error);
    return { success: false, error: "Failed to create bake sale" };
  }
}

/**
 * Update an existing bake sale
 */
export async function updateBakeSale(id: string, formData: FormData): Promise<ActionResult<any>> {
  try {
    // 1. Auth check
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager", "staff"].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" };
    }

    // 2. Validation
    const rawData = {
      date: formData.get("date"),
      location_id: formData.get("location_id"),
      cutoff_datetime: formData.get("cutoff_datetime"),
      is_active: formData.get("is_active") === "true",
    };

    const validated = bakeSaleSchema.safeParse(rawData);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    // 3. Update record
    const bakeSale = await bakeSaleRepository.update(id, validated.data);

    if (!bakeSale) {
      return { success: false, error: "Bake sale not found" };
    }

    // 4. Revalidate
    revalidatePath("/admin/bake-sales");
    revalidatePath("/");

    return { success: true, data: bakeSale };
  } catch (error) {
    console.error("Update bake sale error:", error);
    return { success: false, error: "Failed to update bake sale" };
  }
}

/**
 * Delete a bake sale
 */
export async function deleteBakeSale(id: string): Promise<ActionResult<void>> {
  try {
    // 1. Auth check
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager"].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" };
    }

    // 2. Delete record
    await bakeSaleRepository.delete(id);

    // 3. Revalidate
    revalidatePath("/admin/bake-sales");
    revalidatePath("/");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Delete bake sale error:", error);
    return { success: false, error: "Failed to delete bake sale" };
  }
}
