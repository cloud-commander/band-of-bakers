import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("utils", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("c1", "c2")).toBe("c1 c2");
    });

    it("should handle conditional classes", () => {
      expect(cn("c1", true && "c2", false && "c3")).toBe("c1 c2");
    });

    it("should merge tailwind classes using tailwind-merge", () => {
      expect(cn("px-2 py-1", "p-4")).toBe("p-4");
    });
  });
});
