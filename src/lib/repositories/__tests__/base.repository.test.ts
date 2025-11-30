import { describe, it, expect, vi, beforeEach } from "vitest";
import { BaseRepository } from "../base.repository";
import { getDb } from "@/lib/db";

// Mock dependencies
const mocks = vi.hoisted(() => {
  const mockQueryBuilder: any = {
    from: vi.fn(),
    where: vi.fn(),
    limit: vi.fn(),
    values: vi.fn(),
    set: vi.fn(),
    returning: vi.fn(),
    then: vi.fn((resolve) => resolve([])),
  };

  const mockDb: any = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  return { mockDb, mockQueryBuilder };
});

vi.mock("@/lib/db", () => ({
  getDb: vi.fn(),
}));

// Concrete implementation for testing
class TestRepository extends BaseRepository<any> {
  constructor() {
    super({ id: "test_table" } as any);
  }
}

describe("BaseRepository", () => {
  let repository: TestRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new TestRepository();

    // Setup QueryBuilder mocks (chainable)
    mocks.mockQueryBuilder.from.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mockQueryBuilder.where.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mockQueryBuilder.limit.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mockQueryBuilder.values.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mockQueryBuilder.set.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mockQueryBuilder.returning.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mockQueryBuilder.then = vi.fn((resolve) => resolve([]));

    // Setup DB mocks to return QueryBuilder
    mocks.mockDb.select.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mockDb.insert.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mockDb.update.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mockDb.delete.mockReturnValue(mocks.mockQueryBuilder);

    (getDb as any).mockResolvedValue(mocks.mockDb);
  });

  describe("findById", () => {
    it("should return record if found", async () => {
      const mockRecord = { id: "1", name: "Test" };
      mocks.mockQueryBuilder.then.mockImplementation((resolve: any) => resolve([mockRecord]));

      const result = await repository.findById("1");
      expect(result).toEqual(mockRecord);
      expect(mocks.mockDb.select).toHaveBeenCalled();
      expect(mocks.mockQueryBuilder.from).toHaveBeenCalled();
      expect(mocks.mockQueryBuilder.where).toHaveBeenCalled();
      expect(mocks.mockQueryBuilder.limit).toHaveBeenCalledWith(1);
    });

    it("should return null if not found", async () => {
      mocks.mockQueryBuilder.then.mockImplementation((resolve: any) => resolve([]));

      const result = await repository.findById("1");
      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should return all records", async () => {
      const mockRecords = [{ id: "1" }, { id: "2" }];
      mocks.mockQueryBuilder.then.mockImplementation((resolve: any) => resolve(mockRecords));

      const result = await repository.findAll();
      expect(result).toEqual(mockRecords);
      expect(mocks.mockDb.select).toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("should create and return record", async () => {
      const newRecord = { name: "New" };
      const createdRecord = { id: "1", ...newRecord };
      mocks.mockQueryBuilder.then.mockImplementation((resolve: any) => resolve([createdRecord]));

      const result = await repository.create(newRecord);
      expect(result).toEqual(createdRecord);
      expect(mocks.mockDb.insert).toHaveBeenCalled();
      expect(mocks.mockQueryBuilder.values).toHaveBeenCalledWith(newRecord);
      expect(mocks.mockQueryBuilder.returning).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update and return record", async () => {
      const updateData = { name: "Updated" };
      const updatedRecord = { id: "1", ...updateData };
      mocks.mockQueryBuilder.then.mockImplementation((resolve: any) => resolve([updatedRecord]));

      const result = await repository.update("1", updateData);
      expect(result).toEqual(updatedRecord);
      expect(mocks.mockDb.update).toHaveBeenCalled();
      expect(mocks.mockQueryBuilder.set).toHaveBeenCalledWith(expect.objectContaining(updateData));
      expect(mocks.mockQueryBuilder.where).toHaveBeenCalled();
    });

    it("should return null if record not found", async () => {
      mocks.mockQueryBuilder.then.mockImplementation((resolve: any) => resolve([]));

      const result = await repository.update("1", { name: "Updated" });
      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete record", async () => {
      mocks.mockQueryBuilder.then.mockImplementation((resolve: any) => resolve([]));

      const result = await repository.delete("1");
      expect(result).toBe(true);
      expect(mocks.mockDb.delete).toHaveBeenCalled();
      expect(mocks.mockQueryBuilder.where).toHaveBeenCalled();
    });
  });

  describe("count", () => {
    it("should return count of records", async () => {
      const mockRecords = [{ id: "1" }, { id: "2" }];
      mocks.mockQueryBuilder.then.mockImplementation((resolve: any) => resolve(mockRecords));

      const result = await repository.count();
      expect(result).toBe(2);
      expect(mocks.mockDb.select).toHaveBeenCalled();
    });
  });
});
