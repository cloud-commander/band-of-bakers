// Local-only SQLite fallback for development environments.
// This file should never be imported on Edge/Cloudflare.
import { drizzle as drizzleProxy } from "drizzle-orm/sqlite-proxy";
import type { SqliteRemoteDatabase } from "drizzle-orm/sqlite-proxy";
import * as schema from "@/db/schema";

export async function getLocalDb(): Promise<SqliteRemoteDatabase<typeof schema>> {
  const Database = (await import("better-sqlite3")).default;
  const path = (await import("path")).default;

  const localDbPath = path.join(process.cwd(), "local.db");
  const sqlite = new Database(localDbPath);

  const db = drizzleProxy(
    async (sql, params, method) => {
      if (process.env.DEBUG_SQLITE_PROXY === "1") {
        console.log(`[DB][sqlite-proxy] ${method?.toUpperCase?.() ?? method}: ${sql}`);
        if (params?.length) {
          console.log("[DB][sqlite-proxy] params:", params);
        }
      }
      const stmt = sqlite.prepare(sql);
      if (method === "run") {
        const result = stmt.run(params);
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
        return { rows: row ? [row] : [] };
      }

      if (method === "values") {
        const rows = stmt.raw().all(params);
        return { rows };
      }

      const rows = stmt.raw().all(params);
      return { rows };
    },
    { schema }
  );

  return db;
}
