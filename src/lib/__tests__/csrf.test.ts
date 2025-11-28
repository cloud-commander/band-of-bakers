import { describe, it, expect, vi, beforeEach } from "vitest";
import { validateCsrf, requireCsrf, CsrfError } from "../csrf";
import { headers } from "next/headers";

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

describe("CSRF Protection", () => {
  const mockHeaders = vi.mocked(headers);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  describe("validateCsrf", () => {
    it("should return true for valid origin in production", async () => {
      mockHeaders.mockResolvedValue(
        new Headers([
          ["origin", "https://bandofbakers.co.uk"],
          ["host", "bandofbakers.co.uk"],
        ])
      );

      const result = await validateCsrf();
      expect(result).toBe(true);
    });

    it("should return true for valid referer in production", async () => {
      mockHeaders.mockResolvedValue(
        new Headers([
          ["referer", "https://bandofbakers.co.uk/admin"],
          ["host", "bandofbakers.co.uk"],
        ])
      );

      const result = await validateCsrf();
      expect(result).toBe(true);
    });

    it("should return true for localhost in development", async () => {
      vi.stubEnv("NODE_ENV", "development");
      mockHeaders.mockResolvedValue({
        get: (name: string) => {
          if (name === "origin") return "http://localhost:3000";
          if (name === "host") return "localhost:3000";
          return null;
        },
      } as Headers);

      const result = await validateCsrf();
      expect(result).toBe(true);
    });

    it("should return true for 127.0.0.1 in development", async () => {
      vi.stubEnv("NODE_ENV", "development");
      mockHeaders.mockResolvedValue(
        new Headers([
          ["origin", "http://127.0.0.1:3000"],
          ["host", "127.0.0.1:3000"],
        ])
      );

      const result = await validateCsrf();
      expect(result).toBe(true);
    });

    it("should return false for mismatched origin", async () => {
      mockHeaders.mockResolvedValue({
        get: (name: string) => {
          if (name === "origin") return "https://evil.com";
          if (name === "host") return "bandofbakers.co.uk";
          return null;
        },
      } as Headers);

      const result = await validateCsrf();
      expect(result).toBe(false);
    });

    it("should return false for mismatched referer", async () => {
      mockHeaders.mockResolvedValue({
        get: (name: string) => {
          if (name === "referer") return "https://evil.com/attack";
          if (name === "host") return "bandofbakers.co.uk";
          return null;
        },
      } as Headers);

      const result = await validateCsrf();
      expect(result).toBe(false);
    });

    it("should return false when origin and referer are missing", async () => {
      mockHeaders.mockResolvedValue({
        get: (name: string) => {
          if (name === "host") return "bandofbakers.co.uk";
          return null;
        },
      } as Headers);

      const result = await validateCsrf();
      expect(result).toBe(false);
    });

    it("should handle origin with path", async () => {
      mockHeaders.mockResolvedValue(
        new Headers([
          ["origin", "https://bandofbakers.co.uk"],
          ["host", "bandofbakers.co.uk"],
        ])
      );

      const result = await validateCsrf();
      expect(result).toBe(true);
    });

    it("should reject subdomain attacks", async () => {
      mockHeaders.mockResolvedValue({
        get: (name: string) => {
          if (name === "origin") return "https://evil.bandofbakers.co.uk";
          if (name === "host") return "bandofbakers.co.uk";
          return null;
        },
      } as Headers);

      const result = await validateCsrf();
      expect(result).toBe(false);
    });

    it("should allow Cloudflare preview URLs in development", async () => {
      vi.stubEnv("NODE_ENV", "development");
      mockHeaders.mockResolvedValue(
        new Headers([
          ["origin", "http://localhost:8788"],
          ["host", "localhost:8788"],
        ])
      );

      const result = await validateCsrf();
      expect(result).toBe(true);
    });
  });

  describe("requireCsrf", () => {
    it("should not throw for valid CSRF token", async () => {
      mockHeaders.mockResolvedValue(
        new Headers([
          ["origin", "https://bandofbakers.co.uk"],
          ["host", "bandofbakers.co.uk"],
        ])
      );

      await expect(requireCsrf()).resolves.not.toThrow();
    });

    it("should throw CsrfError for invalid CSRF token", async () => {
      mockHeaders.mockResolvedValue({
        get: (name: string) => {
          if (name === "origin") return "https://evil.com";
          if (name === "host") return "bandofbakers.co.uk";
          return null;
        },
      } as Headers);

      await expect(requireCsrf()).rejects.toThrow(CsrfError);
    });

    it("should throw with descriptive error message", async () => {
      mockHeaders.mockResolvedValue({
        get: (name: string) => {
          if (name === "origin") return "https://evil.com";
          if (name === "host") return "bandofbakers.co.uk";
          return null;
        },
      } as Headers);

      try {
        await requireCsrf();
        expect.fail("Should have thrown CsrfError");
      } catch (error) {
        expect(error).toBeInstanceOf(CsrfError);
        expect((error as CsrfError).message).toContain("CSRF");
      }
    });
  });

  describe("CsrfError", () => {
    it("should be instanceof Error", () => {
      const error = new CsrfError("Test error");
      expect(error).toBeInstanceOf(Error);
    });

    it("should have correct name", () => {
      const error = new CsrfError("Test error");
      expect(error.name).toBe("CsrfError");
    });

    it("should preserve error message", () => {
      const message = "CSRF validation failed";
      const error = new CsrfError(message);
      expect(error.message).toBe(message);
    });
  });
});
