# Band of Bakers v2 - Refactor & Production Readiness Plan

**Based on**: Comprehensive Application Review (2025-11-26)
**Current Grade**: C+ (69/100)
**Target Grade**: A (90+/100)
**Estimated Timeline**: 6-8 weeks

---

## Executive Summary

This refactor plan addresses critical security, testing, and reliability gaps identified in the comprehensive review. The plan is organized into 5 phases, prioritizing production blockers first.

**Current Status**: ❌ NOT PRODUCTION READY
**Target Status**: ✅ PRODUCTION READY with comprehensive testing and monitoring

---

## 🚨 PHASE 0: IMMEDIATE SECURITY FIXES (Week 1 - Days 1-2)

**Status**: 🔴 CRITICAL - Must complete before any other work
**Goal**: Eliminate security vulnerabilities in version control

### Task 0.1: Remove Exposed Secrets ⚠️ URGENT

**Files to Fix**:
- [ ] `.env.example` - Replace real secrets with placeholders
- [ ] Review git history for accidentally committed `.env` files

**Actions**:
```bash
# 1. Update .env.example
NEXT_PUBLIC_BANDOFBAKERS_TURNSTILE_SITEKEY=your_sitekey_here
BANDOFBAKERS_TURNSTILE_SECRET_KEY=your_secret_here
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_HASH=your_account_hash_here

# 2. Search git history for secrets
git log --all --full-history --source -- .env
git log --all --full-history --source -- .env.local

# 3. If found, use BFG Repo Cleaner or git filter-branch
# WARNING: Requires force push, coordinate with team
```

**Secrets to Rotate**:
- [ ] Cloudflare Turnstile keys (sitekey + secret)
- [ ] Cloudflare account credentials
- [ ] Any API keys found in history
- [ ] Regenerate AUTH_SECRET

**Verification**:
```bash
# Ensure no secrets in repo
git grep -i "0x4AAAA"
git grep -i "2ce0e42b"
```

**Estimate**: 2 hours + rotation time

---

### Task 0.2: Add .env.local to .gitignore

**Current State**: `.env*` pattern exists but verify
**Action**: Ensure comprehensive coverage

```gitignore
# env files (can opt-in for committing if needed)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
!.env.example
```

**Estimate**: 10 minutes

---

### Task 0.3: Remove Debug Logging from Production Code

**Files to Clean**:
- [ ] `src/auth.ts` - Lines 97-110, 133, 137 (console.log statements)
- [ ] `src/app/error.tsx` - Line 15 (replace with proper logging)
- [ ] Search entire codebase for remaining console statements

**Search Command**:
```bash
grep -r "console\." src/ --exclude-dir=node_modules
```

**Replace With**:
```typescript
// Development only
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}

// Production
import { logger } from '@/lib/logger/server';
logger.info('Event occurred', { context });
```

**Estimate**: 3 hours

---

## 🔐 PHASE 1: SECURITY HARDENING (Week 1 - Days 3-5)

**Status**: 🔴 CRITICAL
**Goal**: Implement essential security controls

### Task 1.1: Implement Security Headers

**File**: `next.config.ts`

```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com",
              "frame-src 'self' https://accounts.google.com https://challenges.cloudflare.com",
            ].join('; ')
          },
        ],
      },
    ];
  },
  // ... rest of config
};
```

**Estimate**: 2 hours

---

### Task 1.2: Implement Rate Limiting

**New File**: `src/lib/rate-limit.ts`

```typescript
import { getCloudflareContext } from "@opennextjs/cloudflare";

interface RateLimitConfig {
  requests: number;
  window: number; // seconds
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  'auth:login': { requests: 5, window: 900 }, // 5 per 15 min
  'auth:register': { requests: 3, window: 3600 }, // 3 per hour
  'api:default': { requests: 100, window: 60 }, // 100 per minute
};

export async function checkRateLimit(
  identifier: string, // IP or user ID
  action: string
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const { env } = await getCloudflareContext();
  const config = RATE_LIMITS[action] || RATE_LIMITS['api:default'];

  const key = `ratelimit:${action}:${identifier}`;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - config.window;

  // Get current count from KV
  const data = await env.KV.get(key, 'json') || { count: 0, resetAt: now + config.window };

  if (data.resetAt < now) {
    // Window expired, reset
    data.count = 0;
    data.resetAt = now + config.window;
  }

  const allowed = data.count < config.requests;

  if (allowed) {
    data.count++;
    await env.KV.put(key, JSON.stringify(data), { expirationTtl: config.window });
  }

  return {
    allowed,
    remaining: Math.max(0, config.requests - data.count),
    resetAt: data.resetAt,
  };
}
```

**Update**: `middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import NextAuth from "next-auth";
import { authConfig } from "./src/auth.config";
import { checkRateLimit } from './src/lib/rate-limit';

export default async function middleware(request: NextRequest) {
  // Rate limiting for auth routes
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const action = request.nextUrl.pathname.includes('register')
      ? 'auth:register'
      : 'auth:login';

    const { allowed, remaining, resetAt } = await checkRateLimit(ip, action);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(resetAt - Math.floor(Date.now() / 1000)),
            'X-RateLimit-Remaining': String(remaining),
          }
        }
      );
    }
  }

  // Auth middleware
  return NextAuth(authConfig).auth(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

**Estimate**: 4 hours

---

### Task 1.3: Input Sanitization for User Content

**New File**: `src/lib/sanitize.ts`

```typescript
import DOMPurify from 'isomorphic-dompurify';

const ALLOWED_TAGS = {
  basic: ['b', 'i', 'em', 'strong', 'u', 'p', 'br'],
  rich: [
    'b', 'i', 'em', 'strong', 'u', 'p', 'br', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
  ],
};

const ALLOWED_ATTR = {
  basic: [],
  rich: {
    'a': ['href', 'title', 'target', 'rel'],
    'img': ['src', 'alt', 'title', 'width', 'height'],
  },
};

export function sanitizeHtml(
  dirty: string,
  level: 'basic' | 'rich' = 'basic'
): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ALLOWED_TAGS[level],
    ALLOWED_ATTR: level === 'rich' ? ALLOWED_ATTR.rich : ALLOWED_ATTR.basic,
    ALLOW_DATA_ATTR: false,
  });
}

export function sanitizeText(input: string): string {
  // Remove any HTML tags
  return input.replace(/<[^>]*>/g, '');
}

