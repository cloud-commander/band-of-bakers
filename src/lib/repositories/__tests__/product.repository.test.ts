import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProductRepository } from "../product.repository";
import { products } from "@/db/schema";

// Mock BaseRepository
const mocks = vi.hoisted(() => {
  const mockDb: any = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    from: vi.fn(),
    where: vi.fn(),
    limit: vi.fn(),
    values: vi.fn(),
    set: vi.fn(),
    returning: vi.fn(),
    then: vi.fn((resolve) => resolve([])),
    query: {
      products: {
        findMany: vi.fn(),
      },
    },
  };
  return { mockDb };
});

vi.mock("../base.repository", () => {
  return {
    BaseRepository: class {
      async getDatabase() {
        return mocks.mockDb;
      }
    },
  };
});

describe("ProductRepository", () => {
  let repository: ProductRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new ProductRepository();

    // Setup chainable mocks
    mocks.mockDb.select.mockReturnValue(mocks.mockDb);
    mocks.mockDb.insert.mockReturnValue(mocks.mockDb);
    mocks.mockDb.update.mockReturnValue(mocks.mockDb);
    mocks.mockDb.delete.mockReturnValue(mocks.mockDb);
    mocks.mockDb.from = vi.fn().mockReturnValue(mocks.mockDb);
    mocks.mockDb.where = vi.fn().mockReturnValue(mocks.mockDb);
    mocks.mockDb.limit = vi.fn().mockReturnValue(mocks.mockDb);
    mocks.mockDb.values = vi.fn().mockReturnValue(mocks.mockDb);
    mocks.mockDb.set = vi.fn().mockReturnValue(mocks.mockDb);
    mocks.mockDb.returning = vi.fn().mockReturnValue(mocks.mockDb); // returning now returns the mockDb for chaining

    // Reset then to default
    mocks.mockDb.then = vi.fn((resolve) => resolve([]));
  });

  describe("findBySlug", () => {
    it("returns product when found", async () => {
      const mockProduct = { id: "1", slug: "test-product" };
      mocks.mockDb.then.mockImplementation((resolve: any) => resolve([mockProduct]));

      const result = await repository.findBySlug("test-product");
      expect(result).toEqual(mockProduct);
      expect(mocks.mockDb.select).toHaveBeenCalled();
    });

    it("returns null when not found", async () => {
      mocks.mockDb.then.mockImplementation((resolve: any) => resolve([]));

      const result = await repository.findBySlug("non-existent");
      expect(result).toBeNull();
    });
  });

  describe("findActiveProducts", () => {
    it("returns active products", async () => {
      const mockProducts = [{ id: "1", is_active: true }];
      mockDb.then.mockImplementation((resolve: any) => resolve(mockProducts));

      const result = await repository.findActiveProducts();
      expect(result).toEqual(mockProducts);
    });
  });

  describe("decrementStock", () => {
    it("returns updated product on success", async () => {
      const mockProduct = { id: "1", stock_quantity: 9 };
      mockDb.then.mockImplementation((resolve: any) => resolve([mockProduct]));

      const result = await repository.decrementStock("1", 1);
      expect(result).toEqual(mockProduct);
      expect(mockDb.update).toHaveBeenCalled();
    });

    it("returns null if update fails (e.g. insufficient stock)", async () => {
      mockDb.then.mockImplementation((resolve: any) => resolve([]));

      const result = await repository.decrementStock("1", 100);
      expect(result).toBeNull();
    });
  });

  describe("toggleActive", () => {
    it("toggles product status", async () => {
      // Mock findById (inherited but we can mock the internal call or the DB call it makes)
      // Since we mocked BaseRepository, we need to ensure findById works or we mock the internal DB call it makes
      // But findById is on the base class.
      // Let's mock the internal DB call for findById first

      // First call is findById -> select().from().where().limit()
      // Second call is update -> update().set().where().returning()

      const mockProduct = { id: "1", is_active: true };
      const updatedProduct = { id: "1", is_active: false };

      // We need to mock the sequence of calls.
      // This is tricky with the chainable mock setup.
      // Let's rely on the fact that findById calls select...limit(1)

      // Mocking findById directly on the instance might be easier for this specific test
      repository.findById = vi.fn().mockResolvedValue(mockProduct);

      mockDb.then.mockImplementation((resolve: any) => resolve([updatedProduct]));

      const result = await repository.toggleActive("1");
      expect(result).toEqual(updatedProduct);
      expect(repository.findById).toHaveBeenCalledWith("1");
      expect(mockDb.update).toHaveBeenCalled();
    });

    it("returns null if product not found", async () => {
      repository.findById = vi.fn().mockResolvedValue(null);
      const result = await repository.toggleActive("1");
      expect(result).toBeNull();
      expect(mockDb.update).not.toHaveBeenCalled();
    });
  });

  describe("searchByName", () => {
    it("searches products by name", async () => {
      const mockProducts = [{ id: "1", name: "Test Product" }];
      mockDb.then.mockImplementation((resolve: any) => resolve(mockProducts));

      const result = await repository.searchByName("Test");
      expect(result).toEqual(mockProducts);
    });
  });

  describe("countActive", () => {
    it("counts active products", async () => {
      mockDb.then.mockImplementation((resolve: any) => resolve([{ count: 5 }]));
      const result = await repository.countActive();
      expect(result).toBe(5);
    });

    it("returns 0 if no count returned", async () => {
      mockDb.then.mockImplementation((resolve: any) => resolve([]));
      const result = await repository.countActive();
      expect(result).toBe(0);
    });
  });

  describe("createWithVariants", () => {
    it("creates product and variants", async () => {
      const newProduct = { id: "1", name: "New Product" };
      mockDb.then.mockImplementation((resolve: any) => resolve([newProduct]));

      const result = await repository.createWithVariants(
        { name: "New Product" } as any,
        [{ name: "Variant 1" }] as any
      );

      expect(result).toEqual(newProduct);
      expect(mockDb.insert).toHaveBeenCalledTimes(2); // Product + Variants
    });

    it("creates product without variants", async () => {
      const newProduct = { id: "1", name: "New Product" };
      mockDb.then.mockImplementation((resolve: any) => resolve([newProduct]));

      const result = await repository.createWithVariants({ name: "New Product" } as any, []);

      expect(result).toEqual(newProduct);
      expect(mockDb.insert).toHaveBeenCalledTimes(1); // Product only
    });
  });
  describe("findByCategoryId", () => {
    it("returns products by category id", async () => {
      const mockProducts = [{ id: "1", category_id: "c1" }];
      mockDb.then.mockImplementation((resolve: any) => resolve(mockProducts));

      const result = await repository.findByCategoryId("c1");
      expect(result).toEqual(mockProducts);
    });
  });

  describe("findPaginated", () => {
    it("returns paginated products", async () => {
      const mockProducts = [{ id: "1" }];
      mockDb.query.products.findMany.mockResolvedValue(mockProducts);
      mockDb.then.mockImplementation((resolve: any) => resolve([{ count: 1 }])); // For count query

      const result = await repository.findPaginated(10, 0);
      expect(result.data).toEqual(mockProducts);
      expect(result.total).toBe(1);
    });

    it("returns paginated active products", async () => {
      const mockProducts = [{ id: "1", is_active: true }];
      mockDb.query.products.findMany.mockResolvedValue(mockProducts);
      mockDb.then.mockImplementation((resolve: any) => resolve([{ count: 1 }]));

      const result = await repository.findPaginated(10, 0, true);
      expect(result.data).toEqual(mockProducts);
      expect(result.total).toBe(1);
    });
  });

  describe("findActiveByCategoryId", () => {
    it("returns active products by category", async () => {
      const mockProducts = [{ id: "1", category_id: "c1", is_active: true }];
      mockDb.then.mockImplementation((resolve: any) => resolve(mockProducts));

      const result = await repository.findActiveByCategoryId("c1");
      expect(result).toEqual(mockProducts);
    });
  });

  describe("getVariants", () => {
    it("returns product variants", async () => {
      const mockVariants = [{ id: "v1", product_id: "p1" }];
      mockDb.then.mockImplementation((resolve: any) => resolve(mockVariants));

      const result = await repository.getVariants("p1");
      expect(result).toEqual(mockVariants);
    });
  });

  describe("getActiveVariants", () => {
    it("returns active variants", async () => {
      const mockVariants = [{ id: "v1", product_id: "p1", is_active: true }];
      mockDb.then.mockImplementation((resolve: any) => resolve(mockVariants));

      const result = await repository.getActiveVariants("p1");
      expect(result).toEqual(mockVariants);
    });
  });

  describe("incrementStock", () => {
    it("increments stock", async () => {
      const mockProduct = { id: "1", stock_quantity: 11 };
      mockDb.then.mockImplementation((resolve: any) => resolve([mockProduct]));

      const result = await repository.incrementStock("1", 1);
      expect(result).toEqual(mockProduct);
      expect(mockDb.update).toHaveBeenCalled();
    });
  });

  describe("updateWithVariants", () => {
    it("updates product and variants", async () => {
      const updatedProduct = { id: "1", name: "Updated" };
      mockDb.then.mockImplementation((resolve: any) => resolve([updatedProduct]));

      const result = await repository.updateWithVariants(
        "1",
        { name: "Updated" },
        {
          create: [{ name: "New Var" }] as any,
          update: [{ id: "v1", name: "Updated Var" }] as any,
          delete: ["v2"],
        }
      );

      expect(result).toEqual(updatedProduct);
      expect(mockDb.update).toHaveBeenCalled(); // Product update + Variant update
      expect(mockDb.insert).toHaveBeenCalled(); // Variant create
      expect(mockDb.delete).toHaveBeenCalled(); // Variant delete
    });

    it("returns null if product not found", async () => {
      mockDb.then.mockImplementation((resolve: any) => resolve([]));

      const result = await repository.updateWithVariants(
        "1",
        {},
        { create: [], update: [], delete: [] }
      );
      expect(result).toBeNull();
    });
  });
});
