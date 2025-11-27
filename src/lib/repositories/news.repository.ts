import { BaseRepository } from "./base.repository";
import { newsPosts, type NewsPost, type InsertNewsPost } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export class NewsRepository extends BaseRepository<typeof newsPosts> {
  constructor() {
    super(newsPosts);
  }

  /**
   * Find published news posts
   */
  async findPublished(): Promise<NewsPost[]> {
    const db = await this.getDatabase();
    return await db
      .select()
      .from(newsPosts)
      .where(eq(newsPosts.is_published, true))
      .orderBy(desc(newsPosts.published_at));
  }

  /**
   * Find by slug
   */
  async findBySlug(slug: string): Promise<NewsPost | null> {
    const db = await this.getDatabase();
    const results = await db.select().from(newsPosts).where(eq(newsPosts.slug, slug)).limit(1);
    return results[0] || null;
  }
}

export const newsRepository = new NewsRepository();
