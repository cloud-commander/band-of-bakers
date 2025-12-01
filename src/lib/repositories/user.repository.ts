import { users } from "@/db/schema";
import { BaseRepository } from "./base.repository";
import { eq, sql, desc } from "drizzle-orm";

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User Repository
 * Handles all user-related database operations
 */
export class UserRepository extends BaseRepository<typeof users> {
  constructor() {
    super(users);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const db = await this.getDatabase();
    const results = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return results[0] || null;
  }

  /**
   * Find users by role
   */
  async findByRole(role: string): Promise<User[]> {
    const db = await this.getDatabase();
    return await db.select().from(users).where(eq(users.role, role));
  }

  /**
   * Update user's email verification status
   */
  async verifyEmail(userId: string): Promise<User | null> {
    const db = await this.getDatabase();
    const results = await db
      .update(users)
      .set({
        email_verified: true,
        updated_at: new Date().toISOString(),
      })
      .where(eq(users.id, userId))
      .returning();
    return results[0] || null;
  }

  /**
   * Update user's avatar
   */
  async updateAvatar(userId: string, avatarUrl: string): Promise<User | null> {
    const db = await this.getDatabase();
    const results = await db
      .update(users)
      .set({
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .where(eq(users.id, userId))
      .returning();
    return results[0] || null;
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: { name?: string; phone?: string; avatar_url?: string }
  ): Promise<User | null> {
    const db = await this.getDatabase();
    const results = await db
      .update(users)
      .set({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .where(eq(users.id, userId))
      .returning();
    return results[0] || null;
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return !!user;
  }

  /**
   * Get admin users (staff, manager, owner)
   */
  async getAdminUsers(): Promise<User[]> {
    const staff = await this.findByRole("staff");
    const managers = await this.findByRole("manager");
    const owners = await this.findByRole("owner");
    return [...staff, ...managers, ...owners];
  }

  /**
   * Count customers
   */
  async countCustomers() {
    const db = await this.getDatabase();
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, "customer"));
    return Number(result[0]?.count || 0);
  }

  /**
   * Paginated users list with totals and filters.
   */
  async findPaginated(
    limit: number,
    offset: number,
    filters?: {
      search?: string;
      role?: string;
      is_banned?: boolean;
    }
  ) {
    const db = await this.getDatabase();

    // Build where clause
    const conditions = [];

    if (filters?.search) {
      const searchLower = `%${filters.search.toLowerCase()}%`;
      conditions.push(
        sql`(${users.name} LIKE ${searchLower} OR ${users.email} LIKE ${searchLower} OR ${users.phone} LIKE ${searchLower})`
      );
    }

    if (filters?.role && filters.role !== "all") {
      conditions.push(eq(users.role, filters.role));
    }

    if (filters?.is_banned !== undefined) {
      conditions.push(eq(users.is_banned, filters.is_banned));
    }

    const whereClause = conditions.length > 0 ? sql.join(conditions, sql` AND `) : undefined;

    const data = await db
      .select()
      .from(users)
      .where(whereClause)
      .orderBy(desc(users.created_at))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereClause);

    return { data, total: Number(totalResult[0]?.count || 0) };
  }
}

export const userRepository = new UserRepository();