export function sanitizeFileName(filename: string): string {
  // Remove path traversal attempts and dangerous characters
  return filename
    .replace(/\.\./g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .substring(0, 255);
}
```

**Install Dependencies**:
```bash
pnpm add isomorphic-dompurify
pnpm add -D @types/dompurify
```

**Usage in Server Actions**:
```typescript
import { sanitizeHtml, sanitizeText } from '@/lib/sanitize';

export async function createNewsPost(formData: FormData) {
  const title = sanitizeText(formData.get('title') as string);
  const content = sanitizeHtml(formData.get('content') as string, 'rich');
  // ... save to database
}
```

**Estimate**: 3 hours

---

### Task 1.4: CSRF Protection for Server Actions

**New File**: `src/lib/csrf.ts`

```typescript
import { headers } from 'next/headers';

export async function validateCsrf(): Promise<boolean> {
  const headersList = headers();
  const origin = headersList.get('origin');
  const referer = headersList.get('referer');

  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL || 'https://bandofbakers.co.uk',
    'http://localhost:3000', // Development
  ];

  // Check origin header
  if (origin && !allowedOrigins.some(allowed => origin.startsWith(allowed))) {
    return false;
  }

  // Check referer header
  if (referer && !allowedOrigins.some(allowed => referer.startsWith(allowed))) {
    return false;
  }

  return true;
}

export class CsrfError extends Error {
  constructor() {
    super('Invalid request origin');
    this.name = 'CsrfError';
  }
}
```

**Usage**:
```typescript
'use server';

import { validateCsrf, CsrfError } from '@/lib/csrf';

export async function registerUser(formData: FormData) {
  if (!await validateCsrf()) {
    throw new CsrfError();
  }

  // ... rest of logic
}
```

**Estimate**: 2 hours

---

## 🧪 PHASE 2: TESTING INFRASTRUCTURE (Week 2)

**Status**: 🔴 CRITICAL
**Goal**: Establish comprehensive testing with 80%+ coverage

### Task 2.1: Setup Testing Framework

**Install Dependencies**:
```bash
pnpm add -D vitest @vitest/ui @vitest/coverage-v8
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
pnpm add -D @playwright/test
pnpm add -D jsdom happy-dom
```

**New File**: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/app/**', // Page files tested via E2E
        'src/types/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**New File**: `tests/setup.ts`

```typescript
import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next Auth
vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
  signIn: vi.fn(),
  signOut: vi.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));
```

**New File**: `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Update**: `package.json`

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

**Estimate**: 4 hours

---

### Task 2.2: Unit Tests - Validators (100% Coverage Target)

**Priority**: CRITICAL (validates all data entering system)

**Test Files to Create**:
- [ ] `src/lib/validators/auth.test.ts`
- [ ] `src/lib/validators/product.test.ts`
- [ ] `src/lib/validators/order.test.ts`
- [ ] `src/lib/validators/user.test.ts`
- [ ] `src/lib/validators/news.test.ts`
- [ ] `src/lib/validators/review.test.ts`
- [ ] `src/lib/validators/testimonial.test.ts`
- [ ] `src/lib/validators/voucher.test.ts`
- [ ] `src/lib/validators/bake-sale.test.ts`
- [ ] `src/lib/validators/settings.test.ts`

**Example**: `src/lib/validators/product.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import {
  productSchema,
  insertProductSchema,
  updateProductSchema,
  productCategorySchema,
  productVariantSchema,
} from './product';

describe('productSchema', () => {
  const validProduct = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    category_id: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Sourdough Bread',
    slug: 'sourdough-bread',
    description: 'Artisan sourdough made with organic flour',
    base_price: 4.50,
    image_url: 'https://example.com/bread.jpg',
    is_active: true,
    stock_quantity: 10,
    available_from: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  describe('valid data', () => {
    it('should accept valid product', () => {
      expect(() => productSchema.parse(validProduct)).not.toThrow();
    });

    it('should accept product without optional fields', () => {
      const minimal = {
        ...validProduct,
        description: null,
        image_url: null,
        stock_quantity: null,
        available_from: null,
      };
      expect(() => productSchema.parse(minimal)).not.toThrow();
    });
  });

  describe('invalid data', () => {
    it('should reject invalid UUID', () => {
      const invalid = { ...validProduct, id: 'not-a-uuid' };
      expect(() => productSchema.parse(invalid)).toThrow();
    });

    it('should reject empty name', () => {
      const invalid = { ...validProduct, name: '' };
      expect(() => productSchema.parse(invalid)).toThrow('Product name is required');
    });

    it('should reject invalid slug format', () => {
      const invalid = { ...validProduct, slug: 'Invalid Slug!' };
      expect(() => productSchema.parse(invalid)).toThrow('Invalid slug format');
    });

    it('should reject negative price', () => {
      const invalid = { ...validProduct, base_price: -1 };
      expect(() => productSchema.parse(invalid)).toThrow('Price must be positive');
    });

    it('should reject zero price', () => {
      const invalid = { ...validProduct, base_price: 0 };
      expect(() => productSchema.parse(invalid)).toThrow('Price must be positive');
    });

    it('should reject invalid URL', () => {
      const invalid = { ...validProduct, image_url: 'not-a-url' };
      expect(() => productSchema.parse(invalid)).toThrow();
    });
  });
});

describe('insertProductSchema', () => {
  it('should not require id and timestamps', () => {
    const valid = {
      category_id: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Croissant',
      slug: 'croissant',
      base_price: 2.50,
      is_active: true,
    };
    expect(() => insertProductSchema.parse(valid)).not.toThrow();
  });
});

describe('updateProductSchema', () => {
  it('should allow partial updates', () => {
    const valid = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Updated Name',
    };
    expect(() => updateProductSchema.parse(valid)).not.toThrow();
  });

  it('should require id', () => {
    const invalid = { name: 'Updated Name' };
    expect(() => updateProductSchema.parse(invalid)).toThrow();
  });
});

describe('productVariantSchema', () => {
  const validVariant = {
    id: '123e4567-e89b-12d3-a456-426614174002',
    product_id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Large',
    price_adjustment: 1.50,
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  it('should accept valid variant', () => {
    expect(() => productVariantSchema.parse(validVariant)).not.toThrow();
  });

  it('should default price_adjustment to 0', () => {
    const parsed = productVariantSchema.parse({
      ...validVariant,
      price_adjustment: undefined,
    });
    expect(parsed.price_adjustment).toBe(0);
  });
});
```

**Estimate**: 16 hours (2 days)

---

### Task 2.3: Unit Tests - Utilities

