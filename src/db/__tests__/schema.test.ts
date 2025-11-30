import { describe, it, expect } from "vitest";
import * as schema from "../schema";
import { getTableConfig } from "drizzle-orm/sqlite-core";

describe("Database Schema", () => {
  it("should export all required tables", () => {
    const tables = [
      "users",
      "productCategories",
      "products",
      "productVariants",
      "locations",
      "bakeSales",
      "orders",
      "orderItems",
      "vouchers",
      "newsPosts",
      "images",
      "reviews",
      "testimonials",
      "emailTemplates",
      "settings",
    ];

    tables.forEach((table) => {
      expect(schema).toHaveProperty(table);
      // Verify it's a table by checking for a known property or using getTableConfig
      const tableObj = (schema as any)[table];
      expect(getTableConfig(tableObj)).toBeDefined();
    });
  });

  it("should define relations", () => {
    expect(schema.ordersRelations).toBeDefined();
    expect(schema.orderItemsRelations).toBeDefined();
    expect(schema.bakeSalesRelations).toBeDefined();
  });

  it("should have correct table names", () => {
    expect(getTableConfig(schema.users).name).toBe("users");
    expect(getTableConfig(schema.products).name).toBe("products");
    expect(getTableConfig(schema.orders).name).toBe("orders");
  });
});
