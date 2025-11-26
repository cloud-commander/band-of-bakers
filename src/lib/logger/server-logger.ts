// Server-side Logflare logger for Next.js API routes and server actions
interface LogEntry {
  level: "debug" | "info" | "warn" | "error";
  message: string;
  metadata?: Record<string, unknown>;
  timestamp?: Date;
}

export interface LogContext {
  requestId?: string;
  userId?: string;
  action?: string;
  duration?: number;
  [key: string]: unknown;
}

async function sendToLogflare(entry: LogEntry): Promise<void> {
  const apiKey = process.env.BANDOFBAKERS_LOGFLARE_API_KEY;
  const sourceId = process.env.BANDOFBAKERS_LOGFLARE_SOURCE_ID;

  if (!apiKey || !sourceId) {
    // Silently fail if credentials not configured
    return;
  }

  try {
    const payload = {
      source_id: sourceId,
      log_entry: {
        level: entry.level,
        message: entry.message,
        timestamp: entry.timestamp || new Date(),
        metadata: {
          ...entry.metadata,
          environment: process.env.NODE_ENV || "development",
        },
      },
    };

    await fetch("https://api.logflare.app/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify(payload),
      // Short timeout for non-critical logging
      signal: AbortSignal.timeout(5000),
    });
  } catch (error) {
    // Log to console if Logflare fails, but don't throw
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to send log to Logflare:", error);
    }
  }
}

export async function logInfo(message: string, metadata?: Record<string, unknown>): Promise<void> {
  await sendToLogflare({ level: "info", message, metadata });
}

export async function logWarn(message: string, metadata?: Record<string, unknown>): Promise<void> {
  await sendToLogflare({ level: "warn", message, metadata });
}

export async function logError(message: string, metadata?: Record<string, unknown>): Promise<void> {
  await sendToLogflare({ level: "error", message, metadata });
}

export async function logDebug(message: string, metadata?: Record<string, unknown>): Promise<void> {
  await sendToLogflare({ level: "debug", message, metadata });
}

// Export all at once for convenience
const serverLogger = {
  info: logInfo,
  warn: logWarn,
  error: logError,
  debug: logDebug,
};

export default serverLogger;
export { serverLogger as logger };
