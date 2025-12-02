import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { safeLog } from "../safe-log";
import { logger as serverLogger } from "../server-logger";
import { serverRollbar } from "../server-rollbar";
import { logger } from "../index";

// Mock Rollbar
const mockRollbarInstance = {
  info: vi.fn(),
  warning: vi.fn(),
  error: vi.fn(),
  critical: vi.fn(),
  log: vi.fn(),
  configure: vi.fn(),
};

vi.mock("rollbar", () => {
  return {
    default: class MockRollbar {
      constructor() {
        return mockRollbarInstance;
      }
    },
  };
});

// Mock fetch for Logflare
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Logger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.BANDOFBAKERS_LOGFLARE_API_KEY = "test-key";
    process.env.BANDOFBAKERS_LOGFLARE_SOURCE_ID = "test-source";
    process.env.ROLLBAR_SERVER_TOKEN = "test-token";
    process.env.NEXT_PUBLIC_ROLLBAR_DISABLED = "false";
  });

  afterEach(() => {
    delete process.env.BANDOFBAKERS_LOGFLARE_API_KEY;
    delete process.env.BANDOFBAKERS_LOGFLARE_SOURCE_ID;
    delete process.env.ROLLBAR_SERVER_TOKEN;
    delete process.env.NEXT_PUBLIC_ROLLBAR_DISABLED;
  });

  describe("safeLog", () => {
    it("should scrub sensitive data", () => {
      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
      safeLog("info", "test", { password: "secret", email: "test@example.com", public: "data" });

      expect(consoleSpy).toHaveBeenCalledWith("test", {
        password: "[redacted]",
        email: "[redacted]",
        public: "data",
      });
      consoleSpy.mockRestore();
    });

    it("should handle arrays", () => {
      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
      safeLog("info", "test", [{ password: "secret" }]);

      expect(consoleSpy).toHaveBeenCalledWith("test", [{ password: "[redacted]" }]);
      consoleSpy.mockRestore();
    });
  });

  describe("serverLogger (Logflare)", () => {
    it("should exist", () => {
      expect(serverLogger).toBeDefined();
    });

    it("should send logs to Logflare", async () => {
      mockFetch.mockResolvedValue({ ok: true });
      if (serverLogger) {
        await serverLogger.info("test message", { meta: "data" });
        expect(mockFetch).toHaveBeenCalledWith(
          "https://api.logflare.app/logs",
          expect.objectContaining({
            method: "POST",
            headers: expect.objectContaining({
              "X-API-KEY": "test-key",
            }),
            body: expect.stringContaining("test message"),
          })
        );
      }
    });

    it("should not log if credentials missing", async () => {
      delete process.env.BANDOFBAKERS_LOGFLARE_API_KEY;
      if (serverLogger) {
        await serverLogger.info("test");
        expect(mockFetch).not.toHaveBeenCalled();
      }
    });
  });

  describe("serverRollbar", () => {
    it("should send logs to Rollbar", async () => {
      await serverRollbar.info("test message");
      // Since serverRollbar creates a new instance internally if not cached,
      // and we mocked the constructor to return our mock instance,
      // we need to check if our mock instance methods were called.
      // However, the module might have already initialized the instance at import time
      // if env vars were present then.
      // Let's rely on the fact that we set env vars in beforeEach,
      // but imports happen before that.
      // We might need to reset modules or structure tests differently if singleton pattern interferes.
      // For now, let's just check if the mock methods are called.

      // Actually, server-rollbar.ts initializes `rollbarInstance` lazily in `initializeRollbar`.
      // So setting env vars in beforeEach should work if `rollbarInstance` is null.
      // But `rollbarInstance` is a module-level variable.
      // We might need to use `vi.resetModules()` if we want to test initialization logic fully.
      // For now, let's just check if the mock methods are called.

      // Wait for async operations if any (serverRollbar methods are async wrappers)
      expect(mockRollbarInstance.info).toHaveBeenCalledWith("test message", undefined);
    });
  });

  describe("Unified Logger", () => {
    it("should log to both services", async () => {
      mockFetch.mockResolvedValue({ ok: true });
      await logger.info("unified test");

      expect(mockRollbarInstance.info).toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalled();
    });

    it("should log to console in development", async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await logger.info("dev test");

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });
  });
});
