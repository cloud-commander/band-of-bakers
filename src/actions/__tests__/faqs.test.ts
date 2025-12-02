import { describe, it, expect, beforeEach, vi } from "vitest";
import { createFaq, getFaqs, getPublicFaqs, updateFaq, deleteFaq, toggleFaqStatus } from "../faqs";

// Mock database calls
const mockDb = {
  select: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

vi.mock("@/lib/db", () => ({
  getDb: vi.fn(() => Promise.resolve(mockDb)),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock CSRF
vi.mock("@/lib/csrf", () => ({
  requireCsrf: vi.fn().mockResolvedValue(true),
  CsrfError: class extends Error {},
}));

describe("FAQ Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock implementations
    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue([]),
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue([]),
        }),
      }),
    });
    mockDb.insert.mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([]),
      }),
    });
    mockDb.update.mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      }),
    });
    mockDb.delete.mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    });
  });

  describe("getFaqs", () => {
    it("should fetch all FAQs", async () => {
      const mockFaqs = [{ id: "1", question: "Q1" }];
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue(mockFaqs),
        }),
      });

      const result = await getFaqs();
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockFaqs);
      }
    });

    it("should handle errors", async () => {
      mockDb.select.mockImplementation(() => {
        throw new Error("DB Error");
      });
      const result = await getFaqs();
      expect(result.success).toBe(false);
    });
  });

  describe("getPublicFaqs", () => {
    it("should fetch public FAQs", async () => {
      const mockFaqs = [{ id: "1", question: "Q1", is_active: true }];
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue(mockFaqs),
          }),
        }),
      });

      const result = await getPublicFaqs();
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockFaqs);
      }
    });

    it("should handle errors", async () => {
      mockDb.select.mockImplementation(() => {
        throw new Error("DB Error");
      });
      const result = await getPublicFaqs();
      expect(result.success).toBe(false);
    });
  });

  describe("createFaq", () => {
    it("should create an FAQ", async () => {
      const mockFaq = { id: "1", question: "Q?", answer: "A.", sort_order: 0, is_active: true };
      mockDb.insert.mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockFaq]),
        }),
      });

      const result = await createFaq({ question: "Q?", answer: "A." });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockFaq);
      }
    });

    it("should handle errors", async () => {
      mockDb.insert.mockImplementation(() => {
        throw new Error("DB Error");
      });
      const result = await createFaq({ question: "Q?", answer: "A." });
      expect(result.success).toBe(false);
    });
  });

  describe("updateFaq", () => {
    it("should update an FAQ", async () => {
      const mockFaq = { id: "1", question: "Updated Q" };
      mockDb.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([mockFaq]),
          }),
        }),
      });

      const result = await updateFaq("1", { question: "Updated Q" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockFaq);
      }
    });

    it("should handle errors", async () => {
      mockDb.update.mockImplementation(() => {
        throw new Error("DB Error");
      });
      const result = await updateFaq("1", { question: "Updated Q" });
      expect(result.success).toBe(false);
    });
  });

  describe("deleteFaq", () => {
    it("should delete an FAQ", async () => {
      const result = await deleteFaq("1");
      expect(result.success).toBe(true);
      expect(mockDb.delete).toHaveBeenCalled();
    });

    it("should handle errors", async () => {
      mockDb.delete.mockImplementation(() => {
        throw new Error("DB Error");
      });
      const result = await deleteFaq("1");
      expect(result.success).toBe(false);
    });
  });

  describe("toggleFaqStatus", () => {
    it("should toggle FAQ status", async () => {
      const mockFaq = { id: "1", is_active: false };
      mockDb.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([mockFaq]),
          }),
        }),
      });

      const result = await toggleFaqStatus("1", false);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockFaq);
      }
    });

    it("should handle errors", async () => {
      mockDb.update.mockImplementation(() => {
        throw new Error("DB Error");
      });
      const result = await toggleFaqStatus("1", false);
      expect(result.success).toBe(false);
    });
  });
});
