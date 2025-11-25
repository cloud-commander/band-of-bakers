"use client";

import { useEffect } from "react";

export function RollbarProvider() {
  useEffect(() => {
    // Initialize Rollbar
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_ROLLBAR_TOKEN) {
      // Dynamic import to avoid SSR issues
      import("rollbar").then((Rollbar) => {
        const rollbar = new Rollbar.default({
          accessToken: process.env.NEXT_PUBLIC_ROLLBAR_TOKEN,
          environment: process.env.NODE_ENV || "development",
          enabled: process.env.NEXT_PUBLIC_ROLLBAR_DISABLED !== "true",
          captureUncaught: true,
          captureUnhandledRejections: true,
          payload: {
            environment: process.env.NODE_ENV || "development",
            code_version: "1.0.0",
            client: {
              javascript: {
                source_map_enabled: true,
                guess_uncaught_frames: true,
              },
            },
          },
        });

        // Make Rollbar globally available
        (window as unknown as { Rollbar: typeof rollbar }).Rollbar = rollbar;

        // Log initialization
        if (process.env.NEXT_PUBLIC_ROLLBAR_DEBUG === "true") {
          console.log("Rollbar initialized for client-side error tracking");
        }
      });
    }
  }, []);

  return null;
}
