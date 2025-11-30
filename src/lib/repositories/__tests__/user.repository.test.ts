import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserRepository } from "../user.repository";

// Mock getDb
const mocks = vi.hoisted(() => {
  const then = vi.fn((resolve) => resolve([]));

  // Query Builder Mock (Thenable)
  const mockQueryBuilder: any = {
    from: vi.fn(),
    where: vi.fn(),
    limit: vi.fn(),
    offset: vi.fn(),
    orderBy: vi.fn(),
    values: vi.fn(),
    set: vi.fn(),
    returning: vi.fn(),
    then,
  };

  // Chainable methods on query builder return self
  mockQueryBuilder.from.mockReturnValue(mockQueryBuilder);
  mockQueryBuilder.where.mockReturnValue(mockQueryBuilder);
  mockQueryBuilder.limit.mockReturnValue(mockQueryBuilder);
  mockQueryBuilder.offset.mockReturnValue(mockQueryBuilder);
  mockQueryBuilder.orderBy.mockReturnValue(mockQueryBuilder);
  mockQueryBuilder.values.mockReturnValue(mockQueryBuilder);
  mockQueryBuilder.set.mockReturnValue(mockQueryBuilder);
  mockQueryBuilder.returning.mockReturnValue(mockQueryBuilder);

  // DB Client Mock (Not Thenable)
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
      users: {
        findFirst,
        findMany,
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
      from: mockQueryBuilder.from,
      where: mockQueryBuilder.where,
      limit: mockQueryBuilder.limit,
      offset: mockQueryBuilder.offset,
      orderBy: mockQueryBuilder.orderBy,
      values: mockQueryBuilder.values,
      set: mockQueryBuilder.set,
      returning: mockQueryBuilder.returning,
      findFirst,
      findMany,
      then,
    },
  };
});

vi.mock("@/lib/db", () => ({
  getDb: vi.fn().mockResolvedValue(mocks.mockDb),
}));

describe("UserRepository", () => {
  let repository: UserRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new UserRepository();

    // Reset return values
    mocks.mocks.select.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mocks.insert.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mocks.update.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mocks.delete.mockReturnValue(mocks.mockQueryBuilder);

    mocks.mocks.from.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mocks.where.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mocks.limit.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mocks.offset.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mocks.orderBy.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mocks.values.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mocks.set.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mocks.returning.mockReturnValue(mocks.mockQueryBuilder);
  });

  describe("findByEmail", () => {
    it("finds user by email", async () => {
      const mockUser = { id: "1", email: "test@example.com" };
      mocks.mocks.then.mockImplementation((resolve: any) => resolve([mockUser]));

      const result = await repository.findByEmail("test@example.com");
      expect(result).toEqual(mockUser);
    });
  });

  describe("create", () => {
    it("creates a user", async () => {
      const newUser = { id: "1", email: "test@example.com" };
      mocks.mocks.then.mockImplementation((resolve: any) => resolve([newUser]));

      const result = await repository.create({ email: "test@example.com" } as any);
      expect(result).toEqual(newUser);
    });
  });

  describe("update", () => {
    it("updates a user", async () => {
      const updatedUser = { id: "1", name: "Updated" };
      mocks.mocks.then.mockImplementation((resolve: any) => resolve([updatedUser]));

      const result = await repository.update("1", { name: "Updated" });
      expect(result).toEqual(updatedUser);
    });
  });

  describe("findByRole", () => {
    it("finds users by role", async () => {
      const mockUsers = [{ id: "1", role: "customer" }];
      mocks.mocks.then.mockImplementation((resolve: any) => resolve(mockUsers));

      const result = await repository.findByRole("customer");
      expect(result).toEqual(mockUsers);
    });
  });

  describe("verifyEmail", () => {
    it("verifies email", async () => {
      const updatedUser = { id: "1", email_verified: true };
      mocks.mocks.then.mockImplementation((resolve: any) => resolve([updatedUser]));

      const result = await repository.verifyEmail("1");
      expect(result).toEqual(updatedUser);
    });
  });

  describe("updateAvatar", () => {
    it("updates avatar", async () => {
      const updatedUser = { id: "1", avatar_url: "url" };
      mocks.mocks.then.mockImplementation((resolve: any) => resolve([updatedUser]));

      const result = await repository.updateAvatar("1", "url");
      expect(result).toEqual(updatedUser);
    });
  });

  describe("updateProfile", () => {
    it("updates profile", async () => {
      const updatedUser = { id: "1", name: "New Name" };
      mocks.mocks.then.mockImplementation((resolve: any) => resolve([updatedUser]));

      const result = await repository.updateProfile("1", { name: "New Name" });
      expect(result).toEqual(updatedUser);
    });
  });

  describe("emailExists", () => {
    it("returns true if email exists", async () => {
      mocks.mocks.then.mockImplementation((resolve: any) => resolve([{ id: "1" }]));
      const result = await repository.emailExists("test@example.com");
      expect(result).toBe(true);
    });

    it("returns false if email does not exist", async () => {
      mocks.mocks.then.mockImplementation((resolve: any) => resolve([]));
      const result = await repository.emailExists("test@example.com");
      expect(result).toBe(false);
    });
  });

  describe("getAdminUsers", () => {
    it("gets admin users", async () => {
      const staff = [{ id: "1", role: "staff" }];
      const managers = [{ id: "2", role: "manager" }];
      const owners = [{ id: "3", role: "owner" }];

      mocks.mocks.then
        .mockImplementationOnce((resolve: any) => resolve(staff))
        .mockImplementationOnce((resolve: any) => resolve(managers))
        .mockImplementationOnce((resolve: any) => resolve(owners));

      const result = await repository.getAdminUsers();
      expect(result).toHaveLength(3);
      expect(result).toEqual([...staff, ...managers, ...owners]);
    });
  });

  describe("countCustomers", () => {
    it("counts customers", async () => {
      mocks.mocks.then.mockImplementation((resolve: any) => resolve([{ count: 10 }]));
      const result = await repository.countCustomers();
      expect(result).toBe(10);
    });
  });

  describe("findPaginated", () => {
    it("returns paginated users", async () => {
      const mockUsers = [{ id: "1" }];
      mocks.mocks.then
        .mockImplementationOnce((resolve: any) => resolve(mockUsers)) // data
        .mockImplementationOnce((resolve: any) => resolve([{ count: 1 }])); // total

      const result = await repository.findPaginated(10, 0);
      expect(result.data).toEqual(mockUsers);
      expect(result.total).toBe(1);
    });
  });
});
