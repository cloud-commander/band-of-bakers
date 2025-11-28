import { test, expect } from "@playwright/test";

test("should load homepage", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Band of Bakers/i);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("should display featured products", async ({ page }) => {
  await page.goto("/");
  // Assuming there's a section for featured products or just products
  // We can look for product cards
  // Or just check that the main content area loads
  await expect(page.locator("#bakes")).toBeVisible();
});
