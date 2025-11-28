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

  // Fallback for local development
  if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
    // Check global cache first
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globalForDb = globalThis as unknown as { __localDb: any };
    if (globalForDb.__localDb) {
      // console.log("[DB] Reusing cached local connection");
      return globalForDb.__localDb;
    }

    console.log("[DB] Attempting local fallback...");
    try {
      const { drizzle: drizzleProxy } = await import("drizzle-orm/sqlite-proxy");
      const Database = (await import("better-sqlite3")).default;
      const path = (await import("path")).default;

      // Try local.db first (for local development)
      const localDbPath = path.join(process.cwd(), "local.db");
      console.log(`[DB] Connecting to local SQLite: ${localDbPath}`);
      const sqlite = new Database(localDbPath);

      // Use sqlite-proxy to mimic async D1 behavior
      const db = drizzleProxy(
        async (sql, params, method) => {
          // Debug query shape to help troubleshoot local SQLite issues
          if (process.env.DEBUG_SQLITE_PROXY === "1") {
            console.log(`[DB][sqlite-proxy] ${method?.toUpperCase?.() ?? method}: ${sql}`);
            if (params?.length) {
              console.log("[DB][sqlite-proxy] params:", params);
            }
          }
          try {
            const stmt = sqlite.prepare(sql);
            if (method === "run") {
              const result = stmt.run(params);
              // D1-like result shape
              return {
                rows: [],
                success: true,
                meta: {
                  changed_db: false,
                  changes: result.changes,
                  duration: 0,
                  last_row_id: Number(result.lastInsertRowid),
                  rows_read: 0,
                  rows_written: result.changes,
                  size_after: 0,
                },
              };
            }

            if (method === "get") {
              const row = stmt.raw().get(params);
              const rowLog =
                row === undefined ? "undefined" : JSON.stringify(row).slice(0, 200);
              console.log("[DB] Proxy result (raw):", rowLog);
              return { rows: row ? [row] : [] };
            }

            if (method === "values") {
              const rows = stmt.raw().all(params);
              console.log("[DB] Proxy result (raw):", JSON.stringify(rows).slice(0, 200));
              return { rows };
            }

            // Default: return raw arrays to mirror D1 driver format
            const rows = stmt.raw().all(params);
            console.log("[DB] Proxy result (raw):", JSON.stringify(rows).slice(0, 200));
            return { rows };
          } catch (e) {
            console.error("SQL Error:", e);
            throw e;
          }
        },
        { schema }
      );

      // Cache the connection
      globalForDb.__localDb = db;
      return db;
    } catch (fallbackError) {
      console.error("[DB] Local fallback failed:", fallbackError);
    }
  }

  throw new Error("Database binding not found");
}
