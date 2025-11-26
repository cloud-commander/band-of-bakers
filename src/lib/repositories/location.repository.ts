import { BaseRepository } from "./base.repository";
import { locations } from "@/db/schema";
import { eq } from "drizzle-orm";

export class LocationRepository extends BaseRepository<typeof locations> {
  constructor() {
    super(locations);
  }

  /**
   * Find all active locations
   */
  async findActive() {
    const db = await this.getDatabase();
    return await db.select().from(locations).where(eq(locations.is_active, true));
  }
}

export const locationRepository = new LocationRepository();
