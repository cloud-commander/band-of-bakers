/**
 * Cloudflare KV Service
 * Centralized wrapper for all KV operations with type safety
 *
 * Key Naming Convention:
 * - Sessions: session:{sessionId}
 * - Rate Limits: ratelimit:{action}:{identifier}
 * - Cache: cache:{key}
 * - Tokens: token:{type}:{token}
 * - Features: feature:{featureName}
 */

import { getCloudflareContext } from "@opennextjs/cloudflare";

// Type definitions
export interface SessionData {
  userId: string;
  email: string;
  role: string;
  createdAt: number;
}

export interface RateLimitData {
  count: number;
  resetAt: number;
}

export class KVService {
  private async getKV() {
    const { env } = await getCloudflareContext({ async: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (env as any).KV;
  }

  // ==========================================
  // SESSION MANAGEMENT
  // ==========================================

  async getSession(sessionId: string): Promise<SessionData | null> {
    const kv = await this.getKV();
    const data = await kv.get(`session:${sessionId}`, "json");
    return data as SessionData | null;
  }

  async setSession(
    sessionId: string,
    data: SessionData,
    ttl: number = 86400 // 24 hours default
  ): Promise<void> {
    const kv = await this.getKV();
    await kv.put(`session:${sessionId}`, JSON.stringify(data), { expirationTtl: ttl });
  }

  async deleteSession(sessionId: string): Promise<void> {
    const kv = await this.getKV();
    await kv.delete(`session:${sessionId}`);
  }

  // ==========================================
  // RATE LIMITING
  // ==========================================

  async getRateLimit(action: string, identifier: string): Promise<RateLimitData | null> {
    const kv = await this.getKV();
    const key = `ratelimit:${action}:${identifier}`;
    const data = await kv.get(key, "json");
    return data as RateLimitData | null;
  }

  async setRateLimit(
    action: string,
    identifier: string,
    data: RateLimitData,
    ttl: number
  ): Promise<void> {
    const kv = await this.getKV();
    const key = `ratelimit:${action}:${identifier}`;
    await kv.put(key, JSON.stringify(data), { expirationTtl: ttl });
  }

  async deleteRateLimit(action: string, identifier: string): Promise<void> {
    const kv = await this.getKV();
    await kv.delete(`ratelimit:${action}:${identifier}`);
  }

  // ==========================================
  // CACHE
  // ==========================================

  async getCached<T>(key: string): Promise<T | null> {
    const kv = await this.getKV();
    const data = await kv.get(`cache:${key}`, "json");
    return data as T | null;
  }

  async setCache<T>(
    key: string,
    data: T,
    ttl: number = 300 // 5 minutes default
  ): Promise<void> {
    const kv = await this.getKV();
    await kv.put(`cache:${key}`, JSON.stringify(data), { expirationTtl: ttl });
  }

  async invalidateCache(key: string): Promise<void> {
    const kv = await this.getKV();
    await kv.delete(`cache:${key}`);
  }

  /**
   * Invalidate multiple cache keys by prefix
   * Example: invalidateCacheByPrefix('products') deletes all cache:products:* keys
   */
  async invalidateCacheByPrefix(prefix: string): Promise<void> {
    const kv = await this.getKV();
    const list = await kv.list({ prefix: `cache:${prefix}` });

    for (const key of list.keys) {
      await kv.delete(key.name);
    }
  }

  // ==========================================
  // TOKENS (Verification, Reset, etc.)
  // ==========================================

  async setToken(type: string, token: string, value: string, ttl: number): Promise<void> {
    const kv = await this.getKV();
    await kv.put(`token:${type}:${token}`, value, { expirationTtl: ttl });
  }

  async getToken(type: string, token: string): Promise<string | null> {
    const kv = await this.getKV();
    return await kv.get(`token:${type}:${token}`);
  }

  async deleteToken(type: string, token: string): Promise<void> {
    const kv = await this.getKV();
    await kv.delete(`token:${type}:${token}`);
  }

  // ==========================================
  // FEATURE FLAGS
  // ==========================================

  async getFeatureFlag(name: string): Promise<boolean> {
    const kv = await this.getKV();
    const value = await kv.get(`feature:${name}`);
    return value === "true";
  }

  async setFeatureFlag(name: string, enabled: boolean): Promise<void> {
    const kv = await this.getKV();
    await kv.put(`feature:${name}`, enabled ? "true" : "false");
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  async listKeys(prefix: string): Promise<string[]> {
    const kv = await this.getKV();
    const list = await kv.list({ prefix });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return list.keys.map((k: any) => k.name);
  }

  async deleteAllByPrefix(prefix: string): Promise<void> {
    const kv = await this.getKV();
    const list = await kv.list({ prefix });

    for (const key of list.keys) {
      await kv.delete(key.name);
    }
  }
}

// Singleton instance
export const kvService = new KVService();
