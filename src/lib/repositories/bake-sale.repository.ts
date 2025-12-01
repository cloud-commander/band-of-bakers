import { BaseRepository } from "./base.repository";
import { bakeSales, locations, type BakeSale, type Location } from "@/db/schema";
import { eq, desc, gte, lt } from "drizzle-orm";

export type BakeSaleWithLocation = BakeSale & {
  location: Location;
};

export class BakeSaleRepository extends BaseRepository<typeof bakeSales> {
  constructor() {
    super(bakeSales);
  }

  /**
   * Find all bake sales with location data
   */
  async findAllWithLocation(): Promise<BakeSaleWithLocation[]> {
    const db = await this.getDatabase();
    const results = await db
      .select()
      .from(bakeSales)
      .innerJoin(locations, eq(bakeSales.location_id, locations.id))
      .orderBy(desc(bakeSales.date));

    return results.map(
      ({ bake_sales, locations }: { bake_sales: BakeSale; locations: Location }) => ({
        ...bake_sales,
        location: locations,
      })
    );
  }

  /**
   * Find upcoming bake sales (today or future)
   */
  async findUpcoming(): Promise<BakeSaleWithLocation[]> {
    const db = await this.getDatabase();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const results = await db
      .select()
      .from(bakeSales)
      .innerJoin(locations, eq(bakeSales.location_id, locations.id))
      .where(gte(bakeSales.date, today))
      .orderBy(bakeSales.date);

    return results.map(
      ({ bake_sales, locations }: { bake_sales: BakeSale; locations: Location }) => ({
        ...bake_sales,
        location: locations,
      })
    );
  }

  /**
   * Find archived bake sales (past)
   * Limited to 100 most recent to prevent unbounded query growth
   */
  async findArchived(): Promise<BakeSaleWithLocation[]> {
    const db = await this.getDatabase();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const results = await db
      .select()
      .from(bakeSales)
      .innerJoin(locations, eq(bakeSales.location_id, locations.id))
      .where(lt(bakeSales.date, today))
      .orderBy(desc(bakeSales.date))
      .limit(100); // Prevent unbounded growth over years

    return results.map(
      ({ bake_sales, locations }: { bake_sales: BakeSale; locations: Location }) => ({
        ...bake_sales,
        location: locations,
      })
    );
  }

  /**
   * Get bake sale by ID with location
   */
  async findByIdWithLocation(id: string): Promise<BakeSaleWithLocation | null> {
    const db = await this.getDatabase();
    const results = await db
      .select()
      .from(bakeSales)
      .innerJoin(locations, eq(bakeSales.location_id, locations.id))
      .where(eq(bakeSales.id, id))
      .limit(1);

    if (results.length === 0) return null;

    const { bake_sales, locations: loc } = results[0];
    return {
      ...bake_sales,
      location: loc,
    };
  }
}

export const bakeSaleRepository = new BakeSaleRepository();
