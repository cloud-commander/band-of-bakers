import { describe, it, expect } from "vitest";
import {
  hashPassword,
  verifyPassword,
  generateSecureToken,
  sha256,
  generateUUID,
  encrypt,
  decrypt,
  generateEncryptionKey,
} from "./crypto";

describe("Crypto Utilities", () => {
  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const password = "SecurePassword123!";
      const result = await hashPassword(password);

      expect(result.hash).toBeDefined();
      expect(result.salt).toBeDefined();
      expect(typeof result.hash).toBe("string");
      expect(typeof result.salt).toBe("string");
    });

    it("should produce different hashes for same password with different salts", async () => {
      const password = "SecurePassword123!";
      const result1 = await hashPassword(password);
      const result2 = await hashPassword(password);

      expect(result1.hash).not.toBe(result2.hash);
      expect(result1.salt).not.toBe(result2.salt);
    });

    it("should produce same hash for same password and salt", async () => {
      const password = "SecurePassword123!";
      const result1 = await hashPassword(password);

      // Convert salt back to Uint8Array
      const saltBuffer = Uint8Array.from(atob(result1.salt), (c) => c.charCodeAt(0));
      const result2 = await hashPassword(password, saltBuffer);

      expect(result1.hash).toBe(result2.hash);
    });
  });

  describe("verifyPassword", () => {
    it("should verify correct password", async () => {
      const password = "SecurePassword123!";
      const { hash, salt } = await hashPassword(password);

      const isValid = await verifyPassword(password, hash, salt);
      expect(isValid).toBe(true);
    });

    it("should reject incorrect password", async () => {
      const password = "SecurePassword123!";
      const wrongPassword = "WrongPassword123!";
      const { hash, salt } = await hashPassword(password);

      const isValid = await verifyPassword(wrongPassword, hash, salt);
      expect(isValid).toBe(false);
    });
  });

  describe("generateSecureToken", () => {
    it("should generate a token", () => {
      const token = generateSecureToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    it("should generate unique tokens", () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();
      expect(token1).not.toBe(token2);
    });

    it("should generate URL-safe tokens", () => {
      const token = generateSecureToken();
      expect(token).not.toMatch(/[+/=]/);
    });
  });

  describe("sha256", () => {
    it("should hash data", async () => {
      const data = "test data";
      const hash = await sha256(data);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe("string");
      expect(hash.length).toBe(64); // SHA-256 produces 64 hex characters
    });

    it("should produce same hash for same data", async () => {
      const data = "test data";
      const hash1 = await sha256(data);
      const hash2 = await sha256(data);

      expect(hash1).toBe(hash2);
    });

    it("should produce different hashes for different data", async () => {
      const hash1 = await sha256("data1");
      const hash2 = await sha256("data2");

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("generateUUID", () => {
    it("should generate a valid UUID v4", () => {
      const uuid = generateUUID();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      expect(uuid).toMatch(uuidRegex);
    });

    it("should generate unique UUIDs", () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();

      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe("encrypt and decrypt", () => {
    it("should encrypt and decrypt data", async () => {
      const data = "Sensitive information";
      const key = generateEncryptionKey();

      const { encrypted, iv } = await encrypt(data, key);
      const decrypted = await decrypt(encrypted, iv, key);

      expect(decrypted).toBe(data);
    });

    it("should produce different ciphertext for same data", async () => {
      const data = "Sensitive information";
      const key = generateEncryptionKey();

      const result1 = await encrypt(data, key);
      const result2 = await encrypt(data, key);

      expect(result1.encrypted).not.toBe(result2.encrypted);
      expect(result1.iv).not.toBe(result2.iv);
    });

    it("should fail to decrypt with wrong key", async () => {
      const data = "Sensitive information";
      const key1 = generateEncryptionKey();
      const key2 = generateEncryptionKey();

      const { encrypted, iv } = await encrypt(data, key1);

      await expect(decrypt(encrypted, iv, key2)).rejects.toThrow();
    });
  });

  describe("generateEncryptionKey", () => {
    it("should generate a key", () => {
      const key = generateEncryptionKey();
      expect(key).toBeDefined();
      expect(typeof key).toBe("string");
    });

    it("should generate unique keys", () => {
      const key1 = generateEncryptionKey();
      const key2 = generateEncryptionKey();
      expect(key1).not.toBe(key2);
    });
  });
});