**Test Files to Create**:
- [ ] `src/lib/sanitize.test.ts`
- [ ] `src/lib/csrf.test.ts`
- [ ] `src/lib/rate-limit.test.ts`
- [ ] `src/lib/utils.test.ts`
- [ ] `src/lib/auth/sync-user.test.ts`

**Example**: `src/lib/sanitize.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { sanitizeHtml, sanitizeText, sanitizeFileName } from './sanitize';

describe('sanitizeHtml', () => {
  describe('basic level', () => {
    it('should allow safe tags', () => {
      const input = '<p>Hello <strong>world</strong></p>';
      const output = sanitizeHtml(input, 'basic');
      expect(output).toBe(input);
    });

    it('should remove script tags', () => {
      const input = '<p>Hello</p><script>alert("xss")</script>';
      const output = sanitizeHtml(input, 'basic');
      expect(output).not.toContain('script');
      expect(output).not.toContain('alert');
    });

    it('should remove event handlers', () => {
      const input = '<p onclick="alert(1)">Click me</p>';
      const output = sanitizeHtml(input, 'basic');
      expect(output).not.toContain('onclick');
    });

    it('should remove dangerous tags', () => {
      const input = '<p>Safe</p><iframe src="evil.com"></iframe>';
      const output = sanitizeHtml(input, 'basic');
      expect(output).not.toContain('iframe');
    });
  });

  describe('rich level', () => {
    it('should allow headings', () => {
      const input = '<h1>Title</h1><p>Content</p>';
      const output = sanitizeHtml(input, 'rich');
      expect(output).toContain('<h1>');
    });

    it('should allow links with safe attributes', () => {
      const input = '<a href="https://example.com" title="Link">Click</a>';
      const output = sanitizeHtml(input, 'rich');
      expect(output).toContain('href');
    });

    it('should still remove scripts', () => {
      const input = '<h1>Title</h1><script>alert(1)</script>';
      const output = sanitizeHtml(input, 'rich');
      expect(output).not.toContain('script');
    });
  });
});

describe('sanitizeText', () => {
  it('should remove all HTML tags', () => {
    const input = '<p>Hello <strong>world</strong></p>';
    const output = sanitizeText(input);
    expect(output).toBe('Hello world');
  });

  it('should handle nested tags', () => {
    const input = '<div><p><span>Text</span></p></div>';
    const output = sanitizeText(input);
    expect(output).toBe('Text');
  });
});

describe('sanitizeFileName', () => {
  it('should remove path traversal attempts', () => {
    const input = '../../../etc/passwd';
    const output = sanitizeFileName(input);
    expect(output).not.toContain('..');
  });

  it('should replace special characters', () => {
    const input = 'my file!@#$%.txt';
    const output = sanitizeFileName(input);
    expect(output).toMatch(/^[a-zA-Z0-9._-]+$/);
  });

  it('should limit length to 255 characters', () => {
    const input = 'a'.repeat(300) + '.txt';
    const output = sanitizeFileName(input);
    expect(output.length).toBeLessThanOrEqual(255);
  });
});
```

**Estimate**: 8 hours

---

### Task 2.4: Component Tests - Critical UI

**Test Files to Create**:
- [ ] `src/components/navbar.test.tsx`
- [ ] `src/components/cart-preview.test.tsx`
- [ ] `src/context/cart-context.test.tsx`
- [ ] `src/components/forms/product-form.test.tsx`
- [ ] `src/components/state/error-state.test.tsx`

**Example**: `src/components/navbar.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from './navbar';

// Mock dependencies
vi.mock('@/context/cart-context', () => ({
  useCart: () => ({ cartCount: 3 }),
}));

vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
  signOut: vi.fn(),
}));

describe('Navbar', () => {
  it('should render logo', () => {
    render(<Navbar />);
    expect(screen.getByAltText('Band of Bakers Logo')).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Shop')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('should show login button when not authenticated', () => {
    render(<Navbar />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('should show cart count badge', () => {
    render(<Navbar />);
    // Cart count is 3 from mock
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  describe('when authenticated', () => {
    beforeEach(() => {
      vi.mocked(useSession).mockReturnValue({
        data: {
          user: { name: 'John Doe', email: 'john@example.com' },
        },
        status: 'authenticated',
      });
    });

    it('should show user menu instead of login', () => {
      render(<Navbar />);
      expect(screen.queryByText('Login')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /user/i })).toBeInTheDocument();
    });
  });
});
```

**Estimate**: 12 hours

---

### Task 2.5: E2E Tests - Critical Flows

**Test Files to Create**:
- [ ] `tests/e2e/auth.spec.ts` - Login/signup flows
- [ ] `tests/e2e/cart.spec.ts` - Add to cart, checkout
- [ ] `tests/e2e/admin.spec.ts` - Admin CRUD operations
- [ ] `tests/e2e/navigation.spec.ts` - Page navigation

**Example**: `tests/e2e/cart.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Flow', () => {
  test('should add product to cart and checkout', async ({ page }) => {
    // Navigate to shop
    await page.goto('/menu');

    // Wait for products to load
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();

    // Add first product to cart
    await page.locator('[data-testid="add-to-cart-btn"]').first().click();

    // Verify cart badge updated
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');

    // Open cart
    await page.locator('[data-testid="cart-button"]').click();
    await expect(page.locator('[data-testid="cart-preview"]')).toBeVisible();

    // Proceed to checkout
    await page.locator('[data-testid="checkout-button"]').click();

    // Should redirect to login if not authenticated
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('should update cart quantity', async ({ page }) => {
    await page.goto('/cart');

    // Increase quantity
    await page.locator('[data-testid="increase-qty"]').first().click();

    // Verify total updated
    const total = await page.locator('[data-testid="cart-total"]').textContent();
    expect(total).toBeTruthy();
  });

  test('should remove item from cart', async ({ page }) => {
    await page.goto('/cart');

    const initialCount = await page.locator('[data-testid="cart-item"]').count();

    // Remove first item
    await page.locator('[data-testid="remove-item"]').first().click();

    // Confirm removal (if confirmation dialog exists)
    await page.locator('[data-testid="confirm-remove"]').click();

    // Verify item removed
    const newCount = await page.locator('[data-testid="cart-item"]').count();
    expect(newCount).toBe(initialCount - 1);
  });
});
```

**Estimate**: 16 hours (2 days)

---

## 📊 PHASE 3: OBSERVABILITY & MONITORING (Week 3)

**Status**: 🟡 HIGH PRIORITY
**Goal**: Implement comprehensive logging, error tracking, and monitoring

### Task 3.1: Server-Side Logging with Rollbar

