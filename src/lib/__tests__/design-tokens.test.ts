import { describe, it, expect } from "vitest";
import { combineTokens, DESIGN_TOKENS, SECTION_DIVIDERS } from "../design-tokens";

describe("design-tokens", () => {
  describe("combineTokens", () => {
    it("should combine valid strings", () => {
      expect(combineTokens("a", "b", "c")).toBe("a b c");
    });

    it("should filter out undefined and null values", () => {
      expect(combineTokens("a", undefined, "b", null, "c")).toBe("a b c");
    });

    it("should filter out empty strings", () => {
      expect(combineTokens("a", "", "b")).toBe("a b");
    });

    it("should return empty string if no valid tokens", () => {
      expect(combineTokens(undefined, null, "")).toBe("");
    });
  });

  describe("DESIGN_TOKENS", () => {
    it("should have typography tokens", () => {
      expect(DESIGN_TOKENS.typography).toBeDefined();
      expect(DESIGN_TOKENS.typography.h1).toBeDefined();
      expect(DESIGN_TOKENS.typography.body).toBeDefined();
    });

    it("should have spacing tokens", () => {
      expect(DESIGN_TOKENS.spacing).toBeDefined();
      expect(DESIGN_TOKENS.spacing.md).toBeDefined();
    });

    it("should have color tokens", () => {
      expect(DESIGN_TOKENS.colors).toBeDefined();
      expect(DESIGN_TOKENS.colors.text).toBeDefined();
    });
  });

  describe("SECTION_DIVIDERS", () => {
    it("should have divider definitions", () => {
      expect(SECTION_DIVIDERS.subtle).toBeDefined();
      expect(SECTION_DIVIDERS.medium).toBeDefined();
      expect(SECTION_DIVIDERS.strong).toBeDefined();
    });
  });
});
