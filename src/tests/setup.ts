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
process.env.NODE_ENV = "test";
process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";

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

// Extend Vitest's expect with custom matchers if needed
// expect.extend({ ... });

console.log("✅ Test environment initialized");
