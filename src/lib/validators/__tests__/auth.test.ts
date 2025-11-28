import { describe, it, expect } from "vitest";
import {
  loginSchema,
  signupSchema,
  oauthCallbackSchema,
} from "../auth";

describe("Auth Validators", () => {
  describe("loginSchema", () => {
    const validLogin = {
      email: "test@example.com",
      password: "SecurePass123",
    };

    it("should validate a correct login", () => {
      const result = loginSchema.safeParse(validLogin);
      expect(result.success).toBe(true);
    });

    it("should fail if email is empty", () => {
      const result = loginSchema.safeParse({
        ...validLogin,
        email: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Email is required");
      }
    });

    it("should fail if email is invalid format", () => {
      const result = loginSchema.safeParse({
        ...validLogin,
        email: "not-an-email",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("valid email");
      }
    });

    it("should fail if password is empty", () => {
      const result = loginSchema.safeParse({
        ...validLogin,
        password: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Password is required");
      }
    });

    it("should fail if password is too short", () => {
      const result = loginSchema.safeParse({
        ...validLogin,
        password: "short",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("at least 6 characters");
      }
    });

    it("should accept minimum length password (6 characters)", () => {
      const result = loginSchema.safeParse({
        ...validLogin,
        password: "Pass12",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("signupSchema", () => {
    const validSignup = {
      name: "Test User",
      email: "test@example.com",
      phone: "+44 7700900000",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
    };

    it("should validate a correct signup", () => {
      const result = signupSchema.safeParse(validSignup);
      expect(result.success).toBe(true);
    });

    it("should fail if name is empty", () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        name: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Full name is required");
      }
    });

    it("should fail if name is too short (less than 2 characters)", () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        name: "A",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("at least 2 characters");
      }
    });

    it("should fail if name is too long (over 100 characters)", () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        name: "A".repeat(101),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("too long");
      }
    });

    it("should fail if email is invalid", () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        email: "invalid-email",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("valid email");
      }
    });

    it("should accept valid UK phone numbers with +44 prefix", () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        phone: "+44 7700900000",
      });
      expect(result.success).toBe(true);
    });

    it("should accept valid UK phone numbers with 0 prefix", () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        phone: "07700900000",
      });
      expect(result.success).toBe(true);
    });

    it("should fail for invalid UK phone number format", () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        phone: "12345",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("valid UK phone number");
      }
    });

    it("should fail if password is empty", () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        password: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Password is required");
      }
    });

    it("should fail if password is too short", () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        password: "short",
        confirmPassword: "short",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("at least 6 characters");
      }
    });

    it("should fail if password is too long (over 100 characters)", () => {
      const longPassword = "A".repeat(101);
      const result = signupSchema.safeParse({
        ...validSignup,
        password: longPassword,
        confirmPassword: longPassword,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("too long");
      }
    });

    it("should fail if confirmPassword is empty", () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        confirmPassword: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("confirm your password");
      }
    });

    it("should fail if passwords don't match", () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        password: "Password123",
        confirmPassword: "DifferentPass456",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("don't match");
      }
    });

    it("should succeed when passwords match", () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        password: "MatchingPassword123",
        confirmPassword: "MatchingPassword123",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("oauthCallbackSchema", () => {
    const validCallback = {
      code: "auth_code_12345",
      state: "state_token_67890",
    };

    it("should validate a correct OAuth callback", () => {
      const result = oauthCallbackSchema.safeParse(validCallback);
      expect(result.success).toBe(true);
    });

    it("should fail if code is empty", () => {
      const result = oauthCallbackSchema.safeParse({
        ...validCallback,
        code: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Authorization code is required"
        );
      }
    });

    it("should fail if state is empty", () => {
      const result = oauthCallbackSchema.safeParse({
        ...validCallback,
        state: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "State parameter is required"
        );
      }
    });

    it("should fail if code is missing", () => {
      const result = oauthCallbackSchema.safeParse({
        state: "state_token_67890",
      });
      expect(result.success).toBe(false);
    });

    it("should fail if state is missing", () => {
      const result = oauthCallbackSchema.safeParse({
        code: "auth_code_12345",
      });
      expect(result.success).toBe(false);
    });
  });
});
