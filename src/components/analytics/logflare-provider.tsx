"use client";

import { useEffect } from "react";

type LogMetadata = Record<string, string | number | boolean | null>;

interface LogflareLog {
  level: "debug" | "info" | "warn" | "error";
  message: string;
  metadata?: LogMetadata;
  timestamp?: Date;
}

class LogflareClient {
  private apiKey: string;
  private sourceId: string;
  private enabled: boolean;
  private isDebug: boolean;

  constructor(apiKey: string, sourceId: string, isDebug = false) {
    this.apiKey = apiKey;
    this.sourceId = sourceId;
    this.enabled = !!apiKey && !!sourceId;
    this.isDebug = isDebug;

    if (this.isDebug && this.enabled) {
      console.log("Logflare initialized for browser logging");
    }
  }

  async log(entry: LogflareLog): Promise<void> {
    if (!this.enabled) return;

    try {
      const payload = {
        source_id: this.sourceId,
        log_entry: {
          level: entry.level,
          message: entry.message,
          timestamp: entry.timestamp || new Date(),
          metadata: {
            ...entry.metadata,
            url: typeof window !== "undefined" ? window.location.href : "unknown",
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
          },
        },
      };

      await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      if (this.isDebug) {
        console.error("Failed to send log to Logflare:", error);
      }
    }
  }

  info(message: string, metadata?: LogMetadata) {
    this.log({ level: "info", message, metadata });
  }

  warn(message: string, metadata?: LogMetadata) {
    this.log({ level: "warn", message, metadata });
  }

  error(message: string, metadata?: LogMetadata) {
    this.log({ level: "error", message, metadata });
  }

  debugLog(message: string, metadata?: LogMetadata) {
    this.log({ level: "debug", message, metadata });
  }
}

export function LogflareProvider() {
  useEffect(() => {
    // Initialize Logflare
    const apiKey = process.env.NEXT_PUBLIC_LOGFLARE_API_KEY;
    const sourceId = process.env.NEXT_PUBLIC_LOGFLARE_SOURCE_ID;
    const isDebug = process.env.NEXT_PUBLIC_LOGFLARE_DEBUG === "true";

    if (typeof window !== "undefined" && apiKey && sourceId) {
      const logflare = new LogflareClient(apiKey, sourceId, isDebug);

      // Make Logflare globally available
      (window as unknown as { Logflare: LogflareClient }).Logflare = logflare;

      // Log page view
      logflare.info("Page viewed", {
        page: window.location.pathname,
        referrer: document.referrer,
      });

      // Capture unhandled errors
      const handleError = (event: ErrorEvent) => {
        logflare.error(event.message, {
          error: event.error?.stack || event.error?.toString(),
          filename: event.filename,
          lineno: String(event.lineno),
          colno: String(event.colno),
        });
      };

      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        logflare.error("Unhandled Promise Rejection", {
          reason: event.reason?.toString?.() || String(event.reason),
        });
      };

      window.addEventListener("error", handleError);
      window.addEventListener("unhandledrejection", handleUnhandledRejection);

      return () => {
        window.removeEventListener("error", handleError);
        window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      };
    }
  }, []);

  return null;
}