**New File**: `src/lib/logger/server.ts`

```typescript
import Rollbar from 'rollbar';

interface LogContext {
  requestId?: string;
  userId?: string;
  action?: string;
  duration?: number;
  [key: string]: unknown;
}

class ServerLogger {
  private rollbar: Rollbar | null = null;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';

    if (process.env.ROLLBAR_SERVER_TOKEN) {
      this.rollbar = new Rollbar({
        accessToken: process.env.ROLLBAR_SERVER_TOKEN,
        environment: process.env.NODE_ENV || 'development',
        captureUncaught: true,
        captureUnhandledRejections: true,
        codeVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      });
    } else if (!this.isDevelopment) {
      console.warn('ROLLBAR_SERVER_TOKEN not configured');
    }
  }

  private formatMessage(message: string, context?: LogContext): string {
    if (!context) return message;

    const parts = [message];
    if (context.requestId) parts.push(`[${context.requestId}]`);
    if (context.userId) parts.push(`[user:${context.userId}]`);
    if (context.action) parts.push(`[${context.action}]`);

    return parts.join(' ');
  }

  info(message: string, context?: LogContext) {
    const formatted = this.formatMessage(message, context);

    if (this.isDevelopment) {
      console.info(formatted, context);
    }

    this.rollbar?.info(message, context);
  }

  warn(message: string, context?: LogContext) {
    const formatted = this.formatMessage(message, context);

    if (this.isDevelopment) {
      console.warn(formatted, context);
    }

    this.rollbar?.warning(message, context);
  }

  error(error: Error | string, context?: LogContext) {
    const formatted = this.formatMessage(
      error instanceof Error ? error.message : error,
      context
    );

    if (this.isDevelopment) {
      console.error(formatted, error, context);
    }

    if (error instanceof Error) {
      this.rollbar?.error(error, context);
    } else {
      this.rollbar?.error(new Error(error), context);
    }
  }

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      const formatted = this.formatMessage(message, context);
      console.debug(formatted, context);
    }
  }
}

export const logger = new ServerLogger();
```

**Update**: `src/app/error.tsx`

```typescript
'use client';

import { useEffect } from "react";
import { ErrorState } from "@/components/state/error-state";
import { useSession } from "next-auth/react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { data: session } = useSession();

  useEffect(() => {
    // Report to Rollbar
    if (typeof window !== 'undefined' && window.Rollbar) {
      window.Rollbar.error(error, {
        digest: error.digest,
        route: window.location.pathname,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
      });
    }
  }, [error, session]);

  return (
    <div className="container flex items-center justify-center min-h-[50vh]">
      <ErrorState
        title="Something went wrong!"
        message={error.message || "An unexpected error occurred. Please try again."}
        onRetry={reset}
        retryLabel="Try again"
      />
    </div>
  );
}
```

**Usage in Server Actions**:
```typescript
'use server';

import { logger } from '@/lib/logger/server';
import { nanoid } from 'nanoid';

export async function registerUser(formData: FormData) {
  const requestId = nanoid();
  const startTime = Date.now();

  try {
    logger.info('User registration started', {
      requestId,
      action: 'registerUser',
      email: formData.get('email'),
    });

    // ... registration logic

    logger.info('User registration successful', {
      requestId,
      action: 'registerUser',
      duration: Date.now() - startTime,
      userId: user.id,
    });

    return { success: true, user };
  } catch (error) {
    logger.error(error as Error, {
      requestId,
      action: 'registerUser',
      duration: Date.now() - startTime,
      formData: Object.fromEntries(formData),
    });

    throw new Error('Registration failed. Please try again.');
  }
}
```

**Estimate**: 6 hours

---

### Task 3.2: Implement Logflare Provider

**Update**: `src/components/analytics/logflare-provider.tsx`

```typescript
'use client';

import { useEffect } from 'react';

interface LogflareEvent {
  message: string;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

class LogflareClient {
  private apiKey: string;
  private sourceId: string;
  private debug: boolean;

  constructor(apiKey: string, sourceId: string, debug = false) {
    this.apiKey = apiKey;
    this.sourceId = sourceId;
    this.debug = debug;
  }

  async log(event: LogflareEvent) {
    try {
      const payload = {
        ...event,
        timestamp: event.timestamp || new Date().toISOString(),
        metadata: {
          ...event.metadata,
          userAgent: navigator.userAgent,
          url: window.location.href,
          referrer: document.referrer,
        },
      };

      const response = await fetch(
        `https://api.logflare.app/logs?source=${this.sourceId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': this.apiKey,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok && this.debug) {
        console.warn('Logflare log failed:', response.statusText);
      }
    } catch (error) {
      if (this.debug) {
        console.error('Logflare error:', error);
      }
    }
  }

  pageView(path: string) {
    this.log({
      message: 'page_view',
      metadata: { path, timestamp: Date.now() },
    });
  }

  event(eventName: string, properties?: Record<string, unknown>) {
    this.log({
      message: eventName,
      metadata: properties,
    });
  }
}

export function LogflareProvider() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const apiKey = process.env.NEXT_PUBLIC_LOGFLARE_API_KEY;
    const sourceId = process.env.NEXT_PUBLIC_LOGFLARE_SOURCE_ID;
    const debug = process.env.NEXT_PUBLIC_LOGFLARE_DEBUG === 'true';

    if (!apiKey || !sourceId) {
      if (debug) {
        console.warn('Logflare not configured');
      }
      return;
    }

    const client = new LogflareClient(apiKey, sourceId, debug);

    // Make globally available
    (window as any)._logflare = client;

    // Log initial page view
    client.pageView(window.location.pathname);

    // Log navigation
    const handleRouteChange = () => {
      client.pageView(window.location.pathname);
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return null;
}

// Declare global type
declare global {
  interface Window {
    _logflare?: LogflareClient;
  }
}
```

**Estimate**: 4 hours

---

### Task 3.3: Web Vitals Monitoring

**New File**: `src/lib/monitoring/web-vitals.ts`

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  // Send to Logflare
  if (window._logflare) {
    window._logflare.event('web_vital', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    });
  }

  // Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }
}

export function initWebVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}
```

**Update**: `src/app/layout.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { initWebVitals } from '@/lib/monitoring/web-vitals';

export default function RootLayout({ children }) {
  useEffect(() => {
    initWebVitals();
  }, []);

  return (
    // ... rest of layout
  );
}
```

**Install Dependency**:
```bash
pnpm add web-vitals
```

**Estimate**: 2 hours

---

### Task 3.4: Request ID Correlation

