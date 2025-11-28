import { Resend } from "resend";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

type Payload = {
  to: string;
  subject?: string;
  html?: string;
};

function buildPayload(args: string[]): Payload | null {
  const [to, subjectArg, htmlArg] = args;
  if (!to) return null;

  const subject = subjectArg || "Band of Bakers test email";
  const html =
    htmlArg ||
    `<h1>Test Email</h1><p>This is a test from the Resend script.</p><p>Time: ${new Date().toISOString()}</p>`;

  return { to, subject, html };
}

async function main() {
  const payload = buildPayload(process.argv.slice(2));
  if (!payload) {
    console.error("Usage: npx tsx scripts/test-resend.ts <toEmail> [subject] [htmlString]");
    process.exit(1);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "orders@bandofbakers.co.uk";
  const fromName = process.env.RESEND_FROM_NAME || "Band of Bakers";

  // If no API key, mock output so the script is still useful locally
  if (!apiKey) {
    console.log("[MOCK] RESEND_API_KEY not set. Would send:");
    console.log({ from: `${fromName} <${fromEmail}>`, ...payload });
    process.exit(0);
  }

  const resend = new Resend(apiKey);

  try {
    const response = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: payload.to,
      subject: payload.subject!,
      html: payload.html!,
    });

    console.log("Send response:", JSON.stringify(response, null, 2));
    if (response.error) {
      process.exitCode = 1;
    }
  } catch (err) {
    console.error("Failed to send via Resend:", err);
    process.exit(1);
  }
}

main();
