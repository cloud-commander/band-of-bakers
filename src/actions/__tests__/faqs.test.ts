import { describe, it, expect, beforeEach, vi } from "vitest";
import { createFaq } from "../faqs";

// Mock database calls
const mockDb = {
  select: vi.fn(() => ({
    from: vi.fn(() => ({
      orderBy: vi.fn(),
      where: vi.fn(() => ({
        orderBy: vi.fn(),
      })),
    })),
  })),
  insert: vi.fn(() => ({
    values: vi.fn(() => ({
      returning: vi.fn(),
    })),
  })),
  update: vi.fn(() => ({
    set: vi.fn(() => ({
      where: vi.fn(() => ({
        returning: vi.fn(),
      })),
    })),
  })),
  delete: vi.fn(() => ({
    where: vi.fn(),
  })),
};

vi.mock("@/lib/db", () => ({
  getDb: vi.fn(() => Promise.resolve(mockDb)),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("FAQ Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  // Add more tests as needed for other actions
});
