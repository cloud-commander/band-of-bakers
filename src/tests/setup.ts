/**
 * Vitest Global Setup
 *
 * This file runs before all tests and configures the testing environment.
 */

import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Cleanup after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock environment variables for tests
vi.stubEnv("NODE_ENV", "test");
vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: vi.fn(),
}));

// Mock Next.js headers
vi.mock("next/headers", () => ({
  headers: () => ({
    get: vi.fn((key) => {
      if (key === "origin") return "http://localhost:3000";
      if (key === "referer") return "http://localhost:3000/some-page";
      return null;
    }),
  }),
  cookies: () => ({
    get: vi.fn(),
    getAll: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  }),
}));

// Mock Next.js cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: (fn: (...args: unknown[]) => unknown) => fn, // Return the function as is, bypassing cache logic
}));

// Mock better-sqlite3 to avoid "sqlite.pragma is not a function"
vi.mock("better-sqlite3", () => {
  const MockDatabase = function () {
    return {
      pragma: vi.fn(),
      prepare: vi.fn(() => ({
        get: vi.fn(),
        all: vi.fn(),
        run: vi.fn(),
        iterate: vi.fn(),
      })),
      exec: vi.fn(),
      transaction: (fn: (...args: unknown[]) => unknown) => fn,
    };
  };
  return {
    default: MockDatabase,
    Database: MockDatabase,
  };
});

// Extend Vitest's expect with custom matchers if needed
// expect.extend({ ... });

console.log("✅ Test environment initialized");
