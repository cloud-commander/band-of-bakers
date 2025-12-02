import { Resend } from "resend";
import { getDb } from "@/lib/db";
import { emailTemplates } from "@/db/schema";
import { eq } from "drizzle-orm";

const verifiedDomain = "notifications.severnweb.net";

function getFromAddress() {
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

  return {
    from: `${process.env.RESEND_FROM_NAME || "Band of Bakers"} <${fromEmail}>`,
    replyTo: process.env.RESEND_REPLY_TO_EMAIL || "support@bandofbakers.co.uk",
  };
}

const BRAND_LOGO_URL = "https://bandofbakers.co.uk/images/logos/bandofbakers-256.png";
const BRAND_PRIMARY = "#d97706"; // amber-600
const BRAND_TEXT = "#1c1917"; // stone-900
const BRAND_MUTED = "#57534e"; // stone-600
const BRAND_BG = "#fafaf9"; // stone-50

function wrapEmailHtml(innerHtml: string) {
  return `
  <body style="margin:0;padding:0;background:${BRAND_BG};font-family: 'Inter', Arial, sans-serif;color:${BRAND_TEXT};">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${BRAND_BG};padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="640" style="background:#ffffff;border:1px solid #e7e5e4;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:24px;text-align:center;background:${BRAND_BG};border-bottom:1px solid #e7e5e4;">
                <a href="https://bandofbakers.co.uk" style="text-decoration:none;display:inline-flex;align-items:center;gap:8px;color:${BRAND_TEXT};">
                  <img src="${BRAND_LOGO_URL}" alt="Band of Bakers" width="72" height="72" style="border:0;display:block;margin:0 auto;border-radius:12px;" />
                  <span style="font-size:18px;font-weight:700;">Band of Bakers</span>
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px;line-height:1.6;color:${BRAND_TEXT};">
                ${innerHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid #e7e5e4;background:${BRAND_BG};color:${BRAND_MUTED};font-size:13px;text-align:center;">
                <div style="margin-bottom:6px;">Made with care in Shropshire</div>
                <div style="color:${BRAND_TEXT};font-weight:600;">bandofbakers.co.uk</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  `;
}

async function sendRawEmail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log("---------------------------------------------------");
    console.log(`[MOCK EMAIL] Sending to ${to}`);
    console.log(`Subject: ${subject}`);
    console.log("Content Preview:");
    console.log(html.substring(0, 200) + "...");
    console.log("---------------------------------------------------");
    return { success: true, data: { id: "mock_id" } };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { from, replyTo } = getFromAddress();
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
      replyTo,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}

export async function sendEmail(
  to: string,
  templateName: string,
  variables: Record<string, string>
) {
  const db = await getDb();
  // Fetch template
  const template = await db.query.emailTemplates.findFirst({
    columns: {
      name: true,
      subject: true,
      content: true,
    },
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

  return sendRawEmail(to, subject, wrapEmailHtml(content));
}

export async function sendEmailWithContent(to: string, subject: string, html: string) {
  return sendRawEmail(to, subject, wrapEmailHtml(html));
}
