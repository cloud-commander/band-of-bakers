import { describe, it, expect } from "vitest";
import { insertUserSchema, updateUserSchema } from "../user";

describe("User Validators", () => {
  describe("insertUserSchema", () => {
    const validUser = {
      email: "test@example.com",
      name: "Test User",
      password_hash: "hashed_password_123",
    };

    it("should validate a correct user", () => {
      const result = insertUserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it("should fail if email is invalid", () => {
      const result = insertUserSchema.safeParse({
        ...validUser,
        email: "not-an-email",
      });
      expect(result.success).toBe(false);
    });

    it("should fail if name is empty", () => {
      const result = insertUserSchema.safeParse({
        ...validUser,
        name: "",
      });
      expect(result.success).toBe(false);
    });

    it("should fail if password is too short", () => {
      const result = insertUserSchema.safeParse({
        ...validUser,
        password_hash: "short",
      });
      expect(result.success).toBe(false);
    });

    it("should normalize email to lowercase", () => {
      const result = insertUserSchema.safeParse({
        ...validUser,
        email: "TEST@EXAMPLE.COM",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("test@example.com");
      }
    });
  });

  describe("updateUserSchema", () => {
    it("should allow partial updates", () => {
      const result = updateUserSchema.safeParse({
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "Updated Name",
      });
      expect(result.success).toBe(true);
    });

    it("should require a valid UUID for id", () => {
      const result = updateUserSchema.safeParse({
        id: "invalid-id",
        name: "Updated Name",
      });
      expect(result.success).toBe(false);
    });
  });
});
