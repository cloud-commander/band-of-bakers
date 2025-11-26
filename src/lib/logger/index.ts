/**
 * Centralized logging utility
 * Exports appropriate logger based on environment
 */

// Server-side logger (with Rollbar)
export { logger } from './server-logger';

// Re-export types
export type { LogContext } from './server-logger';
