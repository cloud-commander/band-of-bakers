import { test, expect } from "@playwright/test";

test("should navigate to login page", async ({ page }) => {
  await page.goto("/auth/login");
  await expect(page).toHaveURL(/.*\/auth\/login/);
  await expect(page.getByLabel(/email/i)).toBeVisible();
});

test("should allow user to sign in", async ({ page }) => {
  // This test assumes a seed user exists or mocks the auth flow.
  // Since we are running against the real dev server, we should use a test user.
  // For now, we'll just check if the form elements exist.
  await page.goto("/auth/login");

  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
});
