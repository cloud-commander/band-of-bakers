import { describe, it, expect } from "vitest";
import { insertBakeSaleSchema, insertLocationSchema } from "./bake-sale";

describe("insertBakeSaleSchema", () => {
  const validBakeSale = {
    date: "2025-12-25",
    location_id: "123e4567-e89b-12d3-a456-426614174000",
    cutoff_datetime: "2025-12-24T12:00:00Z",
    is_active: true,
  };

  it("should validate a correct bake sale", () => {
    const result = insertBakeSaleSchema.safeParse(validBakeSale);
    expect(result.success).toBe(true);
  });

  it("should fail if cutoff is after the bake sale date", () => {
    const result = insertBakeSaleSchema.safeParse({
      ...validBakeSale,
      date: "2025-12-25",
      cutoff_datetime: "2025-12-26T12:00:00Z",
    });
    expect(result.success).toBe(false);
  });

  it("should fail if location_id is invalid", () => {
    const result = insertBakeSaleSchema.safeParse({
      ...validBakeSale,
      location_id: "invalid-uuid",
    });
    expect(result.success).toBe(false);
  });

  it("should fail if date format is invalid", () => {
    const result = insertBakeSaleSchema.safeParse({
      ...validBakeSale,
      date: "25-12-2025", // Wrong format
    });
    expect(result.success).toBe(false);
  });
});

describe("insertLocationSchema", () => {
  const validLocation = {
    name: "Community Hall",
    address_line1: "123 High Street",
    city: "London",
    postcode: "SW1A 1AA",
    is_active: true,
  };

  it("should validate a correct location", () => {
    const result = insertLocationSchema.safeParse(validLocation);
    expect(result.success).toBe(true);
  });

  it("should validate various UK postcode formats", () => {
    const postcodes = ["M1 1AA", "M60 1NW", "CR2 6XH", "DN55 1PT", "W1A 1HQ", "EC1A 1BB"];
    postcodes.forEach((postcode) => {
      const result = insertLocationSchema.safeParse({ ...validLocation, postcode });
      expect(result.success).toBe(true);
    });
  });

  it("should fail for invalid postcodes", () => {
    const invalidPostcodes = ["12345", "ABC DEF", "SW1", ""];
    invalidPostcodes.forEach((postcode) => {
      const result = insertLocationSchema.safeParse({ ...validLocation, postcode });
      expect(result.success).toBe(false);
    });
  });

  it("should fail if required fields are missing", () => {
    const result = insertLocationSchema.safeParse({
      name: "Incomplete Location",
    });
    expect(result.success).toBe(false);
  });
});