**Update**: `middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { nanoid } from 'nanoid';
import NextAuth from "next-auth";
import { authConfig } from "./src/auth.config";

export default async function middleware(request: NextRequest) {
  // Add request ID to headers
  const requestId = nanoid();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-request-id', requestId);

  // Clone request with new headers
  const modifiedRequest = new NextRequest(request, {
    headers: requestHeaders,
  });

  // Continue with auth and other middleware
  const response = await NextAuth(authConfig).auth(modifiedRequest);

  // Add request ID to response headers
  if (response) {
    response.headers.set('x-request-id', requestId);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

**Usage**: Access request ID in Server Actions

```typescript
import { headers } from 'next/headers';

export async function someAction() {
  const headersList = headers();
  const requestId = headersList.get('x-request-id');

  logger.info('Action called', { requestId });
}
```

**Install Dependency**:
```bash
pnpm add nanoid
```

**Estimate**: 2 hours

---

## ⚡ PHASE 4: PERFORMANCE OPTIMIZATION (Week 4)

**Status**: 🟡 MEDIUM PRIORITY
**Goal**: Optimize bundle size, implement code splitting, improve Core Web Vitals

### Task 4.1: Dynamic Imports for Heavy Components

**Files to Update**:

**src/app/(admin)/layout.tsx**:
```typescript
import dynamic from 'next/dynamic';

const TinyMCE = dynamic(() => import('@tinymce/tinymce-react'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded" />,
});
```

**src/components/navbar.tsx**:
```typescript
import dynamic from 'next/dynamic';

const MobileMenu = dynamic(() => import('./mobile-menu').then(mod => ({ default: mod.MobileMenu })), {
  ssr: false,
});

const CartPreview = dynamic(() => import('./cart-preview').then(mod => ({ default: mod.CartPreview })));
```

**Estimate**: 4 hours

---

### Task 4.2: React Performance Optimizations

**Files to Update**:

**src/components/navbar.tsx**:
```typescript
import { memo, useCallback, useMemo } from 'react';

export const Navbar = memo(function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount } = useCart();
  const { data: session } = useSession();

  // Memoize computed values
  const isLoggedIn = useMemo(() => !!session?.user, [session]);

  // Memoize scroll handler
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > UI_THRESHOLDS.SCROLL_NAVBAR);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // ... rest of component
});
```

**src/components/cart-preview.tsx**:
```typescript
import { memo } from 'react';

export const CartPreview = memo(function CartPreview() {
  // ... component implementation
});
```

**Guidelines for All Components**:
1. Wrap pure components with `memo()`
2. Use `useCallback` for event handlers passed as props
3. Use `useMemo` for expensive computations
4. Avoid inline object/array creation in render

**Estimate**: 8 hours

---

### Task 4.3: Bundle Analysis

**Install**:
```bash
pnpm add -D @next/bundle-analyzer
```

**Update**: `next.config.ts`

```typescript
import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import withBundleAnalyzer from '@next/bundle-analyzer';

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  // ... existing config
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzer(nextConfig);
```

**Add Script**: `package.json`

```json
{
  "scripts": {
    "analyze": "ANALYZE=true pnpm build"
  }
}
```

**Usage**:
```bash
pnpm analyze
# Opens bundle analyzer in browser
```

**Action Items from Analysis**:
- Identify largest dependencies
- Consider alternatives for heavy libraries
- Ensure tree-shaking is working
- Target: < 200KB initial JavaScript

**Estimate**: 3 hours

---

### Task 4.4: Image Optimization - Cloudflare Images Migration

**Current**: Using external CDNs (Unsplash, Pexels, etc.)
**Target**: Cloudflare Images with custom variants

**New File**: `src/lib/images.ts`

```typescript
const ACCOUNT_HASH = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_HASH;

export type ImageVariant = 'thumbnail' | 'small' | 'medium' | 'large' | 'card' | 'detail' | 'hero';

export function getCloudflareImageUrl(
  imageId: string,
  variant: ImageVariant = 'medium'
): string {
  if (!ACCOUNT_HASH) {
    throw new Error('CLOUDFLARE_IMAGES_ACCOUNT_HASH not configured');
  }

  return `https://imagedelivery.net/${ACCOUNT_HASH}/${imageId}/${variant}`;
}

export async function uploadToCloudflareImages(
  file: File
): Promise<{ id: string; url: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!data.success) {
    throw new Error('Image upload failed');
  }

  return {
    id: data.result.id,
    url: data.result.variants[0],
  };
}
```

**Migration Script**: `scripts/migrate-images.ts`

```typescript
import { getDb } from '@/lib/db';
import { products } from '@/db/schema';

async function migrateImages() {
  const db = await getDb();
  const allProducts = await db.select().from(products);

  for (const product of allProducts) {
    if (!product.image_url || product.image_url.includes('imagedelivery.net')) {
      continue; // Skip if already migrated or no image
    }

    console.log(`Migrating image for product: ${product.name}`);

    // Download image
    const response = await fetch(product.image_url);
    const blob = await response.blob();
    const file = new File([blob], 'product.jpg', { type: 'image/jpeg' });

    // Upload to Cloudflare
    const { id } = await uploadToCloudflareImages(file);

    // Update database
    await db.update(products)
      .set({ image_url: id }) // Store just the ID
      .where(eq(products.id, product.id));

    console.log(`✅ Migrated: ${product.name}`);
  }
}
```

**Component Usage**:
```typescript
import Image from 'next/image';
import { getCloudflareImageUrl } from '@/lib/images';

function ProductCard({ product }) {
  return (
    <Image
      src={getCloudflareImageUrl(product.image_url, 'card')}
      alt={product.name}
      width={600}
      height={400}
      loading="lazy"
    />
  );
}
```

**Estimate**: 8 hours

---

### Task 4.5: Loading States & Skeleton Loaders

**New Files**:

**src/app/(shop)/menu/loading.tsx**:
```typescript
export default function Loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 h-48 rounded-t-lg" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

**src/components/ui/skeleton.tsx**:
```typescript
import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
```

**Add loading.tsx to**:
- [ ] `src/app/(shop)/menu/loading.tsx`
- [ ] `src/app/(shop)/cart/loading.tsx`
- [ ] `src/app/(shop)/orders/loading.tsx`
- [ ] `src/app/(admin)/products/loading.tsx`

**Estimate**: 4 hours

---

## 🏗️ PHASE 5: CODE REFACTORING (Week 5)

**Status**: 🟢 NICE TO HAVE
**Goal**: Improve maintainability, reduce component complexity

