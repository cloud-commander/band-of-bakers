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
    const context = await getCloudflareContext();
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
      const fs = (await import("fs")).default;
      const path = (await import("path")).default;

      // Find the SQLite file
      const d1Dir = path.join(process.cwd(), ".wrangler/state/v3/d1/miniflare-D1DatabaseObject");
      if (fs.existsSync(d1Dir)) {
        const files = fs.readdirSync(d1Dir).filter((f) => f.endsWith(".sqlite"));
        // Sort by modification time to get the most recent one
        files.sort((a, b) => {
          const statA = fs.statSync(path.join(d1Dir, a));
          const statB = fs.statSync(path.join(d1Dir, b));
          return statB.mtime.getTime() - statA.mtime.getTime();
        });

        if (files.length > 0) {
          const dbPath = path.join(d1Dir, files[0]);
          console.log(`[DB] Connecting to local SQLite: ${dbPath}`);
          const sqlite = new Database(dbPath);

          // Use sqlite-proxy to mimic async D1 behavior
          const db = drizzleProxy(
            async (sql, params, method) => {
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
                } else {
                  // Force raw arrays for everything to see if Drizzle handles it
                  const rows = stmt.raw().all(params);
                  console.log("[DB] Proxy result (raw):", JSON.stringify(rows).slice(0, 200));
                  return { rows: rows };
                }
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
        }
      }
      console.error("[DB] Could not find local D1 SQLite file.");
    } catch (fallbackError) {
      console.error("[DB] Local fallback failed:", fallbackError);
    }
  }

  throw new Error("Database binding not found");
}
