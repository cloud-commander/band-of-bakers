/**
 * Input Sanitization Utilities
 * Protects against XSS and other injection attacks
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Allowed HTML tags for different security levels
 */
const ALLOWED_TAGS = {
  /**
   * Basic: Only simple text formatting
   * Use for: User names, short descriptions, comments
   */
  basic: ['b', 'i', 'em', 'strong', 'u', 'p', 'br'],

  /**
   * Rich: Full content editing
   * Use for: News posts, testimonials, product descriptions
   */
  rich: [
    'b', 'i', 'em', 'strong', 'u', 'p', 'br',
    'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'a',
    'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
};

/**
 * Allowed HTML attributes for different security levels
 */
const ALLOWED_ATTR = {
  basic: {},
  rich: {
    'a': ['href', 'title', 'target', 'rel'],
    'img': ['src', 'alt', 'title', 'width', 'height'],
  },
};

/**
 * Sanitize HTML content
 * @param dirty - Untrusted HTML string
 * @param level - Security level: 'basic' or 'rich'
 * @returns Sanitized HTML safe for rendering
 */
export function sanitizeHtml(
  dirty: string,
  level: 'basic' | 'rich' = 'basic'
): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ALLOWED_TAGS[level],
    ALLOWED_ATTR: level === 'rich' ? ALLOWED_ATTR.rich : ALLOWED_ATTR.basic,
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
  return filename
    // Remove path traversal attempts
    .replace(/\.\./g, '')
    // Remove directory separators
    .replace(/[/\\]/g, '')
    // Replace special characters with underscores
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    // Limit length to 255 characters
    .substring(0, 255)
    // Remove leading/trailing dots and spaces
    .replace(/^[.\s]+|[.\s]+$/g, '');
}

/**
 * Sanitize URL to ensure it's safe to use
 * @param url - URL string to sanitize
 * @param allowedProtocols - Allowed URL protocols (default: http, https)
 * @returns Sanitized URL or null if invalid
 */
export function sanitizeUrl(
  url: string,
  allowedProtocols: string[] = ['http', 'https']
): string | null {
  try {
    const parsed = new URL(url);

    // Check if protocol is allowed
    const protocol = parsed.protocol.replace(':', '');
    if (!allowedProtocols.includes(protocol)) {
      return null;
    }

    // Prevent javascript: and data: URLs
    if (['javascript', 'data', 'vbscript'].includes(protocol)) {
      return null;
    }

    return parsed.toString();
  } catch {
    // Invalid URL
    return null;
  }
}

/**
 * Sanitize email address
 * @param email - Email address to sanitize
 * @returns Sanitized email or null if invalid
 */
export function sanitizeEmail(email: string): string | null {
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const trimmed = email.trim().toLowerCase();

  if (!emailRegex.test(trimmed)) {
    return null;
  }

  // Additional checks
  if (trimmed.length > 254) return null; // Email too long
  if (trimmed.includes('..')) return null; // Consecutive dots
  if (trimmed.startsWith('.') || trimmed.endsWith('.')) return null; // Leading/trailing dot

  return trimmed;
}

/**
 * Sanitize phone number (UK format)
 * @param phone - Phone number to sanitize
 * @returns Sanitized phone number or null if invalid
 */
export function sanitizePhone(phone: string): string | null {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');

  // UK phone number validation (basic)
  // Accepts: +44, 0, or 7/8 prefix
  const ukPhoneRegex = /^(\+44|0)?[1-9]\d{8,9}$/;

  if (!ukPhoneRegex.test(cleaned)) {
    return null;
  }

  return cleaned;
}
