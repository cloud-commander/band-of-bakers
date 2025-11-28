import { describe, it, expect } from "vitest";
import { insertNewsSchema, updateNewsSchema } from "../news";

describe("News Validators", () => {
  describe("insertNewsSchema", () => {
    const validNews = {
      title: "New Bakery Opening",
      slug: "new-bakery-opening",
      content: "<p>We're excited to announce...</p>",
      excerpt: "We're excited to announce our new location",
      is_published: true,
    };

    it("should validate a correct news post", () => {
      const result = insertNewsSchema.safeParse(validNews);
      expect(result.success).toBe(true);
    });

    it("should fail if title is empty", () => {
      const result = insertNewsSchema.safeParse({
        ...validNews,
        title: "",
      });
      expect(result.success).toBe(false);
    });

    it("should fail if slug has invalid format", () => {
      const result = insertNewsSchema.safeParse({
        ...validNews,
        slug: "Invalid Slug!",
      });
      expect(result.success).toBe(false);
    });

    it("should allow valid slug formats", () => {
      const validSlugs = [
        "simple-slug",
        "slug-with-numbers-123",
        "another-valid-slug",
      ];

      validSlugs.forEach((slug) => {
        const result = insertNewsSchema.safeParse({ ...validNews, slug });
        expect(result.success).toBe(true);
      });
    });

    it("should allow optional fields", () => {
      const result = insertNewsSchema.safeParse({
        title: "Minimal News",
        slug: "minimal-news",
        content: "Content",
      });
      expect(result.success).toBe(true);
    });

    it("should allow optional image_url", () => {
      const result = insertNewsSchema.safeParse({
        ...validNews,
        image_url: "https://example.com/image.jpg",
      });
      expect(result.success).toBe(true);
    });

    it("should default is_published to false", () => {
      const result = insertNewsSchema.safeParse({
        title: "Draft News",
        slug: "draft-news",
        content: "Content",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.is_published).toBe(false);
      }
    });
  });

  describe("updateNewsSchema", () => {
    it("should allow partial updates", () => {
      const result = updateNewsSchema.safeParse({
        id: "123e4567-e89b-12d3-a456-426614174000",
        title: "Updated Title",
      });
      expect(result.success).toBe(true);
    });

    it("should require valid UUID for id", () => {
      const result = updateNewsSchema.safeParse({
        id: "invalid-uuid",
        title: "Updated Title",
      });
      expect(result.success).toBe(false);
    });

    it("should validate slug format in updates", () => {
      const result = updateNewsSchema.safeParse({
        id: "123e4567-e89b-12d3-a456-426614174000",
        slug: "Invalid Slug!",
      });
      expect(result.success).toBe(false);
    });
  });
});
