import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getDb } from "../db";

// Mock dependencies
vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: vi.fn(),
}));

vi.mock("drizzle-orm/d1", () => ({
  drizzle: vi.fn(() => "d1-db-instance"),
}));

vi.mock("drizzle-orm/sqlite-proxy", () => ({
  drizzle: vi.fn(() => "sqlite-proxy-db-instance"),
}));

vi.mock("better-sqlite3", () => {
  const MockDatabase = vi.fn(function () {
    return {
      prepare: vi.fn(() => ({
        run: vi.fn(() => ({ changes: 1, lastInsertRowid: 1 })),
        raw: vi.fn(() => ({
          get: vi.fn(),
          all: vi.fn(() => []),
        })),
      })),
    };
  });
  return {
    default: MockDatabase,
  };
});

vi.mock("path", () => ({
  default: {
    join: vi.fn((...args) => args.join("/")),
  },
}));

// Mock drizzle-orm/sqlite-proxy to capture the callback
let proxyCallback: any;
vi.mock("drizzle-orm/sqlite-proxy", () => ({
  drizzle: vi.fn((callback) => {
    proxyCallback = callback;
    return {
      select: vi.fn(() => ({ from: vi.fn() })),
      run: vi.fn(),
    };
  }),
}));

describe("getDb", () => {
  const originalEnv = process.env;
  const originalGlobal = globalThis as any;

  beforeEach(() => {
    process.env = { ...originalEnv };
    originalGlobal.__localDb = undefined;
    proxyCallback = undefined;
    vi.clearAllMocks();
  });

  // ... existing tests ...

  it("should execute proxy callback logic", async () => {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    (getCloudflareContext as any).mockRejectedValue(new Error("No context"));
    process.env.NODE_ENV = "development";
    delete process.env.NEXT_RUNTIME;

    await getDb();

    expect(proxyCallback).toBeDefined();

    // Test 'run' method
    const runResult = await proxyCallback("INSERT INTO users...", [], "run");
    expect(runResult.success).toBe(true);
    expect(runResult.meta.changes).toBe(1);

    // Test 'get' method
    const getResult = await proxyCallback("SELECT * FROM users...", [], "get");
    expect(getResult.rows).toBeDefined();

    // Test 'values' method
    const valuesResult = await proxyCallback("SELECT * FROM users...", [], "values");
    expect(valuesResult.rows).toBeDefined();

    // Test default method (all)
    const allResult = await proxyCallback("SELECT * FROM users...", [], "all");
    expect(allResult.rows).toBeDefined();
  });
  afterEach(() => {
    process.env = originalEnv;
  });

  it("should return D1 database if env.DB is present", async () => {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    (getCloudflareContext as any).mockResolvedValue({
      env: { DB: "mock-d1-binding" },
    });

    const db = await getDb();
    expect(db).toBe("d1-db-instance");
  });

  it("should throw error on edge runtime if env.DB is missing", async () => {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    (getCloudflareContext as any).mockRejectedValue(new Error("No context"));
    process.env.NEXT_RUNTIME = "edge";

    await expect(getDb()).rejects.toThrow("D1 binding (env.DB) is required on edge runtime");
  });

  it("should use local fallback in development if env.DB is missing", async () => {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    (getCloudflareContext as any).mockRejectedValue(new Error("No context"));
    process.env.NODE_ENV = "development";
    delete process.env.NEXT_RUNTIME;

    const db = await getDb();
    expect(db).toHaveProperty("select");
    expect(db).toHaveProperty("run");
  });

  it("should reuse cached local connection", async () => {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    (getCloudflareContext as any).mockRejectedValue(new Error("No context"));
    process.env.NODE_ENV = "development";
    delete process.env.NEXT_RUNTIME;

    // First call creates connection
    const db1 = await getDb();
    expect(db1).toHaveProperty("select");

    // Second call should reuse it
    const db2 = await getDb();
    expect(db2).toBe(db1);

    // Verify we didn't create a new proxy (mock implementation details would be needed to verify strictly,
    // but we can check if the global cache was set)
    expect(originalGlobal.__localDb).toBeDefined();
  });

  it("should throw error if neither D1 nor local fallback works", async () => {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    (getCloudflareContext as any).mockRejectedValue(new Error("No context"));
    process.env.NODE_ENV = "production"; // Not development
    delete process.env.NEXT_RUNTIME; // Not edge

    await expect(getDb()).rejects.toThrow("Database binding not found");
  });
});
