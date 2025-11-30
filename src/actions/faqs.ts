"use server";

import { getDb } from "@/lib/db";
import { faqs, InsertFaq } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

export async function getFaqs() {
  try {
    const db = await getDb();
    const allFaqs = await db.select().from(faqs).orderBy(asc(faqs.sort_order));
    return { success: true, data: allFaqs };
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return { success: false, error: "Failed to fetch FAQs" };
  }
}

export async function getPublicFaqs() {
  try {
    const db = await getDb();
    const publicFaqs = await db
      .select()
      .from(faqs)
      .where(eq(faqs.is_active, true))
      .orderBy(asc(faqs.sort_order));
    return { success: true, data: publicFaqs };
  } catch (error) {
    console.error("Error fetching public FAQs:", error);
    return { success: false, error: "Failed to fetch public FAQs" };
  }
}

export async function createFaq(data: Omit<InsertFaq, "id" | "created_at" | "updated_at">) {
  try {
    const db = await getDb();
    const newFaq = await db
      .insert(faqs)
      .values({
        id: nanoid(),
        ...data,
      })
      .returning();
    revalidatePath("/admin/faqs");
    revalidatePath("/faq");
    return { success: true, data: newFaq[0] };
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return { success: false, error: "Failed to create FAQ" };
  }
}

export async function updateFaq(
  id: string,
  data: Partial<Omit<InsertFaq, "id" | "created_at" | "updated_at">>
) {
  try {
    const db = await getDb();
    const updatedFaq = await db
      .update(faqs)
      .set({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .where(eq(faqs.id, id))
      .returning();
    revalidatePath("/admin/faqs");
    revalidatePath("/faq");
    return { success: true, data: updatedFaq[0] };
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return { success: false, error: "Failed to update FAQ" };
  }
}

export async function deleteFaq(id: string) {
  try {
    const db = await getDb();
    await db.delete(faqs).where(eq(faqs.id, id));
    revalidatePath("/admin/faqs");
    revalidatePath("/faq");
    return { success: true };
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return { success: false, error: "Failed to delete FAQ" };
  }
}

export async function toggleFaqStatus(id: string, isActive: boolean) {
  try {
    const db = await getDb();
    const updatedFaq = await db
      .update(faqs)
      .set({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .where(eq(faqs.id, id))
      .returning();
    revalidatePath("/admin/faqs");
    revalidatePath("/faq");
    return { success: true, data: updatedFaq[0] };
  } catch (error) {
    console.error("Error toggling FAQ status:", error);
    return { success: false, error: "Failed to toggle FAQ status" };
  }
}
