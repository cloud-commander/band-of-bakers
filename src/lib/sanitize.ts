/**
 * Input Sanitization Utilities
 * Protects against XSS and other injection attacks
 */

import DOMPurify from "isomorphic-dompurify";

/**
 * Allowed HTML tags for different security levels
 */
const ALLOWED_TAGS = {
  /**
   * Basic: Only simple text formatting
   * Use for: User names, short descriptions, comments
   */
  basic: ["b", "i", "em", "strong", "u", "p", "br"],

  /**
   * Rich: Full content editing
   * Use for: News posts, testimonials, product descriptions
   */
  rich: [
    "b",
    "i",
    "em",
    "strong",
    "u",
    "p",
    "br",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "blockquote",
    "a",
    "img",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
  ],
};

/**
 * Allowed HTML attributes for different security levels
 */
const ALLOWED_ATTR = {
  basic: [] as string[],
  rich: ["href", "title", "target", "rel", "src", "alt", "width", "height"],
};

/**
 * Sanitize HTML content
 * @param dirty - Untrusted HTML string
 * @param level - Security level: 'basic' or 'rich'
 * @returns Sanitized HTML safe for rendering
 */
export function sanitizeHtml(dirty: string, level: "basic" | "rich" = "basic"): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ALLOWED_TAGS[level],
    ALLOWED_ATTR: ALLOWED_ATTR[level],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    SAFE_FOR_TEMPLATES: true,
  });
}

/**
 * Remove all HTML tags, keeping only text content
 * @param input - String that may contain HTML
 * @returns Plain text with all HTML removed
 */
export function sanitizeText(input: string): string {
  // First sanitize with DOMPurify, then strip all tags
  const cleaned = DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
  return cleaned.trim();
}

/**
 * Sanitize file names to prevent path traversal and other attacks
 * @param filename - Original filename
 * @returns Safe filename with dangerous characters removed
 */
export function sanitizeFileName(filename: string): string {
  return (
    filename
      // Remove path traversal attempts
      .replace(/\.\./g, "")
      // Remove directory separators
      .replace(/[/\\]/g, "")
      // Replace special characters with underscores
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      // Limit length to 255 characters
      .substring(0, 255)
      // Remove leading/trailing dots and spaces
      .replace(/^[.\s]+|[.\s]+$/g, "")
  );
}

/**
 * Sanitize URL to ensure it's safe to use
 * @param url - URL string to sanitize
 * @param allowedProtocols - Allowed URL protocols (default: http, https)
 * @returns Sanitized URL
 * @throws Error if URL is invalid or uses disallowed protocol
 */
export function sanitizeUrl(
  url: string,
  allowedProtocols: string[] = ["http", "https"]
): string {
  if (!url || url.trim().length === 0) {
    throw new Error("URL cannot be empty");
  }

  try {
    const parsed = new URL(url);

    // Get protocol without colon
    const protocol = parsed.protocol.replace(":", "");

    // Prevent dangerous protocols
    if (["javascript", "data", "vbscript"].includes(protocol)) {
      throw new Error(`Dangerous protocol not allowed: ${protocol}`);
    }

    // Check if protocol is in allowed list
    if (!allowedProtocols.includes(protocol)) {
      throw new Error(`Protocol not allowed: ${protocol}`);
    }

    return parsed.toString();
  } catch (error) {
    if (error instanceof Error && error.message.includes("not allowed")) {
      throw error;
    }
    // Invalid URL format
    throw new Error("Invalid URL format");
  }
}

/**
 * Sanitize email address
 * @param email - Email address to sanitize
 * @returns Sanitized email (lowercased and trimmed)
 * @throws Error if email is invalid
 */
export function sanitizeEmail(email: string): string {
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const trimmed = email.trim().toLowerCase();

  if (!emailRegex.test(trimmed)) {
    throw new Error("Invalid email format");
  }

  // Additional checks
  if (trimmed.length > 254) {
    throw new Error("Email address too long");
  }
  if (trimmed.includes("..")) {
    throw new Error("Email cannot contain consecutive dots");
  }
  if (trimmed.startsWith(".") || trimmed.endsWith(".")) {
    throw new Error("Email cannot start or end with a dot");
  }

  return trimmed;
}

/**
 * Sanitize phone number (UK mobile format)
 * Normalizes to E.164 format: +447xxxxxxxxx
 * @param phone - Phone number to sanitize
 * @returns Sanitized phone number in E.164 format (+447xxxxxxxxx)
 * @throws Error if phone number is invalid
 */
export function sanitizePhone(phone: string): string {
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, "");

  // Handle different UK mobile number formats
  // UK mobiles start with 07 (domestic) or +447/00447 (international)

  // Convert 0044 to +44
  if (cleaned.startsWith("0044")) {
    cleaned = "+44" + cleaned.substring(4);
  }
  // Convert 07 to +447
  else if (cleaned.startsWith("07")) {
    cleaned = "+44" + cleaned.substring(1);
  }
  // Already in +44 format - keep as is
  else if (cleaned.startsWith("+447")) {
    // Already correct
  }
  // 447 without + prefix
  else if (cleaned.startsWith("447")) {
    cleaned = "+" + cleaned;
  }
  else {
    throw new Error("Invalid UK mobile number format");
  }

  // Validate final format: +447xxxxxxxxx (UK mobile)
  const ukMobileRegex = /^\+447\d{9}$/;
  if (!ukMobileRegex.test(cleaned)) {
    throw new Error("Invalid UK mobile number");
  }

  return cleaned;
}
