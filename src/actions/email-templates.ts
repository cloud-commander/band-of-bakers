"use server";

import { getDb } from "@/lib/db";
import { emailTemplates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { requireCsrf, CsrfError } from "@/lib/csrf";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

async function checkAdmin() {
  const session = await auth();
  return session?.user?.role === "owner" || session?.user?.role === "manager";
}

export async function getEmailTemplates() {
  if (!(await checkAdmin())) return [];
  const db = await getDb();
  return db.query.emailTemplates.findMany();
}

export async function getEmailTemplate(id: string) {
  if (!(await checkAdmin())) return null;
  const db = await getDb();
  return db.query.emailTemplates.findFirst({
    where: eq(emailTemplates.id, id),
  });
}

export async function updateEmailTemplate(
  id: string,
  data: { subject: string; content: string }
): Promise<ActionResult<void>> {
  if (!(await checkAdmin())) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await requireCsrf();
  } catch (e) {
    if (e instanceof CsrfError) {
      return { success: false, error: "Request blocked. Please refresh and try again." };
    }
    throw e;
  }

  try {
    const db = await getDb();
    await db
      .update(emailTemplates)
      .set({
        subject: data.subject,
        content: data.content,
        updated_at: new Date().toISOString(),
      })
      .where(eq(emailTemplates.id, id));

    revalidatePath("/admin/settings/email-templates");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to update template:", error);
    return { success: false, error: "Failed to update template" };
  }
}
