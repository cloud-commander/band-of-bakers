'use client';

/**
 * Logflare Client-Side Analytics
 * Handles client-side event tracking and page view logging
 */

interface LogflareEvent {
  message: string;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

export class LogflareClient {
  private apiKey: string;
  private sourceId: string;
  private debug: boolean;
  private enabled: boolean;

  constructor(apiKey: string, sourceId: string, debug = false) {
    this.apiKey = apiKey;
    this.sourceId = sourceId;
    this.debug = debug;
    this.enabled = !!apiKey && !!sourceId;
  }

  /**
   * Log an event to Logflare
   */
  async log(event: LogflareEvent): Promise<void> {
    if (!this.enabled) {
      if (this.debug) {
        console.log('[Logflare] Not configured, skipping log:', event);
      }
      return;
    }

    try {
      const payload = {
        ...event,
        timestamp: event.timestamp || new Date().toISOString(),
        metadata: {
          ...event.metadata,
          userAgent: navigator.userAgent,
          url: window.location.href,
          referrer: document.referrer,
          screen: {
            width: window.screen.width,
            height: window.screen.height,
          },
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
        },
      };

      const response = await fetch(
        `https://api.logflare.app/logs?source=${this.sourceId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': this.apiKey,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok && this.debug) {
        console.warn('[Logflare] Log failed:', response.statusText);
      } else if (this.debug) {
        console.log('[Logflare] Event logged:', event.message);
      }
    } catch (error) {
      if (this.debug) {
        console.error('[Logflare] Error:', error);
      }
    }
  }

  /**
   * Track a page view
   */
  pageView(path: string, metadata?: Record<string, unknown>): void {
    this.log({
      message: 'page_view',
      metadata: {
        path,
        timestamp: Date.now(),
        ...metadata,
      },
    });
  }

  /**
   * Track a custom event
   */
  event(eventName: string, properties?: Record<string, unknown>): void {
    this.log({
      message: eventName,
      metadata: properties,
    });
  }

  /**
   * Track an error
   */
  error(error: Error, context?: Record<string, unknown>): void {
    this.log({
      message: 'client_error',
      metadata: {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        ...context,
      },
    });
  }

  /**
   * Track user interaction
   */
  interaction(action: string, target: string, metadata?: Record<string, unknown>): void {
    this.log({
      message: 'user_interaction',
      metadata: {
        action,
        target,
        ...metadata,
      },
    });
  }
}

// Global instance
let logflareInstance: LogflareClient | null = null;

/**
 * Initialize Logflare client
 */
export function initLogflare(
  apiKey: string,
  sourceId: string,
  debug = false
): LogflareClient {
  if (!logflareInstance) {
    logflareInstance = new LogflareClient(apiKey, sourceId, debug);
  }
  return logflareInstance;
}

/**
 * Get Logflare client instance
 */
export function getLogflare(): LogflareClient | null {
  return logflareInstance;
}
