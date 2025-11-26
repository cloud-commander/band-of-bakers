/**
 * CSRF Protection for Server Actions
 * Validates request origin to prevent Cross-Site Request Forgery attacks
 */

import { headers } from "next/headers";

/**
 * CSRF Error - thrown when origin validation fails
 */
export class CsrfError extends Error {
  constructor(message: string = "Invalid request origin") {
    super(message);
    this.name = "CsrfError";
  }
}

/**
 * Get allowed origins for CSRF validation
 */
function getAllowedOrigins(): string[] {
  const origins = [process.env.NEXT_PUBLIC_SITE_URL || "https://bandofbakers.co.uk"];

  // Add localhost for development
  if (process.env.NODE_ENV === "development") {
    origins.push(
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:8788" // Wrangler dev server
    );
  }

  return origins;
}

/**
 * Validate CSRF token by checking origin and referer headers
 * @returns true if request is valid, false otherwise
 */
export async function validateCsrf(): Promise<boolean> {
  const headersList = await headers();
  const origin = headersList.get("origin");
  const referer = headersList.get("referer");

  const allowedOrigins = getAllowedOrigins();

  // Check origin header (preferred)
  if (origin) {
    const isAllowed = allowedOrigins.some((allowed) => origin.startsWith(allowed));

    if (!isAllowed) {
      if (process.env.NODE_ENV === "development") {
        console.error("CSRF validation failed - invalid origin:", origin);
      }
      return false;
    }

    return true;
  }

  // Fallback to referer header
  if (referer) {
    const isAllowed = allowedOrigins.some((allowed) => referer.startsWith(allowed));

    if (!isAllowed) {
      if (process.env.NODE_ENV === "development") {
        console.error("CSRF validation failed - invalid referer:", referer);
      }
      return false;
    }

    return true;
  }

  // No origin or referer header - suspicious
  if (process.env.NODE_ENV === "development") {
    console.error("CSRF validation failed - missing origin and referer headers");
  }

  return false;
}

/**
 * Validate CSRF and throw error if invalid
 * Use this in Server Actions that modify data
 */
export async function requireCsrf(): Promise<void> {
  const isValid = await validateCsrf();

  if (!isValid) {
    throw new CsrfError();
  }
}
