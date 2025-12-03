// Server-side Rollbar logger for Next.js API routes and server actions
// IMPORTANT: Lazy-loaded to prevent bundling in Cloudflare Workers
import type Rollbar from "rollbar";

let rollbarInstance: Rollbar | null = null;

async function initializeRollbar(): Promise<Rollbar> {
  if (rollbarInstance) {
    return rollbarInstance;
  }

  const token = process.env.ROLLBAR_SERVER_TOKEN;
  const isDisabled = process.env.NEXT_PUBLIC_ROLLBAR_DISABLED === "true";

  // Skip Rollbar in Edge runtime (Cloudflare Workers)
  const isEdge = process.env.NEXT_RUNTIME === "edge" ||
    typeof (globalThis as unknown as { EdgeRuntime?: unknown }).EdgeRuntime !== "undefined";

  if (!token || isDisabled || isEdge) {
    // Return a no-op logger if Rollbar is not configured, disabled, or on Edge
    return createNoOpRollbar();
  }

  // Lazy load Rollbar only when needed and only in Node.js runtime
  try {
    const RollbarModule = await import("rollbar");
    const RollbarClass = RollbarModule.default;

    rollbarInstance = new RollbarClass({
      accessToken: token,
      environment: process.env.NODE_ENV || "development",
      captureUncaught: true,
      captureUnhandledRejections: true,
      payload: {
        environment: process.env.NODE_ENV || "development",
        code_version: "1.0.0",
        server: {
          host: process.env.VERCEL_URL || "localhost",
          branch: process.env.VERCEL_GIT_COMMIT_REF || "main",
          code_version: process.env.VERCEL_GIT_COMMIT_SHA || "unknown",
        },
      },
    });

    return rollbarInstance;
  } catch {
    // If Rollbar fails to load (e.g., in Edge runtime), return no-op
    return createNoOpRollbar();
  }
}

function createNoOpRollbar(): Rollbar {
  return {
    log: () => Promise.resolve({}),
    debug: () => Promise.resolve({}),
    info: () => Promise.resolve({}),
    warning: () => Promise.resolve({}),
    error: () => Promise.resolve({}),
    critical: () => Promise.resolve({}),
  } as unknown as Rollbar;
}

export async function getRollbar(): Promise<Rollbar> {
  return await initializeRollbar();
}

export async function reportError(
  error: Error | string,
  level: "warning" | "error" | "critical" = "error",
  extra?: Record<string, unknown>
): Promise<void> {
  const rollbar = await initializeRollbar();

  try {
    if (typeof error === "string") {
      await rollbar.log(level, error, extra);
    } else {
      await rollbar.error(error, extra);
    }
  } catch (err) {
    // Fail silently if Rollbar reporting fails
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to report error to Rollbar:", err);
    }
  }
}

export const serverRollbar = {
  info: async (message: string, extra?: Record<string, unknown>) => {
    const rollbar = await getRollbar();
    await rollbar.info(message, extra);
  },
  warn: async (message: string, extra?: Record<string, unknown>) => {
    const rollbar = await getRollbar();
    await rollbar.warning(message, extra);
  },
  error: (error: Error | string, extra?: Record<string, unknown>) =>
    reportError(error, "error", extra),
  critical: (error: Error | string, extra?: Record<string, unknown>) =>
    reportError(error, "critical", extra),
};
