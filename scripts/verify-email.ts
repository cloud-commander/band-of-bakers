import { Resend } from "resend";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const toEmail = process.argv[2];
  const subject = process.argv[3] || "Band of Bakers: Hello world";
  const html =
    process.argv[4] ||
    `<h1>Hello world</h1><p>This is a simple Resend test from scripts/verify-email.ts.</p><p>Sent at ${new Date().toISOString()}</p>`;

  if (!toEmail) {
    console.error("Usage: npx tsx scripts/verify-email.ts <email> [subject] [html]");
    process.exit(1);
  }

  const apiKey = process.env.RESEND_API_KEY;
  // Use the verified domain by default and refuse unverified from-domains
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

  const fromName = process.env.RESEND_FROM_NAME || "Band of Bakers";
  // Default reply-to can be on a different domain; adjust if you prefer the verified domain
  const replyTo = process.env.RESEND_REPLY_TO_EMAIL || "support@bandofbakers.co.uk";

  // If no API key, mock the request so local runs never fail
  if (!apiKey) {
    console.log("[MOCK] RESEND_API_KEY not set. Would send:");
    console.log({
      from: `${fromName} <${fromEmail}>`,
      to: toEmail,
      subject,
      html,
    });
    return;
  }

  const resend = new Resend(apiKey);
  console.log(`Sending test email to ${toEmail}...`);

  const response = await resend.emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: toEmail,
    subject,
    html,
    replyTo: replyTo,
  });

  console.log("Response:", JSON.stringify(response, null, 2));
  if (response.error) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
