import Rollbar from "rollbar";

let rollbar: Rollbar | null = null;

export function initRollbar() {
  if (rollbar || !process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN) return null;
  rollbar = new Rollbar({
    accessToken: process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: process.env.NODE_ENV || "production",
      client: {
        javascript: {
          source_map_enabled: false,
        },
      },
    },
  });
  // Hydration error observer
  window.addEventListener("error", (event) => {
    if (event.message && event.message.toLowerCase().includes("hydration")) {
      rollbar?.error("Hydration error", {
        message: event.message,
        stack: event.error?.stack,
        href: window.location.href,
      });
    }
  });
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    if (reason?.message?.toLowerCase?.().includes("hydration")) {
      rollbar?.error("Hydration error (promise)", {
        message: reason?.message,
        stack: reason?.stack,
        href: window.location.href,
      });
    }
  });
  return rollbar;
}