### Task 5.1: Extract Navbar into Smaller Components

**Current**: 227 lines in single file
**Target**: <100 lines per file

**New Structure**:
```
src/components/navbar/
├── index.tsx          (main component, <100 lines)
├── desktop-nav.tsx    (desktop navigation links)
├── mobile-nav.tsx     (mobile menu)
├── user-menu.tsx      (user dropdown)
├── cart-button.tsx    (cart icon + badge)
└── search-bar.tsx     (search input)
```

**Example**: `src/components/navbar/user-menu.tsx`

```typescript
import { memo } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { User, LogOut, Package, UserCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export const UserMenu = memo(function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-red-50 hover:text-red-700"
        >
          <User className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/orders">
            <Package className="mr-2 h-4 w-4" />
            My Orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
```

**Estimate**: 6 hours

---

### Task 5.2: Extract Scroll Logic into Custom Hook

**New File**: `src/hooks/use-scroll-navbar.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';

interface UseScrollNavbarOptions {
  threshold?: number;
}

export function useScrollNavbar(options: UseScrollNavbarOptions = {}) {
  const { threshold = 10 } = options;
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setIsScrolled(scrollY > threshold);
  }, [threshold]);

  useEffect(() => {
    handleScroll(); // Check initial state
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return isScrolled;
}
```

**Usage**:
```typescript
export function Navbar() {
  const isScrolled = useScrollNavbar({ threshold: UI_THRESHOLDS.SCROLL_NAVBAR });
  // ... rest of component
}
```

**Estimate**: 1 hour

---

### Task 5.3: Repository Pattern for Data Access

**Current**: Direct database queries in Server Actions
**Target**: Centralized repository layer

**New Structure**:
```
src/lib/repositories/
├── base.repository.ts
├── user.repository.ts
├── product.repository.ts
├── order.repository.ts
└── index.ts
```

**Example**: `src/lib/repositories/base.repository.ts`

```typescript
import { getDb } from '@/lib/db';
import type { SQLiteTable } from 'drizzle-orm/sqlite-core';

export abstract class BaseRepository<T extends SQLiteTable> {
  constructor(protected table: T) {}

  protected async getDatabase() {
    return await getDb();
  }

  async findById(id: string) {
    const db = await this.getDatabase();
    return await db.query[this.table].findFirst({
      where: (table, { eq }) => eq(table.id, id),
    });
  }

  async findAll() {
    const db = await this.getDatabase();
    return await db.select().from(this.table);
  }

  async create(data: any) {
    const db = await this.getDatabase();
    return await db.insert(this.table).values(data).returning();
  }

  async update(id: string, data: any) {
    const db = await this.getDatabase();
    return await db.update(this.table)
      .set(data)
      .where(eq(this.table.id, id))
      .returning();
  }

  async delete(id: string) {
    const db = await this.getDatabase();
    return await db.delete(this.table).where(eq(this.table.id, id));
  }
}
```

**Example**: `src/lib/repositories/product.repository.ts`

```typescript
import { products, productVariants } from '@/db/schema';
import type { InsertProduct, Product } from '@/db/schema';
import { BaseRepository } from './base.repository';
import { eq } from 'drizzle-orm';

export class ProductRepository extends BaseRepository<typeof products> {
  constructor() {
    super(products);
  }

  async findBySlug(slug: string): Promise<Product | undefined> {
    const db = await this.getDatabase();
    return await db.query.products.findFirst({
      where: eq(products.slug, slug),
      with: {
        category: true,
        variants: true,
      },
    });
  }

  async findByCategoryId(categoryId: string): Promise<Product[]> {
    const db = await this.getDatabase();
    return await db.select()
      .from(products)
      .where(eq(products.category_id, categoryId));
  }

  async findActiveProducts(): Promise<Product[]> {
    const db = await this.getDatabase();
    return await db.select()
      .from(products)
      .where(eq(products.is_active, true));
  }

  async createWithVariants(
    product: InsertProduct,
    variants: InsertProductVariant[]
  ) {
    const db = await this.getDatabase();

    return await db.transaction(async (tx) => {
      const [newProduct] = await tx.insert(products).values(product).returning();

      if (variants.length > 0) {
        const variantsWithProductId = variants.map(v => ({
          ...v,
          product_id: newProduct.id,
        }));

        await tx.insert(productVariants).values(variantsWithProductId);
      }

      return newProduct;
    });
  }
}

export const productRepository = new ProductRepository();
```

**Usage in Server Actions**:
```typescript
'use server';

import { productRepository } from '@/lib/repositories';

export async function getProductBySlug(slug: string) {
  return await productRepository.findBySlug(slug);
}

export async function createProduct(data: InsertProduct, variants: InsertProductVariant[]) {
  return await productRepository.createWithVariants(data, variants);
}
```

**Estimate**: 12 hours

---

### Task 5.4: Service Layer for Business Logic

**New Structure**:
```
src/lib/services/
├── auth.service.ts
├── order.service.ts
├── payment.service.ts
└── email.service.ts
```

**Example**: `src/lib/services/order.service.ts`

```typescript
import { orderRepository } from '@/lib/repositories';
import { emailService } from './email.service';
import { logger } from '@/lib/logger/server';

export class OrderService {
  async createOrder(userId: string, items: CartItem[], data: CheckoutData) {
    const requestId = nanoid();

    try {
      logger.info('Creating order', { requestId, userId, itemCount: items.length });

      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const deliveryFee = data.fulfillmentMethod === 'delivery' ? 5.00 : 0;
      const total = subtotal + deliveryFee;

      // Create order in database
      const order = await orderRepository.create({
        user_id: userId,
        bake_sale_id: data.bakeSaleId,
        fulfillment_method: data.fulfillmentMethod,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        status: 'pending',
        payment_status: 'pending',
      });

      // Send confirmation email
      await emailService.sendOrderConfirmation(order);

      logger.info('Order created successfully', {
        requestId,
        orderId: order.id,
        total,
      });

      return order;
    } catch (error) {
      logger.error(error as Error, { requestId, action: 'createOrder', userId });
      throw error;
    }
  }

  async cancelOrder(orderId: string, userId: string, reason?: string) {
    // Verify ownership
    const order = await orderRepository.findById(orderId);
    if (!order) throw new Error('Order not found');
    if (order.user_id !== userId) throw new Error('Unauthorized');

    // Check if cancellable
    if (!['pending', 'processing'].includes(order.status)) {
      throw new Error('Order cannot be cancelled');
    }

    // Update status
    const updated = await orderRepository.update(orderId, {
      status: 'cancelled',
      notes: reason,
    });

    // Send notification
    await emailService.sendOrderCancellation(updated);

    return updated;
  }
}

export const orderService = new OrderService();
```

