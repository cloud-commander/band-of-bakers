import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getDb() {
  const { env } = await getCloudflareContext();
  return drizzle((env as any).DB, { schema });
}
