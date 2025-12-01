/**
 * Unified logging utility for server-side code
 * Automatically sends errors to Rollbar and Logflare on Edge runtime
 */

import { serverRollbar } from "./server-rollbar";
import { logger as logflareLogger } from "./server-logger";

export interface LogContext {
  [key: string]: unknown;
}

/**
 * Log an error with context
 * Sends to both Rollbar and Logflare in production
 */
export async function logError(
  message: string,
  error?: Error | unknown,
  context?: LogContext
): Promise<void> {
  // Always log to console for local debugging
  if (process.env.NODE_ENV === "development") {
    console.error(`[ERROR] ${message}`, error, context);
  }

  // Build metadata
  const metadata: LogContext = {
    ...context,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  };

  // Send to external services (don't await to avoid blocking)
  Promise.all([
    serverRollbar.error(error instanceof Error ? error : new Error(message), metadata).catch(() => {}),
    logflareLogger.error(message, metadata).catch(() => {}),
  ]).catch(() => {
    // Silently fail if logging fails
  });
}

/**
 * Log a warning with context
 */
export async function logWarn(message: string, context?: LogContext): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    console.warn(`[WARN] ${message}`, context);
  }

  const metadata: LogContext = {
    ...context,
    timestamp: new Date().toISOString(),
  };

  Promise.all([
    serverRollbar.warn(message, metadata).catch(() => {}),
    logflareLogger.warn(message, metadata).catch(() => {}),
  ]).catch(() => {});
}

/**
 * Log info for monitoring
 */
export async function logInfo(message: string, context?: LogContext): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    console.log(`[INFO] ${message}`, context);
  }

  const metadata: LogContext = {
    ...context,
    timestamp: new Date().toISOString(),
  };

  Promise.all([
    serverRollbar.info(message, metadata).catch(() => {}),
    logflareLogger.info(message, metadata).catch(() => {}),
  ]).catch(() => {});
}

// Export default logger object for convenience
export const logger = {
  error: logError,
  warn: logWarn,
  info: logInfo,
};
