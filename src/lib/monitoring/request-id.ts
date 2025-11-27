import { nanoid } from 'nanoid';
import { headers } from 'next/headers';

/**
 * Request ID Utilities
 * For tracking requests across client, middleware, and server actions
 */

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return nanoid(21); // 21 chars = 4 billion years needed to have a 1% chance of collision
}

/**
 * Get request ID from headers (Server Components/Actions)
 */
export async function getRequestId(): Promise<string | null> {
  try {
    const headersList = await headers();
    return headersList.get('x-request-id');
  } catch {
    // headers() might not be available in all contexts
    return null;
  }
}

/**
 * Get or generate request ID
 */
export async function ensureRequestId(): Promise<string> {
  const existingId = await getRequestId();
  return existingId || generateRequestId();
}
