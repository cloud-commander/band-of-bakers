import { describe, it, expect } from "vitest";
import { formatOrderReference } from "../order";

describe("formatOrderReference", () => {
  it("formats with order number if present", () => {
    expect(formatOrderReference("some-id", 123)).toBe("ORDR-00123");
    expect(formatOrderReference("some-id", 5)).toBe("ORDR-00005");
  });

  it("formats with ID if order number is missing", () => {
    expect(formatOrderReference("ord_abc123")).toBe("ORDR-ABC123");
  });

  it("handles IDs without prefix", () => {
    expect(formatOrderReference("abc123xyz")).toBe("ORDR-ABC123");
  });

  it("handles short IDs", () => {
    expect(formatOrderReference("abc")).toBe("ORDR-ABC");
  });

  it("fallbacks to ORDER if ID is empty or invalid", () => {
    expect(formatOrderReference("")).toBe("ORDR-ORDER");
    expect(formatOrderReference("---")).toBe("ORDR-ORDER");
  });
});
