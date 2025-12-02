"use server";

import { getDb } from "@/lib/db";
import { emailTemplates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { requireCsrf, CsrfError } from "@/lib/csrf";
import { sendEmailWithContent } from "@/lib/email/service";

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

function buildSampleVariables(keys: string[] | null | undefined) {
  const vars: Record<string, string> = {};
  (keys || []).forEach((key) => {
    vars[key] = `Sample ${key}`;
  });
  return vars;
}

export async function sendTestEmail(
  id: string,
  to: string,
  subjectOverride?: string,
  contentOverride?: string,
  variableKeys?: string[]
): Promise<ActionResult<void>> {
  if (!to) return { success: false, error: "Recipient email is required" };
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

  const db = await getDb();
  const template = await db.query.emailTemplates.findFirst({
    where: eq(emailTemplates.id, id),
  });

  if (!template) return { success: false, error: "Template not found" };

  const subject = subjectOverride || template.subject;
  const content = contentOverride || template.content;
  const vars = buildSampleVariables(variableKeys ?? template.variables);

  let renderedSubject = subject;
  let renderedContent = content;

  for (const [key, value] of Object.entries(vars)) {
    const regex = new RegExp(`{{${key}}}`, "g");
    renderedSubject = renderedSubject.replace(regex, value);
    renderedContent = renderedContent.replace(regex, value);
  }

  const result = await sendEmailWithContent(to, renderedSubject, renderedContent);
  if (!result.success) {
    return { success: false, error: "Failed to send test email" };
  }
  return { success: true, data: undefined };
}
