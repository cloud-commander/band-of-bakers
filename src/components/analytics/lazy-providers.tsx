"use client";

/**
 * Lazy-loaded Analytics Providers
 *
 * This file provides dynamically imported analytics components to reduce
 * initial bundle size. Heavy analytics libraries are loaded only when needed.
 */

import dynamic from "next/dynamic";

/**
 * Rollbar Provider - Error tracking
 * Dynamically loaded to reduce main bundle size (~100KB)
 */
export const LazyRollbarProvider = dynamic(
  () => import("./rollbar-provider").then((mod) => ({ default: mod.RollbarProvider })),
  {
    ssr: false, // Client-only
    loading: () => null, // No loading UI needed
  }
);

/**
 * Logflare Provider - Client-side logging
 * Dynamically loaded to reduce main bundle size
 */
export const LazyLogflareProvider = dynamic(
  () => import("./logflare-provider").then((mod) => ({ default: mod.LogflareProvider })),
  {
    ssr: false, // Client-only
    loading: () => null,
  }
);

/**
 * Web Vitals Provider - Performance monitoring
 * Dynamically loaded with slight delay to prioritize critical resources
 */
export const LazyWebVitalsProvider = dynamic(
  () => import("./web-vitals-provider").then((mod) => ({ default: mod.WebVitalsProvider })),
  {
    ssr: false, // Client-only
    loading: () => null,
  }
);
