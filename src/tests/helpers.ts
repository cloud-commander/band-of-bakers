/**
 * Test Helpers
 *
 * Reusable utilities for testing across the application.
 */

import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";

/**
 * Custom render function that wraps components with necessary providers
 *
 * @example
 * ```ts
 * const { getByText } = renderWithProviders(<MyComponent />);
 * ```
 */
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  // Add providers here when needed (e.g., CartContext, ThemeProvider, etc.)
  // For now, just use standard render
  return render(ui, options);
}

/**
 * Generate mock form data for testing
 */
export function createMockFormData(data: Record<string, string | Blob>): FormData {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
}

/**
 * Wait for async operations to complete
 */
export async function waitForAsync() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Mock product data for tests
 */
export const mockProduct = {
  id: "test-product-1",
  name: "Test Sourdough Bread",
  slug: "test-sourdough-bread",
  description: "A delicious test bread",
  price: 5.99,
  category_id: "test-category-1",
  image_url: "/images/test-bread.jpg",
  is_active: true,
  stock: 10,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Mock user data for tests
 */
export const mockUser = {
  id: "test-user-1",
  email: "test@example.com",
  name: "Test User",
  role: "user" as const,
  email_verified: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Mock admin user data for tests
 */
export const mockAdmin = {
  ...mockUser,
  id: "test-admin-1",
  email: "admin@example.com",
  name: "Test Admin",
  role: "admin" as const,
};

/**
 * Common XSS attack vectors for testing sanitization
 */
export const XSS_ATTACK_VECTORS = [
  '<script>alert("XSS")</script>',
  '<img src=x onerror=alert("XSS")>',
  '<svg/onload=alert("XSS")>',
  "<a href=\"javascript:alert('XSS')\">Click</a>",
  "<iframe src=\"javascript:alert('XSS')\">",
  '<body onload=alert("XSS")>',
  '<input onfocus=alert("XSS") autofocus>',
  '<select onfocus=alert("XSS") autofocus>',
  '<textarea onfocus=alert("XSS") autofocus>',
  '<marquee onstart=alert("XSS")>',
];

/**
 * Common SQL injection attack vectors for testing
 */
export const SQL_INJECTION_VECTORS = [
  "' OR '1'='1",
  "'; DROP TABLE users--",
  "' UNION SELECT * FROM users--",
  "admin'--",
  "' OR 1=1--",
];

/**
 * Path traversal attack vectors for testing
 */
export const PATH_TRAVERSAL_VECTORS = [
  "../../../etc/passwd",
  "..\\..\\..\\windows\\system32",
  "....//....//....//etc/passwd",
  "../../../../../../../../../../etc/passwd",
];

/**
 * Mock successful server action response
 */
export function mockSuccessResponse<T>(data: T) {
  return {
    success: true as const,
    data,
  };
}

/**
 * Mock failed server action response
 */
export function mockErrorResponse(error: string) {
  return {
    success: false as const,
    error,
  };
}
