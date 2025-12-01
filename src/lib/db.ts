import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";

import type { D1Database, R2Bucket, KVNamespace } from "@cloudflare/workers-types";

interface CloudflareEnv {
  DB: D1Database;
  R2: R2Bucket;
  KV: KVNamespace;
}

export async function getDb() {
  console.log("[DB] Connecting to database...");

  let env: CloudflareEnv | undefined;
  try {
    const context = await getCloudflareContext({ async: true });
    env = context.env as CloudflareEnv;
  } catch (e) {
    console.warn("[DB] Failed to get Cloudflare context (expected in local scripts/dev):", e);
  }

  if (env?.DB) {
    console.log("[DB] env.DB found.");
    return drizzle(env.DB, { schema });
  }

  console.warn("[DB] env.DB is undefined or context failed.");

  // On edge, fail fast if no D1 binding is available
  if (
    process.env.NEXT_RUNTIME === "edge" ||
    typeof (globalThis as unknown as { EdgeRuntime?: unknown }).EdgeRuntime !== "undefined"
  ) {
    throw new Error("D1 binding (env.DB) is required on edge runtime");
  }

  // Fallback for local development (never used on edge)
  if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
    // Check global cache first
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globalForDb = globalThis as unknown as { __localDb: any };
    if (globalForDb.__localDb) {
      return globalForDb.__localDb;
    }

    console.log("[DB] Attempting local fallback...");
    try {
      const { getLocalDb } = await import("./db-local");
      const db = await getLocalDb();
      globalForDb.__localDb = db;
      return db;
    } catch (fallbackError) {
      console.error("[DB] Local fallback failed:", fallbackError);
    }
  }

  throw new Error("Database binding not found");
}
