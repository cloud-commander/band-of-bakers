import { describe, it, expect } from "vitest";
import { getFieldErrors, getFirstError, isValidationSuccess } from "../validation";
import { z } from "zod";

describe("Validation Utils", () => {
  const schema = z.object({
    name: z.string().min(2),
    age: z.number().min(18),
  });

  describe("getFieldErrors", () => {
    it("returns empty object for success", () => {
      const result = schema.safeParse({ name: "John", age: 25 });
      expect(getFieldErrors(result)).toEqual({});
    });

    it("returns field errors for failure", () => {
      const result = schema.safeParse({ name: "J", age: 10 });
      const errors = getFieldErrors(result);
      expect(errors).toHaveProperty("name");
      expect(errors).toHaveProperty("age");
    });
  });

  describe("getFirstError", () => {
    it("returns first error message", () => {
      const errors = {
        name: ["Name too short", "Name invalid"],
      };
      expect(getFirstError(errors, "name")).toBe("Name too short");
    });

    it("returns undefined if no error", () => {
      const errors = {};
      expect(getFirstError(errors, "name")).toBeUndefined();
    });
  });

  describe("isValidationSuccess", () => {
    it("returns true for success result", () => {
      const result = schema.safeParse({ name: "John", age: 25 });
      expect(isValidationSuccess(result)).toBe(true);
    });

    it("returns false for error result", () => {
      const result = schema.safeParse({ name: "J", age: 10 });
      expect(isValidationSuccess(result)).toBe(false);
    });
  });
});
