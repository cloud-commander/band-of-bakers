import fs from "fs";
import { execSync } from "child_process";

const DB_NAME = "bandofbakers-db";
const BATCH_FILE = "temp_seed/seed_phase3b_batch0.sql";

async function main() {
  const sqlContent = fs.readFileSync(BATCH_FILE, "utf-8");
  // Remove PRAGMA statements
  const cleanSql = sqlContent.replace(/PRAGMA.*;/g, "").trim();

  // Split into individual INSERT statements
  // Assuming each statement is on a new line or separated by ;
  const statements = cleanSql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Found ${statements.length} statements. Testing one by one...`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    const tempFile = `temp_seed/debug_order_${i}.sql`;
    fs.writeFileSync(tempFile, statement + ";");

    try {
      execSync(`npx wrangler d1 execute ${DB_NAME} --local --file=${tempFile}`, {
        stdio: "pipe",
        encoding: "utf-8",
      });
      console.log(`✅ Order ${i + 1} success`);
    } catch {
      console.error(`❌ Order ${i + 1} failed!`);
      console.error(`Statement: ${statement}`);

      // Extract IDs to debug
      const match = statement.match(/VALUES \('([^']+)', '([^']+)', '([^']+)'/);
      if (match) {
        const [, orderId, userId, bakeSaleId] = match;
        console.log(`Debug info: Order=${orderId}, User=${userId}, BakeSale=${bakeSaleId}`);

        // Check User
        try {
          const userCheck = execSync(
            `npx wrangler d1 execute ${DB_NAME} --local --command "SELECT id FROM users WHERE id = '${userId}'"`,
            { encoding: "utf-8" }
          );
          console.log(`User check: ${userCheck.includes(userId) ? "EXISTS" : "MISSING"}`);
        } catch {
          console.log("User check failed");
        }

        // Check Bake Sale
        try {
          const bsCheck = execSync(
            `npx wrangler d1 execute ${DB_NAME} --local --command "SELECT id FROM bake_sales WHERE id = '${bakeSaleId}'"`,
            { encoding: "utf-8" }
          );
          console.log(`BakeSale check: ${bsCheck.includes(bakeSaleId) ? "EXISTS" : "MISSING"}`);
        } catch {
          console.log("BakeSale check failed");
        }
      }

      process.exit(1);
    }
  }
}

main();
