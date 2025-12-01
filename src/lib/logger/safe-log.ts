// Minimal PII-scrubbing logger for server/edge contexts.
// Use this instead of console.log when handling user-supplied data.

type LogLevel = "info" | "warn" | "error" | "debug";

const SENSITIVE_KEYS = ["password", "token", "email", "phone", "card", "authorization"];

function scrubValue(val: unknown): unknown {
  if (val && typeof val === "object") {
    if (Array.isArray(val)) {
      return val.map(scrubValue);
    }
    const entries = Object.entries(val as Record<string, unknown>).map(([k, v]) => {
      const isSensitive = SENSITIVE_KEYS.some((key) => k.toLowerCase().includes(key));
      return [k, isSensitive ? "[redacted]" : scrubValue(v)];
    });
    return Object.fromEntries(entries);
  }
  return val;
}

export function safeLog(level: LogLevel, message: string, meta?: unknown) {
  const payload = meta ? scrubValue(meta) : undefined;
  if (payload) {
    console[level](message, payload);
  } else {
    console[level](message);
  }
}
