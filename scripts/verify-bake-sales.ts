import { getDb } from "../src/lib/db";
import { bakeSales } from "../src/db/schema";
import { desc } from "drizzle-orm";

async function main() {
  console.log("Verifying bake sales...");
  try {
    const db = await getDb();
    const sales = await db.select().from(bakeSales).orderBy(desc(bakeSales.date));

    console.log(`Found ${sales.length} bake sales.`);
    console.log("Dates:");
    sales.forEach((sale) => {
      console.log(`- ${sale.date} (${sale.id}) [Active: ${sale.is_active}]`);
    });

    // Check for future dates (assuming "now" is Nov 2025 based on context, but let's just check the values)
    const futureSales = sales.filter((s) => s.date > "2025-11-27");
    console.log(`\nFuture sales (> 2025-11-27): ${futureSales.length}`);
    futureSales.forEach((sale) => {
      console.log(`- ${sale.date}`);
    });
  } catch (error) {
    console.error("Error verifying bake sales:", error);
  }
}

main();
