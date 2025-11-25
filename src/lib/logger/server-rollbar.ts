// Server-side Rollbar logger for Next.js API routes and server actions
import Rollbar from "rollbar";

let rollbarInstance: Rollbar | null = null;

function initializeRollbar(): Rollbar {
  if (rollbarInstance) {
    return rollbarInstance;
  }

  const token = process.env.ROLLBAR_SERVER_TOKEN;
  const isDisabled = process.env.NEXT_PUBLIC_ROLLBAR_DISABLED === "true";

  if (!token || isDisabled) {
    // Return a no-op logger if Rollbar is not configured or disabled
    return createNoOpRollbar();
  }

  rollbarInstance = new Rollbar({
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

export function getRollbar(): Rollbar {
  return initializeRollbar();
}

export async function reportError(
  error: Error | string,
  level: "warning" | "error" | "critical" = "error",
  extra?: Record<string, unknown>
): Promise<void> {
  const rollbar = initializeRollbar();

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
  info: (message: string, extra?: Record<string, unknown>) => getRollbar().info(message, extra),
  warn: (message: string, extra?: Record<string, unknown>) => getRollbar().warning(message, extra),
  error: (error: Error | string, extra?: Record<string, unknown>) =>
    reportError(error, "error", extra),
  critical: (error: Error | string, extra?: Record<string, unknown>) =>
    reportError(error, "critical", extra),
};
