import { describe, it, expect, vi, beforeEach } from "vitest";
import { OrderRepository } from "../order.repository";

// Mock getDb
const mocks = vi.hoisted(() => {
  const then = vi.fn((resolve) => resolve([]));

  const mockQueryBuilder: any = {
    from: vi.fn(),
    where: vi.fn(),
    limit: vi.fn(),
    offset: vi.fn(),
    orderBy: vi.fn(),
    groupBy: vi.fn(),
    leftJoin: vi.fn(),
    innerJoin: vi.fn(),
    values: vi.fn(),
    set: vi.fn(),
    returning: vi.fn(),
    then,
  };

  // Chainable methods return self
  mockQueryBuilder.from.mockReturnValue(mockQueryBuilder);
  mockQueryBuilder.where.mockReturnValue(mockQueryBuilder);
  mockQueryBuilder.limit.mockReturnValue(mockQueryBuilder);
  mockQueryBuilder.offset.mockReturnValue(mockQueryBuilder);
  mockQueryBuilder.orderBy.mockReturnValue(mockQueryBuilder);
  mockQueryBuilder.groupBy.mockReturnValue(mockQueryBuilder);
  mockQueryBuilder.leftJoin.mockReturnValue(mockQueryBuilder);
  mockQueryBuilder.innerJoin.mockReturnValue(mockQueryBuilder);
  mockQueryBuilder.values.mockReturnValue(mockQueryBuilder);
  mockQueryBuilder.set.mockReturnValue(mockQueryBuilder);
  mockQueryBuilder.returning.mockReturnValue(mockQueryBuilder);

  const select = vi.fn().mockReturnValue(mockQueryBuilder);
  const insert = vi.fn().mockReturnValue(mockQueryBuilder);
  const update = vi.fn().mockReturnValue(mockQueryBuilder);
  const _delete = vi.fn().mockReturnValue(mockQueryBuilder);
  const findFirst = vi.fn();
  const findMany = vi.fn();

  const mockDb = {
    select,
    insert,
    update,
    delete: _delete,
    query: {
      orders: {
        findFirst,
        findMany,
      },
      orderItems: {
        findMany: vi.fn(),
      },
    },
  };
  return {
    mockDb,
    mockQueryBuilder,
    mocks: {
      select,
      insert,
      update,
      delete: _delete,
      findFirst,
      findMany,
      then,
    },
  };
});

vi.mock("@/lib/db", () => {
  return {
    getDb: vi.fn(() => mocks.mockDb),
  };
});

describe("OrderRepository", () => {
  let repository: OrderRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new OrderRepository();

    // Reset return values
    mocks.mocks.select.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mocks.insert.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mocks.update.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mocks.delete.mockReturnValue(mocks.mockQueryBuilder);

    mocks.mockQueryBuilder.from.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mockQueryBuilder.where.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mockQueryBuilder.limit.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mockQueryBuilder.offset.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mockQueryBuilder.orderBy.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mockQueryBuilder.groupBy.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mockQueryBuilder.leftJoin.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mockQueryBuilder.innerJoin.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mockQueryBuilder.values.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mockQueryBuilder.set.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mockQueryBuilder.returning.mockReturnValue(mocks.mockQueryBuilder);

    // Reset then implementation
    mocks.mocks.then.mockReset();
  });

  describe("nextOrderNumber", () => {
    it("returns next order number", async () => {
      mocks.mocks.then.mockImplementation((resolve: any) => resolve([{ max: 10 }]));
      const result = await repository.nextOrderNumber();
      expect(result).toBe(11);
    });

    it("returns 1 if no orders exist", async () => {
      mocks.mocks.then.mockImplementation((resolve: any) => resolve([]));
      const result = await repository.nextOrderNumber();
      expect(result).toBe(1);
    });
  });

  describe("createWithItems", () => {
    it("creates order and items", async () => {
      const newOrder = { id: "1" };
      mocks.mockQueryBuilder.returning.mockResolvedValue([newOrder]);

      const result = await repository.createWithItems(
        { id: "1" } as any,
        [{ product_id: "p1" }] as any
      );

      expect(result).toEqual(newOrder);
      expect(mocks.mocks.insert).toHaveBeenCalledTimes(2);
    });
  });

  describe("findByUserId", () => {
    it("finds orders by user id", async () => {
      const mockOrders = [{ id: "1" }];
      mocks.mocks.findMany.mockResolvedValue(mockOrders);

      const result = await repository.findByUserId("u1");
      expect(result).toEqual(mockOrders);
    });
  });

  describe("findByIdWithRelations", () => {
    it("finds order by id", async () => {
      const mockOrder = { id: "1" };
      mocks.mocks.findFirst.mockResolvedValue(mockOrder);

      const result = await repository.findByIdWithRelations("1");
      expect(result).toEqual(mockOrder);
    });
  });

  describe("count", () => {
    it("counts orders", async () => {
      mocks.mocks.then.mockImplementation((resolve: any) => resolve([{ count: 5 }]));
      const result = await repository.count();
      expect(result).toBe(5);
    });
  });

  describe("sumTotal", () => {
    it("calculates total revenue", async () => {
      mocks.mocks.then.mockImplementation((resolve: any) => resolve([{ total: 100 }]));

      const result = await repository.sumTotal();
      expect(result).toBe(100);
    });
  });

  describe("findPaginated", () => {
    it("returns paginated orders", async () => {
      const mockOrders = [{ id: "1" }];

      mocks.mocks.findMany.mockResolvedValue(mockOrders);
      mocks.mocks.then.mockImplementation((resolve: any) => resolve([{ count: 1 }]));

      const result = await repository.findPaginated(10, 0);
      expect(result.data).toEqual(mockOrders);
      expect(result.total).toBe(1);
    });
  });

  describe("countVoucherUses", () => {
    it("counts voucher uses", async () => {
      mocks.mocks.then.mockImplementation((resolve: any) => resolve([{ count: 5 }]));

      const result = await repository.countVoucherUses("u1", "v1");
      expect(result).toBe(5);
    });
  });

  describe("revenueLastNDays", () => {
    it("calculates revenue for last N days", async () => {
      const mockData = [{ day: "2023-01-01", revenue: 100 }];
      mocks.mocks.then.mockImplementation((resolve: any) => resolve(mockData));

      const result = await repository.revenueLastNDays(7);
      expect(result).toEqual(mockData);
    });
  });

  describe("countByStatus", () => {
    it("counts orders by status", async () => {
      const mockData = [{ status: "pending", count: 2 }];
      mocks.mocks.then.mockImplementation((resolve: any) => resolve(mockData));

      const result = await repository.statusCounts();
      expect(result).toEqual(mockData);
    });
  });

  describe("getTopProducts", () => {
    it("gets top products", async () => {
      const mockDbData = [{ product_id: "p1", name: "Product 1", units: 10, revenue: 100 }];
      const expectedData = [{ product_id: "p1", name: "Product 1", units: 10, revenue: 100 }];

      mocks.mocks.then.mockImplementation((resolve: any) => resolve(mockDbData));

      const result = await repository.topProducts(5);
      expect(result).toEqual(expectedData);
    });
  });
});
