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

  /**
   * Find location by name
   */
  async findByName(name: string) {
    const db = await this.getDatabase();
    const results = await db.select().from(locations).where(eq(locations.name, name)).limit(1);
    return results[0] || null;
  }
}

export const locationRepository = new LocationRepository();
