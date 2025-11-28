import { describe, it, expect } from "vitest";
import { insertNewsPostSchema, updateNewsPostSchema } from "../news";

describe("News Validators", () => {
  describe("insertNewsPostSchema", () => {
    const validNews = {
      title: "New Bakery Opening",
      slug: "new-bakery-opening",
      content: "<p>We're excited to announce...</p>",
      excerpt: "We're excited to announce our new location",
      is_published: true,
      author_id: "123e4567-e89b-12d3-a456-426614174000",
    };

    it("should validate a correct news post", () => {
      const result = insertNewsPostSchema.safeParse(validNews);
      expect(result.success).toBe(true);
    });

    it("should fail if title is empty", () => {
      const result = insertNewsPostSchema.safeParse({
        ...validNews,
        title: "",
      });
      expect(result.success).toBe(false);
    });

    it("should fail if slug has invalid format", () => {
      const result = insertNewsPostSchema.safeParse({
        ...validNews,
        slug: "Invalid Slug!",
      });
      expect(result.success).toBe(false);
    });

    it("should allow valid slug formats", () => {
      const validSlugs = ["simple-slug", "slug-with-numbers-123", "another-valid-slug"];

      validSlugs.forEach((slug) => {
        const result = insertNewsPostSchema.safeParse({ ...validNews, slug });
        expect(result.success).toBe(true);
      });
    });

    it("should allow optional fields", () => {
      const result = insertNewsPostSchema.safeParse({
        title: "Minimal News",
        slug: "minimal-news",
        content: "Content",
        author_id: "123e4567-e89b-12d3-a456-426614174000",
      });
      expect(result.success).toBe(true);
    });

    it("should allow optional image_url", () => {
      const result = insertNewsPostSchema.safeParse({
        ...validNews,
        image_url: "https://example.com/image.jpg",
      });
      expect(result.success).toBe(true);
    });

    it("should default is_published to false", () => {
      const result = insertNewsPostSchema.safeParse({
        title: "Draft News",
        slug: "draft-news",
        content: "Content",
        author_id: "123e4567-e89b-12d3-a456-426614174000",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.is_published).toBe(false);
      }
    });
  });

  describe("updateNewsPostSchema", () => {
    it("should allow partial updates", () => {
      const result = updateNewsPostSchema.safeParse({
        id: "123e4567-e89b-12d3-a456-426614174000",
        title: "Updated Title",
      });
      expect(result.success).toBe(true);
    });

    it("should require valid UUID for id", () => {
      const result = updateNewsPostSchema.safeParse({
        id: "invalid-uuid",
        title: "Updated Title",
      });
      expect(result.success).toBe(false);
    });

    it("should validate slug format in updates", () => {
      const result = updateNewsPostSchema.safeParse({
        id: "123e4567-e89b-12d3-a456-426614174000",
        slug: "Invalid Slug!",
      });
      expect(result.success).toBe(false);
    });
  });
});
