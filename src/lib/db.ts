import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";

import type { D1Database, R2Bucket, KVNamespace } from "@cloudflare/workers-types";

interface CloudflareEnv {
  DB: D1Database;
  R2: R2Bucket;
  KV: KVNamespace;
}

import { cache } from "react";

export const getDb = cache(async () => {
  let env: CloudflareEnv | undefined;
  try {
    const context = await getCloudflareContext({ async: true });
    env = context.env as CloudflareEnv;
  } catch {
    // console.warn("[DB] Failed to get Cloudflare context (expected in local scripts/dev):", e);
  }

  if (env?.DB) {
    return drizzle(env.DB, { schema });
  }

  // Dev/Build fallback (do not import in Edge)
  // If env.DB is missing, we assume we are in a local environment (dev or build)
  if (process.env.NEXT_RUNTIME !== "edge") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globalForDb = globalThis as unknown as { __localDb?: any };
    if (globalForDb.__localDb) {
      return globalForDb.__localDb;
    }
    console.warn("[DB] Using dev fallback SQLite via db-local (not for Edge)");
    const { getLocalDb } = await import("./db-local");
    const db = await getLocalDb();
    globalForDb.__localDb = db;
    return db;
  }

  console.warn("[DB] env.DB is undefined or context failed.");

  // On edge, fail fast if no D1 binding is available
  if (
    process.env.NEXT_RUNTIME === "edge" ||
    typeof (globalThis as unknown as { EdgeRuntime?: unknown }).EdgeRuntime !== "undefined"
  ) {
    throw new Error("D1 binding (env.DB) is required on edge runtime");
  }

  throw new Error("Database binding not found");
});
