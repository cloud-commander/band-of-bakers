import { Resend } from "resend";
import { getDb } from "@/lib/db";
import { emailTemplates } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function sendEmail(
  to: string,
  templateName: string,
  variables: Record<string, string>
) {
  const db = await getDb();
  // Fetch template
  const template = await db.query.emailTemplates.findFirst({
    where: eq(emailTemplates.name, templateName),
  });

  if (!template) {
    console.error(`Email template not found: ${templateName}`);
    return { success: false, error: "Template not found" };
  }

  // Replace variables
  let content = template.content;
  let subject = template.subject;

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, "g");
    content = content.replace(regex, value);
    subject = subject.replace(regex, value);
  }

  // Check for missing variables in content (optional, but good for debugging)
  const missingVars = content.match(/{{.*?}}/g);
  if (missingVars) {
    console.warn(`Missing variables in email to ${to}:`, missingVars);
  }

  // Send email
  if (!process.env.RESEND_API_KEY) {
    console.log("---------------------------------------------------");
    console.log(`[MOCK EMAIL] Sending '${templateName}' to ${to}`);
    console.log(`Subject: ${subject}`);
    console.log("Content Preview:");
    console.log(content.substring(0, 200) + "...");
    console.log("---------------------------------------------------");
    return { success: true, data: { id: "mock_id" } };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Use verified domain logic to prevent 403 errors
    const verifiedDomain = "notifications.severnweb.net";
    const envFrom = process.env.RESEND_FROM_EMAIL;
    const fromEmail =
      envFrom && envFrom.toLowerCase().endsWith(`@${verifiedDomain}`)
        ? envFrom
        : `no-reply@${verifiedDomain}`;

    if (envFrom && !envFrom.toLowerCase().endsWith(`@${verifiedDomain}`)) {
      console.warn(
        `[WARN] RESEND_FROM_EMAIL (${envFrom}) is not on verified domain ${verifiedDomain}; using ${fromEmail}.`
      );
    }

    const data = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME || "Band of Bakers"} <${fromEmail}>`,
      to,
      subject,
      html: content,
      replyTo: process.env.RESEND_REPLY_TO_EMAIL || "support@bandofbakers.co.uk",
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
