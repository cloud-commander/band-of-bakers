import { BaseRepository } from "./base.repository";
import { testimonials, type Testimonial } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export class TestimonialRepository extends BaseRepository<typeof testimonials> {
  constructor() {
    super(testimonials);
  }

  /**
   * Find active testimonials
   */
  async findActive(): Promise<Testimonial[]> {
    const db = await this.getDatabase();
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.is_active, true))
      .orderBy(desc(testimonials.created_at));
  }
}

export const testimonialRepository = new TestimonialRepository();