**Estimate**: 10 hours

---

## 📋 PHASE 6: DOCUMENTATION & CI/CD (Week 6)

**Status**: 🟢 IMPORTANT
**Goal**: Complete documentation, setup CI/CD pipeline

### Task 6.1: Create Deployment Documentation

**New File**: `DEPLOYMENT.md`

```markdown
# Deployment Guide

## Prerequisites

- Cloudflare account with Pages enabled
- Wrangler CLI installed (`pnpm add -g wrangler`)
- Environment secrets configured
- Database migrations ready

## First-Time Setup

### 1. Create Cloudflare Resources

\`\`\`bash
# Create D1 database
wrangler d1 create bandofbakers-db

# Create KV namespace
wrangler kv:namespace create "CACHE"
wrangler kv:namespace create "CACHE" --preview

# Create R2 bucket
wrangler r2 bucket create bandofbakers-assets
\`\`\`

### 2. Configure Secrets

\`\`\`bash
# Authentication
wrangler secret put AUTH_SECRET
wrangler secret put AUTH_GOOGLE_ID
wrangler secret put AUTH_GOOGLE_SECRET

# GCP Identity Platform
wrangler secret put GCP_API_KEY
wrangler secret put GCP_PROJECT_ID
wrangler secret put GCP_IDENTITY_PLATFORM_TENANT_ID

# Email
wrangler secret put BANDOFBAKERS_RESEND_API_KEY

# Monitoring
wrangler secret put ROLLBAR_SERVER_TOKEN

# Stripe
wrangler secret put BANDOFBAKERS_STRIPE_SECRET_KEY
wrangler secret put BANDOFBAKERS_STRIPE_WEBHOOK_SECRET
\`\`\`

### 3. Run Database Migrations

\`\`\`bash
# Remote migration
wrangler d1 migrations apply bandofbakers-db --remote
\`\`\`

### 4. Deploy Application

\`\`\`bash
# Build
pnpm build

# Deploy to staging
pnpm deploy:staging

# Deploy to production (with tag)
pnpm deploy:production
\`\`\`

## Routine Deployments

### Staging

\`\`\`bash
git checkout staging
git pull origin staging
pnpm install
pnpm lint
pnpm test
pnpm build
pnpm deploy:staging
\`\`\`

### Production

\`\`\`bash
git checkout main
git pull origin main

# Ensure tests pass
pnpm test:coverage

# Create version tag
VERSION=$(jq -r .version package.json)
git tag v$VERSION
git push origin v$VERSION

# Deploy
pnpm deploy:production
\`\`\`

## Rollback Procedure

### Quick Rollback (Cloudflare Dashboard)

1. Go to Workers & Pages > bandofbakers-v2
2. Click "View deployments"
3. Find last working deployment
4. Click "⋯" > "Rollback to this deployment"

### Manual Rollback

\`\`\`bash
# Find last working commit
git log --oneline

# Checkout that commit
git checkout <SHA>

# Deploy
pnpm build && pnpm deploy:production

# If successful, update main branch
git checkout main
git reset --hard <SHA>
git push origin main --force
\`\`\`

## Database Rollback

\`\`\`bash
# Create backup first
wrangler d1 export bandofbakers-db --remote > backup-$(date +%Y%m%d).sql

# Rollback migration (if needed)
wrangler d1 migrations apply bandofbakers-db --remote --down
\`\`\`

## Troubleshooting

### Build Fails

1. Check Node.js version (requires 18+)
2. Clear cache: `rm -rf .next node_modules && pnpm install`
3. Check TypeScript errors: `pnpm type-check`

### Deployment Fails

1. Verify secrets are set: `wrangler secret list`
2. Check D1 database exists: `wrangler d1 list`
3. Review build logs in Cloudflare dashboard

### Application Errors After Deploy

1. Check Rollbar for error details
2. Review Cloudflare logs: `wrangler tail`
3. Verify environment variables
4. Consider rollback if critical

## Monitoring

- **Rollbar**: https://rollbar.com/bandofbakers
- **Cloudflare Analytics**: Cloudflare Dashboard > Analytics
- **Logflare**: https://logflare.app

## Emergency Contacts

- DevOps Lead: [Contact Info]
- On-Call Engineer: [Contact Info]
- Cloudflare Support: https://support.cloudflare.com
```

**Estimate**: 4 hours

---

### Task 6.2: Create CI/CD Pipeline

**New File**: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, staging, develop]
  pull_request:
    branches: [main, staging]

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Get pnpm store directory
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm type-check

      - name: Run tests
        run: pnpm test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build
        env:
          NODE_ENV: production

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: .next
          retention-days: 1
```

**New File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [main, staging]
  workflow_dispatch:

jobs:
  deploy:
    name: Deploy to Cloudflare Pages
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build
        env:
          NODE_ENV: production

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: bandofbakers-v2
          directory: .open-next/assets
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
          branch: ${{ github.ref_name }}

  migrate:
    name: Run Database Migrations
    runs-on: ubuntu-latest
    needs: deploy
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Wrangler
        run: npm install -g wrangler

      - name: Run migrations
        run: wrangler d1 migrations apply bandofbakers-db --remote
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

**GitHub Secrets to Configure**:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CODECOV_TOKEN` (optional)

**Estimate**: 6 hours

---

### Task 6.3: Update package.json Scripts

**Update**: `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "analyze": "ANALYZE=true pnpm build",
    "db:generate": "drizzle-kit generate",
    "db:migrate:local": "wrangler d1 migrations apply bandofbakers-db --local",
    "db:migrate:staging": "wrangler d1 migrations apply bandofbakers-db --env staging --remote",
    "db:migrate:production": "wrangler d1 migrations apply bandofbakers-db --env production --remote",
    "deploy:preview": "wrangler pages deploy",
    "deploy:staging": "wrangler pages deploy --branch=staging",
    "deploy:production": "git tag v$(jq -r .version package.json) && wrangler pages deploy --branch=production",
    "clean": "rm -rf .next .open-next node_modules/.cache",
    "clean:all": "rm -rf .next .open-next node_modules"
  }
}
```

**Estimate**: 1 hour

---

### Task 6.4: Create CONTRIBUTING.md

**New File**: `CONTRIBUTING.md`

