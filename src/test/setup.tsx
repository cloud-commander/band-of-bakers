import "@testing-library/jest-dom";
import { vi } from "vitest";
import type { ComponentProps } from "react";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => "/",
}));

// Mock Next.js image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: ComponentProps<"img">) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt || ""} {...props} />;
  },
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
