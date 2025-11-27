import { getDb } from "../src/lib/db";
import { images } from "../src/db/schema";
import { desc } from "drizzle-orm";

async function testDb() {
  console.log("Testing DB connection...");
  try {
    const db = await getDb();
    console.log("DB instance obtained.");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (db as any)
      .select()
      .from(images)
      .orderBy(desc(images.created_at))
      .limit(1);
    console.log("Query result:", result);
    console.log("DB connection successful!");
  } catch (error) {
    console.error("DB connection failed:", error);
  }
}

testDb();
