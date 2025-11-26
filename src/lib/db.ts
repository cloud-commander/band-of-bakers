import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type D1Database = any; // TODO: Import proper type from @cloudflare/workers-types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type R2Bucket = any; // TODO: Import proper type from @cloudflare/workers-types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KVNamespace = any; // TODO: Import proper type from @cloudflare/workers-types

interface CloudflareEnv {
  DB: D1Database;
  R2: R2Bucket;
  KV: KVNamespace;
}

export async function getDb() {
  const { env } = await getCloudflareContext();
  return drizzle((env as CloudflareEnv).DB, { schema });
}
