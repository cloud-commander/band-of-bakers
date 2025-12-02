import { describe, it, expect, vi, beforeEach } from "vitest";
import { productAvailabilityRepository } from "../product-availability.repository";

// Mock database
const mockDb = {
  select: vi.fn(),
  insert: vi.fn(),
};

vi.mock("@/lib/db", () => ({
  getDb: vi.fn(() => Promise.resolve(mockDb)),
}));

describe("ProductAvailabilityRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock implementations
    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });
    mockDb.insert.mockReturnValue({
      values: vi.fn().mockReturnValue({
        onConflictDoUpdate: vi.fn().mockResolvedValue(undefined),
      }),
    });
  });

  describe("get", () => {
    it("should return availability row if found", async () => {
      const mockRow = { product_id: "p1", bake_sale_id: "b1", is_available: true };
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockRow]),
          }),
        }),
      });

      const result = await productAvailabilityRepository.get("p1", "b1");
      expect(result).toEqual(mockRow);
    });

    it("should return null if not found", async () => {
      const result = await productAvailabilityRepository.get("p1", "b1");
      expect(result).toBeNull();
    });
  });

  describe("setAvailability", () => {
    it("should insert or update availability", async () => {
      await productAvailabilityRepository.setAvailability("p1", "b1", true);
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe("getAvailabilityForBakeSales", () => {
    it("should return map of availability", async () => {
      const mockRows = [
        { bake_sale_id: "b1", is_available: true },
        { bake_sale_id: "b2", is_available: false },
      ];
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(mockRows),
        }),
      });

      const result = await productAvailabilityRepository.getAvailabilityForBakeSales("p1", [
        "b1",
        "b2",
      ]);
      expect(result.get("b1")).toBe(true);
      expect(result.get("b2")).toBe(false);
    });

    it("should return empty map if no bake sale ids provided", async () => {
      const result = await productAvailabilityRepository.getAvailabilityForBakeSales("p1", []);
      expect(result.size).toBe(0);
      expect(mockDb.select).not.toHaveBeenCalled();
    });
  });

  describe("getAvailabilityForBakeSale", () => {
    it("should return map of availability for specific bake sale", async () => {
      const mockRows = [
        { product_id: "p1", is_available: true },
        { product_id: "p2", is_available: false },
      ];
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(mockRows),
        }),
      });

      const result = await productAvailabilityRepository.getAvailabilityForBakeSale("b1");
      expect(result.get("p1")).toBe(true);
      expect(result.get("p2")).toBe(false);
    });

    it("should filter by product ids if provided", async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });
      await productAvailabilityRepository.getAvailabilityForBakeSale("b1", ["p1"]);
      expect(mockDb.select).toHaveBeenCalled();
    });
  });

  describe("getUnavailableProducts", () => {
    it("should return list of unavailable product ids", async () => {
      const mockRows = [{ product_id: "p1" }, { product_id: "p2" }];
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(mockRows),
        }),
      });

      const result = await productAvailabilityRepository.getUnavailableProducts("b1");
      expect(result).toEqual(["p1", "p2"]);
    });
  });

  describe("copyUnavailability", () => {
    it("should copy unavailable products to another bake sale", async () => {
      // Mock getUnavailableProducts
      const mockRows = [{ product_id: "p1" }];
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(mockRows),
        }),
      });

      await productAvailabilityRepository.copyUnavailability("b1", "b2");
      expect(mockDb.insert).toHaveBeenCalled();
    });

    it("should do nothing if source and target are same", async () => {
      await productAvailabilityRepository.copyUnavailability("b1", "b1");
      expect(mockDb.select).not.toHaveBeenCalled();
    });

    it("should do nothing if no unavailable products", async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      await productAvailabilityRepository.copyUnavailability("b1", "b2");
      expect(mockDb.insert).not.toHaveBeenCalled();
    });
  });
});
