import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUnavailableProductsMap } from "../products";

// Mock repository
const mockGetUnavailableProducts = vi.fn();

vi.mock("@/lib/repositories/product-availability.repository", () => ({
  productAvailabilityRepository: {
    getUnavailableProducts: (...args: any[]) => mockGetUnavailableProducts(...args),
  },
}));

// Mock auth and other dependencies if needed (though getUnavailableProductsMap doesn't use them directly)
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: (fn: any) => fn,
}));

describe("products actions", () => {
  describe("getUnavailableProductsMap", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should return a map of unavailable products for given bake sale ids", async () => {
      mockGetUnavailableProducts.mockImplementation((id) => {
        if (id === "bs1") return Promise.resolve(["p1", "p2"]);
        if (id === "bs2") return Promise.resolve(["p3"]);
        return Promise.resolve([]);
      });

      const result = await getUnavailableProductsMap(["bs1", "bs2", "bs3"]);

      expect(result).toEqual({
        bs1: ["p1", "p2"],
        bs2: ["p3"],
      });
      expect(mockGetUnavailableProducts).toHaveBeenCalledTimes(3);
      expect(mockGetUnavailableProducts).toHaveBeenCalledWith("bs1");
      expect(mockGetUnavailableProducts).toHaveBeenCalledWith("bs2");
      expect(mockGetUnavailableProducts).toHaveBeenCalledWith("bs3");
    });

    it("should return empty map if no bake sale ids provided", async () => {
      const result = await getUnavailableProductsMap([]);
      expect(result).toEqual({});
      expect(mockGetUnavailableProducts).not.toHaveBeenCalled();
    });

    it("should handle errors gracefully", async () => {
      mockGetUnavailableProducts.mockRejectedValue(new Error("DB Error"));
      const result = await getUnavailableProductsMap(["bs1"]);
      expect(result).toEqual({});
    });
  });
});
