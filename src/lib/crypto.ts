/**
 * Cryptographic utilities using Web Crypto API
 *
 * This module provides secure password hashing and verification using
 * the Web Crypto API, which is available in both browser and Node.js environments.
 *
 * IMPORTANT: This is for client-side password hashing before transmission.
 * Google Identity Platform handles server-side password storage securely.
 */

/**
 * Hash a password using PBKDF2 with Web Crypto API
 *
 * @param password - Plain text password to hash
 * @param salt - Optional salt (will generate if not provided)
 * @returns Object containing hash and salt as base64 strings
 */
export async function hashPassword(
  password: string,
  salt?: Uint8Array
): Promise<{ hash: string; salt: string }> {
  // Generate salt if not provided
  const saltBuffer = salt || crypto.getRandomValues(new Uint8Array(16));

  // Convert password to ArrayBuffer
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Import password as CryptoKey
  const keyMaterial = await crypto.subtle.importKey("raw", passwordBuffer, "PBKDF2", false, [
    "deriveBits",
  ]);

  // Derive key using PBKDF2
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer as BufferSource,
      iterations: 100000, // OWASP recommended minimum
      hash: "SHA-256",
    },
    keyMaterial,
    256 // 256 bits = 32 bytes
  );

  // Convert to base64 for storage/transmission
  const hashArray = new Uint8Array(hashBuffer);
  const hashBase64 = btoa(String.fromCharCode(...hashArray));
  const saltBase64 = btoa(String.fromCharCode(...saltBuffer));

  return {
    hash: hashBase64,
    salt: saltBase64,
  };
}

/**
 * Verify a password against a stored hash
 *
 * @param password - Plain text password to verify
 * @param storedHash - Base64 encoded hash to compare against
 * @param storedSalt - Base64 encoded salt used in original hash
 * @returns True if password matches, false otherwise
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
  storedSalt: string
): Promise<boolean> {
  // Convert stored salt from base64 to Uint8Array
  const saltBuffer = Uint8Array.from(atob(storedSalt), (c) => c.charCodeAt(0));

  // Hash the provided password with the stored salt
  const { hash: newHash } = await hashPassword(password, saltBuffer);

  // Constant-time comparison to prevent timing attacks
  return constantTimeCompare(newHash, storedHash);
}

/**
 * Constant-time string comparison to prevent timing attacks
 *
 * @param a - First string to compare
 * @param b - Second string to compare
 * @returns True if strings are equal, false otherwise
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Generate a cryptographically secure random token
 *
 * Useful for session tokens, CSRF tokens, password reset tokens, etc.
 *
 * @param length - Length of token in bytes (default: 32)
 * @returns Base64 encoded random token
 */
export function generateSecureToken(length: number = 32): string {
  const buffer = crypto.getRandomValues(new Uint8Array(length));
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, ""); // URL-safe base64
}

/**
 * Hash data using SHA-256
 *
 * Useful for creating fingerprints, checksums, or non-password hashing
 *
 * @param data - String data to hash
 * @returns Hex encoded SHA-256 hash
 */
export async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Generate a UUID v4 using Web Crypto API
 *
 * @returns UUID v4 string
 */
export function generateUUID(): string {
  // Use crypto.randomUUID if available (Node 19+, modern browsers)
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  // Fallback implementation
  const buffer = crypto.getRandomValues(new Uint8Array(16));

  // Set version (4) and variant bits
  buffer[6] = (buffer[6] & 0x0f) | 0x40;
  buffer[8] = (buffer[8] & 0x3f) | 0x80;

  const hex = Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(
    16,
    20
  )}-${hex.slice(20)}`;
}

/**
 * Encrypt data using AES-GCM
 *
 * @param data - Plain text data to encrypt
 * @param key - Base64 encoded encryption key (must be 256 bits)
 * @returns Object containing encrypted data and IV as base64 strings
 */
export async function encrypt(
  data: string,
  key: string
): Promise<{ encrypted: string; iv: string }> {
  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Convert key from base64
  const keyBuffer = Uint8Array.from(atob(key), (c) => c.charCodeAt(0));

  // Import key
  const cryptoKey = await crypto.subtle.importKey("raw", keyBuffer, "AES-GCM", false, ["encrypt"]);

  // Encrypt data
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    cryptoKey,
    dataBuffer
  );

  // Convert to base64
  const encryptedArray = new Uint8Array(encryptedBuffer);
  const encrypted = btoa(String.fromCharCode(...encryptedArray));
  const ivBase64 = btoa(String.fromCharCode(...iv));

  return {
    encrypted,
    iv: ivBase64,
  };
}

/**
 * Decrypt data using AES-GCM
 *
 * @param encrypted - Base64 encoded encrypted data
 * @param iv - Base64 encoded initialization vector
 * @param key - Base64 encoded encryption key
 * @returns Decrypted plain text string
 */
export async function decrypt(encrypted: string, iv: string, key: string): Promise<string> {
  // Convert from base64
  const encryptedBuffer = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
  const ivBuffer = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
  const keyBuffer = Uint8Array.from(atob(key), (c) => c.charCodeAt(0));

  // Import key
  const cryptoKey = await crypto.subtle.importKey("raw", keyBuffer, "AES-GCM", false, ["decrypt"]);

  // Decrypt data
  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivBuffer,
    },
    cryptoKey,
    encryptedBuffer
  );

  // Convert to string
  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

/**
 * Generate an encryption key
 *
 * @returns Base64 encoded 256-bit encryption key
 */
export function generateEncryptionKey(): string {
  const buffer = crypto.getRandomValues(new Uint8Array(32)); // 256 bits
  return btoa(String.fromCharCode(...buffer));
}
