import { config } from "dotenv";
import path from "path";
import fs from "fs";

// Load .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  config({ path: envPath });
} else {
  console.error("❌ .env.local file not found!");
  process.exit(1);
}

const apiKey = process.env.GCP_IDENTITY_PLATFORM_API_KEY;
const tenantId = process.env.GCP_IDENTITY_PLATFORM_TENANT_ID;

console.log("--- Debugging Auth Configuration ---");
console.log(`API Key present: ${!!apiKey} ${apiKey ? `(${apiKey.substring(0, 5)}...)` : ""}`);
console.log(`Tenant ID present: ${!!tenantId} ${tenantId ? `(${tenantId})` : ""}`);

if (!apiKey || !tenantId) {
  console.error("❌ Missing required environment variables.");
  process.exit(1);
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("\nUsage: npx tsx scripts/debug-auth.ts <email> <password>");
  process.exit(1);
}

async function testLogin() {
  console.log(`\nAttempting login for: ${email}`);

  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        tenantId,
        returnSecureToken: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("\n❌ Login Failed!");
      console.error("Status:", response.status);
      console.error("Error Code:", data.error?.code);
      console.error("Error Message:", data.error?.message);
      console.error("Full Error:", JSON.stringify(data, null, 2));
    } else {
      console.log("\n✅ Login Successful!");
      console.log("User ID:", data.localId);
      console.log("ID Token received (length):", data.idToken?.length);
    }
  } catch (error) {
    console.error("\n❌ Network/Script Error:", error);
  }
}

testLogin();