```markdown
# Contributing to Band of Bakers

Thank you for contributing! This guide will help you get started.

## Development Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd bandofbakers-v2
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   pnpm install
   \`\`\`

3. **Configure environment**
   \`\`\`bash
   cp .env.example .env.local
   # Fill in required values
   \`\`\`

4. **Setup database**
   \`\`\`bash
   pnpm db:migrate:local
   npx tsx scripts/seed.ts
   \`\`\`

5. **Start dev server**
   \`\`\`bash
   pnpm dev
   \`\`\`

## Code Standards

### TypeScript

- **Strict mode** is enabled and enforced
- Use explicit types (avoid `any`)
- Leverage type inference from Zod schemas
- Export types from schema files

### Naming Conventions

- **Components**: PascalCase (`ProductCard.tsx`)
- **Utilities**: camelCase (`formatPrice()`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_CART_ITEMS`)
- **Types/Interfaces**: PascalCase (`interface User {}`)
- **Files**: kebab-case or PascalCase for components

### Code Quality

- **No console.log** in production code
- Use constants instead of magic values
- Keep functions under 50 lines
- Keep components under 150 lines
- Extract complex logic into hooks/utilities

### Testing

- **80% minimum coverage** on new code
- Unit tests for validators and utilities (100%)
- Component tests for interactive elements
- E2E tests for critical user flows

### Git Workflow

1. **Create feature branch**
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`

2. **Make changes**
   - Write tests first (TDD preferred)
   - Implement feature
   - Run tests: `pnpm test`
   - Run linter: `pnpm lint`

3. **Commit changes**
   \`\`\`bash
   git add .
   git commit -m "feat: add user profile page"
   \`\`\`

   **Commit Message Format**:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation
   - `style:` Code formatting
   - `refactor:` Code refactoring
   - `test:` Test updates
   - `chore:` Build/config changes

4. **Push branch**
   \`\`\`bash
   git push origin feature/your-feature-name
   \`\`\`

5. **Create Pull Request**
   - Use PR template
   - Link related issues
   - Request reviews from 2+ team members
   - Wait for CI to pass

## Pull Request Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] All tests passing (`pnpm test`)
- [ ] No TypeScript errors (`pnpm type-check`)
- [ ] No linting errors (`pnpm lint`)
- [ ] Documentation updated
- [ ] Changelog updated (if applicable)
- [ ] No security vulnerabilities introduced

## Code Review Process

1. **Automated checks** must pass (CI)
2. **Two approvals** required from team
3. **Changes requested** must be addressed
4. **Squash and merge** to main branch

## Questions?

- Check [README.md](README.md) for setup help
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for design decisions
- Ask in #development Slack channel
- Open a discussion on GitHub

## License

By contributing, you agree that your contributions will be licensed under the project's license.
```

**Estimate**: 3 hours

---

## 📊 Progress Tracking & Metrics

### Success Criteria

**Phase 0-1: Security (Week 1)**
- [ ] All secrets removed from git history
- [ ] Security headers implemented
- [ ] Rate limiting active
- [ ] CSRF protection in place
- [ ] Input sanitization working

**Phase 2: Testing (Week 2)**
- [ ] Vitest configured and running
- [ ] 100% validator coverage
- [ ] 80% utility coverage
- [ ] 70% component coverage
- [ ] 5+ critical E2E tests

**Phase 3: Observability (Week 3)**
- [ ] Rollbar logging all errors
- [ ] Logflare tracking events
- [ ] Web Vitals monitored
- [ ] Request IDs in all logs

**Phase 4: Performance (Week 4)**
- [ ] Bundle size < 200KB
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] All images on Cloudflare

**Phase 5: Refactoring (Week 5)**
- [ ] No components >150 lines
- [ ] Repository pattern implemented
- [ ] Service layer complete
- [ ] 3+ reusable hooks

**Phase 6: DevOps (Week 6)**
- [ ] CI/CD pipeline active
- [ ] Deployment documented
- [ ] CONTRIBUTING.md complete
- [ ] Automated migrations

### Quality Gates

**Before Merging to Main**:
- ✅ All tests passing
- ✅ No TypeScript errors
- ✅ Coverage >80%
- ✅ Linting passing
- ✅ 2+ approvals

**Before Production Deploy**:
- ✅ E2E tests passing
- ✅ Bundle analysis reviewed
- ✅ Security scan clean
- ✅ Database migrated
- ✅ Rollback plan ready

---

## 🎯 Final Target Grades

| Category | Current | Target | Improvement |
|----------|---------|--------|-------------|
| Structure | 5/5 | 5/5 | - |
| Naming | 4/5 | 5/5 | +1 |
| Code Quality | 4/5 | 5/5 | +1 |
| Design | 4/5 | 5/5 | +1 |
| Performance | 3/5 | 5/5 | +2 |
| Error Handling | 2/5 | 5/5 | +3 |
| Security | 2/5 | 5/5 | +3 |
| Config | 4/5 | 5/5 | +1 |
| Testing | 1/5 | 5/5 | +4 |
| Monitoring | 2/5 | 5/5 | +3 |
| Documentation | 4/5 | 5/5 | +1 |
| **TOTAL** | **69%** | **95%** | **+26%** |

---

## 📅 Timeline Summary

| Week | Phase | Focus | Effort |
|------|-------|-------|--------|
| 1 | 0-1 | Security Fixes | 40h |
| 2 | 2 | Testing Setup | 40h |
| 3 | 3 | Monitoring | 30h |
| 4 | 4 | Performance | 30h |
| 5 | 5 | Refactoring | 30h |
| 6 | 6 | DevOps | 25h |
| **Total** | | | **195h** (~5 weeks) |

---

## 🚀 Quick Start (Priority Tasks)

If time is limited, focus on these **critical** items first:

1. **Week 1 Priority**:
   - ✅ Remove secrets from git (2h)
   - ✅ Add security headers (2h)
   - ✅ Implement server logging (6h)
   - ✅ Basic unit tests for validators (16h)

2. **Week 2 Priority**:
   - ✅ Rate limiting (4h)
   - ✅ CSRF protection (2h)
   - ✅ Input sanitization (3h)
   - ✅ E2E tests for checkout (8h)

3. **Week 3 Priority**:
   - ✅ Error tracking working (4h)
   - ✅ Dynamic imports (4h)
   - ✅ React.memo optimizations (4h)
   - ✅ CI/CD pipeline (6h)

**Minimum Viable Production** (~60 hours / 1.5 weeks)

---

**Document Version**: 1.0
**Last Updated**: 2025-11-26
**Maintained By**: Development Team
