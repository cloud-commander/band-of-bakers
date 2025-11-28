import { describe, it, expect, vi, beforeEach } from "vitest";
import { validateCsrf, requireCsrf, CsrfError } from "../csrf";
import { headers } from "next/headers";

type MockHeaders = {
  get: (name: string) => string | null;
};

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

describe("CSRF Protection", () => {
  const mockHeaders = vi.mocked(headers);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validateCsrf", () => {
    it("should return true for valid origin in production", () => {
      mockHeaders.mockResolvedValue({
        get: (name: string) => {
          if (name === "origin") return "https://bandofbakers.co.uk";
          if (name === "host") return "bandofbakers.co.uk";
          return null;
        },
      } as MockHeaders);

      const result = validateCsrf();
      expect(result).toBe(true);
    });

    it("should return true for valid referer in production", () => {
      mockHeaders.mockResolvedValue({
        get: (name: string) => {
          if (name === "referer") return "https://bandofbakers.co.uk/admin";
          if (name === "host") return "bandofbakers.co.uk";
          return null;
        },
      } as MockHeaders);

      const result = validateCsrf();
      expect(result).toBe(true);
    });

    it("should return true for localhost in development", () => {
      mockHeaders.mockResolvedValue({
        get: (name: string) => {
          if (name === "origin") return "http://localhost:3000";
          if (name === "host") return "localhost:3000";
          return null;
        },
      } as MockHeaders);

      const result = validateCsrf();
      expect(result).toBe(true);
    });

    it("should return true for 127.0.0.1 in development", () => {
      mockHeaders.mockResolvedValue({
        get: (name: string) => {
          if (name === "origin") return "http://127.0.0.1:3000";
          if (name === "host") return "127.0.0.1:3000";
          return null;
        },
      } as MockHeaders);

      const result = validateCsrf();
      expect(result).toBe(true);
    });

    it("should return false for mismatched origin", () => {
      mockHeaders.mockResolvedValue({
        get: (name: string) => {
          if (name === "origin") return "https://evil.com";
          if (name === "host") return "bandofbakers.co.uk";
          return null;
        },
      } as MockHeaders);

      const result = validateCsrf();
      expect(result).toBe(false);
    });

    it("should return false for mismatched referer", () => {
      mockHeaders.mockResolvedValue({
        get: (name: string) => {
          if (name === "referer") return "https://evil.com/attack";
          if (name === "host") return "bandofbakers.co.uk";
          return null;
        },
      } as MockHeaders);

      const result = validateCsrf();
      expect(result).toBe(false);
    });

    it("should return false when origin and referer are missing", () => {
      mockHeaders.mockResolvedValue({
        get: (name: string) => {
          if (name === "host") return "bandofbakers.co.uk";
          return null;
        },
      } as MockHeaders);

      const result = validateCsrf();
      expect(result).toBe(false);
    });

    it("should handle origin with path", () => {
      mockHeaders.mockResolvedValue({
        get: (name: string) => {
          if (name === "origin") return "https://bandofbakers.co.uk";
          if (name === "host") return "bandofbakers.co.uk";
          return null;
        },
      } as MockHeaders);

      const result = validateCsrf();
      expect(result).toBe(true);
    });

    it("should reject subdomain attacks", () => {
      mockHeaders.mockResolvedValue({
        get: (name: string) => {
          if (name === "origin") return "https://evil.bandofbakers.co.uk";
          if (name === "host") return "bandofbakers.co.uk";
          return null;
        },
      } as MockHeaders);

      const result = validateCsrf();
      expect(result).toBe(false);
    });

    it("should allow Cloudflare preview URLs in development", () => {
      mockHeaders.mockResolvedValue({
        get: (name: string) => {
          if (name === "origin") return "http://localhost:8788";
          if (name === "host") return "localhost:8788";
          return null;
        },
      } as MockHeaders);

      const result = validateCsrf();
      expect(result).toBe(true);
    });
  });

  describe("requireCsrf", () => {
    it("should not throw for valid CSRF token", async () => {
      mockHeaders.mockResolvedValue({
        get: (name: string) => {
          if (name === "origin") return "https://bandofbakers.co.uk";
          if (name === "host") return "bandofbakers.co.uk";
          return null;
        },
      } as MockHeaders);

      await expect(requireCsrf()).resolves.not.toThrow();
    });

    it("should throw CsrfError for invalid CSRF token", async () => {
      mockHeaders.mockResolvedValue({
        get: (name: string) => {
          if (name === "origin") return "https://evil.com";
          if (name === "host") return "bandofbakers.co.uk";
          return null;
        },
      } as MockHeaders);

      await expect(requireCsrf()).rejects.toThrow(CsrfError);
    });

    it("should throw with descriptive error message", async () => {
      mockHeaders.mockResolvedValue({
        get: (name: string) => {
          if (name === "origin") return "https://evil.com";
          if (name === "host") return "bandofbakers.co.uk";
          return null;
        },
      } as MockHeaders);

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
