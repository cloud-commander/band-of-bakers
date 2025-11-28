import { describe, it, expect } from "vitest";
import { insertReviewSchema, updateReviewSchema, approveReviewSchema } from "../review";

describe("Review Validators", () => {
  describe("insertReviewSchema", () => {
    const validReview = {
      user_id: "123e4567-e89b-12d3-a456-426614174000",
      product_id: "123e4567-e89b-12d3-a456-426614174001",
      rating: 5,
      title: "Excellent product",
      content: "This is a great product. I highly recommend it to everyone!",
    };

    it("should validate a correct review", () => {
      const result = insertReviewSchema.safeParse(validReview);
      expect(result.success).toBe(true);
    });

    it("should fail if user_id is invalid UUID", () => {
      const result = insertReviewSchema.safeParse({
        ...validReview,
        user_id: "not-a-uuid",
      });
      expect(result.success).toBe(false);
    });

    it("should fail if product_id is invalid UUID", () => {
      const result = insertReviewSchema.safeParse({
        ...validReview,
        product_id: "invalid-uuid",
      });
      expect(result.success).toBe(false);
    });

    it("should fail if rating is less than 1", () => {
      const result = insertReviewSchema.safeParse({
        ...validReview,
        rating: 0,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("at least 1");
      }
    });

    it("should fail if rating is greater than 5", () => {
      const result = insertReviewSchema.safeParse({
        ...validReview,
        rating: 6,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("cannot exceed 5");
      }
    });

    it("should accept ratings from 1 to 5", () => {
      [1, 2, 3, 4, 5].forEach((rating) => {
        const result = insertReviewSchema.safeParse({
          ...validReview,
          rating,
        });
        expect(result.success).toBe(true);
      });
    });

    it("should fail if rating is not an integer", () => {
      const result = insertReviewSchema.safeParse({
        ...validReview,
        rating: 3.5,
      });
      expect(result.success).toBe(false);
    });

    it("should allow review without title (optional)", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { title, ...reviewWithoutTitle } = validReview;
      const result = insertReviewSchema.safeParse(reviewWithoutTitle);
      expect(result.success).toBe(true);
    });

    it("should fail if title is too short (less than 3 characters)", () => {
      const result = insertReviewSchema.safeParse({
        ...validReview,
        title: "AB",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("at least 3 characters");
      }
    });

    it("should fail if title is too long (over 100 characters)", () => {
      const result = insertReviewSchema.safeParse({
        ...validReview,
        title: "A".repeat(101),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("too long");
      }
    });

    it("should accept null title", () => {
      const result = insertReviewSchema.safeParse({
        ...validReview,
        title: null,
      });
      expect(result.success).toBe(true);
    });

    it("should fail if content is too short (less than 10 characters)", () => {
      const result = insertReviewSchema.safeParse({
        ...validReview,
        content: "Short",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("at least 10 characters");
      }
    });

    it("should fail if content is too long (over 1000 characters)", () => {
      const result = insertReviewSchema.safeParse({
        ...validReview,
        content: "A".repeat(1001),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("too long");
      }
    });

    it("should accept minimum length content (10 characters)", () => {
      const result = insertReviewSchema.safeParse({
        ...validReview,
        content: "1234567890",
      });
      expect(result.success).toBe(true);
    });

    it("should accept maximum length content (1000 characters)", () => {
      const result = insertReviewSchema.safeParse({
        ...validReview,
        content: "A".repeat(1000),
      });
      expect(result.success).toBe(true);
    });
  });

  describe("updateReviewSchema", () => {
    const validUpdate = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      rating: 4,
      title: "Updated title",
      content: "This is an updated review content with more details.",
    };

    it("should validate a complete update", () => {
      const result = updateReviewSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it("should allow partial updates (only rating)", () => {
      const result = updateReviewSchema.safeParse({
        id: "123e4567-e89b-12d3-a456-426614174000",
        rating: 3,
      });
      expect(result.success).toBe(true);
    });

    it("should allow partial updates (only content)", () => {
      const result = updateReviewSchema.safeParse({
        id: "123e4567-e89b-12d3-a456-426614174000",
        content: "Updated content for the review.",
      });
      expect(result.success).toBe(true);
    });

    it("should require valid UUID for id", () => {
      const result = updateReviewSchema.safeParse({
        id: "invalid-uuid",
        rating: 4,
      });
      expect(result.success).toBe(false);
    });

    it("should fail if updated rating is out of range", () => {
      const result = updateReviewSchema.safeParse({
        id: "123e4567-e89b-12d3-a456-426614174000",
        rating: 10,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("cannot exceed 5");
      }
    });

    it("should fail if updated content is too short", () => {
      const result = updateReviewSchema.safeParse({
        id: "123e4567-e89b-12d3-a456-426614174000",
        content: "Short",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("at least 10 characters");
      }
    });
  });

  describe("approveReviewSchema", () => {
    it("should validate approval action", () => {
      const result = approveReviewSchema.safeParse({
        id: "123e4567-e89b-12d3-a456-426614174000",
        is_approved: true,
      });
      expect(result.success).toBe(true);
    });

    it("should validate rejection action", () => {
      const result = approveReviewSchema.safeParse({
        id: "123e4567-e89b-12d3-a456-426614174000",
        is_approved: false,
      });
      expect(result.success).toBe(true);
    });

    it("should fail if id is invalid UUID", () => {
      const result = approveReviewSchema.safeParse({
        id: "not-a-uuid",
        is_approved: true,
      });
      expect(result.success).toBe(false);
    });

    it("should fail if is_approved is missing", () => {
      const result = approveReviewSchema.safeParse({
        id: "123e4567-e89b-12d3-a456-426614174000",
      });
      expect(result.success).toBe(false);
    });

    it("should fail if is_approved is not a boolean", () => {
      const result = approveReviewSchema.safeParse({
        id: "123e4567-e89b-12d3-a456-426614174000",
        is_approved: "true",
      });
      expect(result.success).toBe(false);
    });
  });
});
