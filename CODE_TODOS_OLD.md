# Code TODOs - Band of Bakers v2

**Created**: 2025-11-27
**Status**: Active tracking of in-code TODO comments

---

## 📋 Overview

This document tracks all TODO comments found in the codebase that require action. These represent technical debt, incomplete implementations, and planned improvements.

---

## 🔴 Critical Priority

### 1. TypeScript Type Definitions (Cloudflare Workers)

**Location**: [src/lib/db.ts:6-10](src/lib/db.ts#L6-L10)

**Issue**: Missing proper TypeScript types from `@cloudflare/workers-types`

```typescript
// TODO: Import proper type from @cloudflare/workers-types (for D1Database)
type D1Database = any;
// TODO: Import proper type from @cloudflare/workers-types (for R2Bucket)
type R2Bucket = any;
// TODO: Import proper type from @cloudflare/workers-types (for KVNamespace)
type KVNamespace = any;
```

**Impact**:
- Type safety compromised with `any` types
- No IntelliSense for Cloudflare bindings
- Runtime errors not caught at compile time

**Solution**:
```typescript
import type {
  D1Database,
  R2Bucket,
  KVNamespace
} from '@cloudflare/workers-types';

export interface CloudflareEnv {
  BANDOFBAKERS_DB: D1Database;
  BANDOFBAKERS_R2_STORAGE: R2Bucket;
  BANDOFBAKERS_KV_CACHE: KVNamespace;
  BANDOFBAKERS_KV_CACHE_PREVIEW: KVNamespace;
}
```

**Prerequisites**:
- Install: `pnpm add -D @cloudflare/workers-types`
- Update `tsconfig.json` to include Cloudflare types

**Estimated Effort**: 30 minutes
**Dependencies**: None
**Phase**: Phase 1 (Security & Infrastructure)

---

### 2. Security Audit & Hardening

**Location**: Global (admin routes, API routes, auth/session stack)

**Issue**: Security review required across the platform to confirm protections are correctly implemented and consistent.

**Scope/Tasks**:
- Audit admin route protection and authentication
- Examine cookie configuration and session management
- Review authentication implementation and token handling
- Check for CSRF protection
- Audit API route security
- Check for XSS vulnerabilities
- Review database query security (SQL injection)
- Check authorization logic and privilege escalation
- Compile security findings and recommendations

**Solution Required**:
- Map current auth/authorization flow and verify guards on all admin routes/components.
- Validate cookie/session flags (HttpOnly, Secure, SameSite, expiry) and rotation/invalidations.
- Ensure CSRF tokens are enforced on mutations (forms, server actions, API routes).
- Confirm input sanitization/escaping for user-facing content and template rendering (XSS).
- Review API handlers for authentication/authorization, rate limiting, and validation gaps.
- Confirm parameterized queries via Drizzle and absence of raw SQL injection vectors.
- Produce a written findings doc with prioritized fixes and recommendations.

**Estimated Effort**: 6-8 hours
**Dependencies**: Auth/session implementation, API handlers, UI routes
**Phase**: Phase 1 (Security & Infrastructure)

---

## 🟡 High Priority - API Implementation

### 2. Checkout Page API Integration

**Location**: [src/app/(shop)/checkout/page.tsx](src/app/(shop)/checkout/page.tsx)

**Issue**: Placeholder comment for API call implementation

```typescript
// TODO: Replace with actual API call
```

**Context**: Checkout flow needs server-side integration for:
- Order creation
- Payment processing (Stripe)
- Inventory validation
- Email confirmation

**Solution Required**:
```typescript
'use server';

import { orderService } from '@/lib/services';
import { createStripePaymentIntent } from '@/lib/stripe';
import { sendOrderConfirmation } from '@/lib/email';

export async function processCheckout(formData: FormData) {
  // 1. Validate cart items and inventory
  // 2. Create order in database
  // 3. Create Stripe payment intent
  // 4. Send confirmation email
  // 5. Clear cart
}
```

**Dependencies**:
- Order repository and service
- Stripe integration
- Email service (Resend)

**Estimated Effort**: 4-6 hours
**Phase**: Phase 2 (Core Features)

---

### 3. Collection Checkout API Integration

**Location**: [src/app/(shop)/checkout/collection/page.tsx](src/app/(shop)/checkout/collection/page.tsx)

**Issue**: Placeholder for collection order API

```typescript
// TODO: Replace with actual API call
```

**Context**: Collection orders (click & collect) need separate flow:
- No shipping address required
- Collection time slot selection
- Store notification

**Solution Required**:
```typescript
'use server';

export async function processCollectionOrder(formData: FormData) {
  // 1. Validate cart and collection time slot
  // 2. Create collection order
  // 3. Process payment
  // 4. Notify store staff
  // 5. Send customer confirmation
}
```

**Dependencies**:
- Collection time slot system
- Staff notification system
- Order service

**Estimated Effort**: 3-4 hours
**Phase**: Phase 2 (Core Features)

---

### 4. News Creation API

**Location**: [src/app/(admin)/admin/news/new/page.tsx](src/app/(admin)/admin/news/new/page.tsx)

**Issue**: Missing API implementation for news post creation

```typescript
// TODO: Replace with actual API call
```

**Context**: Admin panel needs news/blog functionality

**Solution Required**:
```typescript
'use server';

import { newsService } from '@/lib/services';
import { sanitizeHtml } from '@/lib/sanitize';
import { requireCsrf } from '@/lib/csrf';

export async function createNewsPost(formData: FormData) {
  await requireCsrf();

  const title = sanitizeText(formData.get('title'));
  const content = sanitizeHtml(formData.get('content'), 'rich');
  const slug = generateSlug(title);

  await newsService.create({
    title,
    content,
    slug,
    author_id: session.user.id,
  });

  revalidatePath('/news');
  redirect('/admin/news');
}
```

**Dependencies**:
- News repository and service
- Database schema for news posts
- Rich text editor (TinyMCE) integration

**Estimated Effort**: 2-3 hours
**Phase**: Phase 3 (CMS Features)

---

### 5. Testimonial Creation API

**Location**: [src/app/(admin)/admin/testimonials/new/page.tsx](src/app/(admin)/admin/testimonials/new/page.tsx)

**Issue**: Missing testimonial submission API

```typescript
// TODO: Replace with actual API call
```

**Context**: Admin and potentially customer testimonial submission

**Solution Required**:
```typescript
'use server';

import { testimonialService } from '@/lib/services';
import { sanitizeText } from '@/lib/sanitize';

export async function createTestimonial(formData: FormData) {
  await requireCsrf();

  const name = sanitizeText(formData.get('name'));
  const content = sanitizeText(formData.get('content'));
  const rating = parseInt(formData.get('rating'));

  await testimonialService.create({
    name,
    content,
    rating,
    approved: session.user.role === 'admin',
  });

  revalidatePath('/');
  redirect('/admin/testimonials');
}
```

**Dependencies**:
- Testimonial repository and service
- Approval workflow (if customer-submitted)

**Estimated Effort**: 1-2 hours
**Phase**: Phase 3 (CMS Features)

---

### 6. Bake Sale Creation API

**Location**: [src/app/(admin)/admin/bake-sales/new/page.tsx](src/app/(admin)/admin/bake-sales/new/page.tsx)

**Issue**: Missing bake sale event creation API

```typescript
// TODO: Replace with actual API call
```

**Context**: Admin needs to create and manage bake sale events

**Solution Required**:
```typescript
'use server';

import { bakeSaleService } from '@/lib/services';
import { sanitizeText, sanitizeHtml } from '@/lib/sanitize';

export async function createBakeSale(formData: FormData) {
  await requireCsrf();

  const title = sanitizeText(formData.get('title'));
  const description = sanitizeHtml(formData.get('description'), 'basic');
  const location = sanitizeText(formData.get('location'));
  const date = new Date(formData.get('date'));
  const startTime = formData.get('start_time');
  const endTime = formData.get('end_time');

  await bakeSaleService.create({
    title,
    description,
    location,
    date,
    start_time: startTime,
    end_time: endTime,
    status: 'upcoming',
  });

  revalidatePath('/bake-sales');
  redirect('/admin/bake-sales');
}
```

**Dependencies**:
- Bake sale repository and service
- Event calendar functionality
- Location/venue management

**Estimated Effort**: 2-3 hours
**Phase**: Phase 3 (CMS Features)

---

## 🟢 Medium Priority - Operations & UX

### 7. Delivery Fee Constant

**Location**: [src/actions/orders.ts:103](src/actions/orders.ts#L103)

**Issue**: Delivery fee hardcoded (`3.99`) instead of using shared configuration/constant.

**Solution Required**:
- Add delivery fee value to `src/lib/constants` (with env/config override if needed) and reuse in calculations.
- Keep totals and revalidation intact; add regression test for totals.

**Estimated Effort**: 30-45 minutes
**Dependencies**: None
**Phase**: Phase 2 (Core Features)

---

### 8. Bake Sale Transfer Stock Check

**Location**: [src/actions/bake-sale-management.ts:81](src/actions/bake-sale-management.ts#L81)

**Issue**: Order transfer to another bake sale skips stock availability validation.

**Solution Required**:
- Check product/variant availability for the target bake sale before transfer.
- Block transfer (with clear error) when stock is insufficient; log/audit the attempt.

**Estimated Effort**: 1-2 hours
**Dependencies**: Stock/availability data
**Phase**: Phase 2 (Core Features)

---

### 9. Menu Stock Indicators

**Location**: [src/app/(shop)/menu/menu-content.tsx:320](src/app/(shop)/menu/menu-content.tsx#L320)

**Issue**: Stock flags are stubbed (`isOutOfStock`, `isLowStock`) and not wired to real data.

**Solution Required**:
- Expose stock quantities in menu data and compute out-of-stock/low-stock thresholds.
- Reflect states in UI and disable add-to-cart when unavailable.

**Estimated Effort**: 2-3 hours
**Dependencies**: Stock data availability
**Phase**: Phase 2 (Core Features)

---

### 10. Admin Order Quick Actions

**Location**: [src/app/(admin)/admin/orders/orders-table.tsx:208-217](src/app/(admin)/admin/orders/orders-table.tsx#L208)

**Issue**: Quick actions (Ready/Complete) only show toasts; no server action to update status.

**Solution Required**:
- Add server action to transition order status with auth/role guard and revalidation.
- Optionally trigger customer notification (email/SMS) on Ready/Complete.

**Estimated Effort**: 1.5-2 hours
**Dependencies**: Order repository/service; notification channel
**Phase**: Phase 2 (Core Features)

---

### 11. Voucher Discount Display

**Location**: [src/app/(shop)/orders/[id]/page.tsx:136](src/app/(shop)/orders/[id]/page.tsx#L136)

**Issue**: Voucher discount line missing in order summary despite schema support.

**Solution Required**:
- Read voucher discount from order payload and show in summary; keep total consistent.
- Handle zero/absent discounts gracefully.

**Estimated Effort**: 30-45 minutes
**Dependencies**: Order payload fields
**Phase**: Phase 2 (Core Features)

---

## 🔴/🟡 Launch Hardening (Quick Wins)

### 12. CSRF & Session Hardening

**Location**: Global (forms, server actions, API routes, cookie/session config)

**Issue**: No explicit CSRF guard across mutations; cookie flags/rotation not confirmed.

**Solution Required**:
- Enforce CSRF tokens on mutating routes/forms/server actions.
- Harden session cookies (HttpOnly, Secure, SameSite, rotation/invalidations).
- Add regression coverage around auth flows.

**Estimated Effort**: 1-2 hours
**Dependencies**: Auth/session middleware
**Phase**: Phase 1 (Security & Infrastructure)

---

### 13. Turnstile Rate Limiting

**Location**: Auth flows, contact/signup forms, any high-risk POST endpoints

**Issue**: No CAPTCHA/rate-limit guard; needs Cloudflare Turnstile for abuse protection.

**Solution Required**:
- Add Turnstile widget to relevant forms; verify token server-side before processing.
- Fail closed with friendly error; log abuse attempts.

**Estimated Effort**: 1-2 hours
**Dependencies**: Turnstile keys, form surfaces
**Phase**: Phase 1 (Security & Infrastructure)

---

### 14. Inventory Availability Enforcement

**Location**: Menu data, checkout/order creation

**Issue**: Stock is assumed available; no enforcement. Requirement: stock stays available until admin marks unavailable.

**Solution Required**:
- Add product availability flag and/or stock counts to order creation; block when unavailable.
- Admin control to set unavailable; ensure menu/checkout reflects availability.

**Estimated Effort**: 2-3 hours
**Dependencies**: Product model/repository, admin UI
**Phase**: Phase 2 (Core Features)

---

### 15. Voucher Integrity Enforcement

**Location**: Voucher application (backend) and order creation

**Issue**: Usage limits/eligibility not enforced beyond display; risk of overuse.

**Solution Required**:
- Validate voucher applicability (date, uses, per-customer limits) at apply/checkout.
- Atomically increment uses; rollback on failure; surface errors to UI.

**Estimated Effort**: 1-2 hours
**Dependencies**: Voucher repository/service
**Phase**: Phase 2 (Core Features)

---

### 16. Input/Output Sanitization

**Location**: Rich text (news/testimonials), user-provided strings (names/notes)

**Issue**: No explicit HTML sanitization/escaping; XSS risk.

**Solution Required**:
- Sanitize rich text on input (allowlist) and escape user strings in renders.
- Add tests covering XSS payloads.

**Estimated Effort**: 1-2 hours
**Dependencies**: Sanitizer utility (DOMPurify/similar)
**Phase**: Phase 1 (Security & Infrastructure)

---

## 🟢 Additional Medium Priority

### 17. Order Status Notifications

**Location**: Order status transitions (Ready/Complete/Cancelled/Refunded)

**Issue**: No customer notifications tied to status changes.

**Solution Required**:
- Trigger email (or SMS) on key status transitions; reuse templates if available.
- Tie into admin quick actions and backend status updates.

**Estimated Effort**: 1-2 hours
**Dependencies**: Email/SMS provider, order status actions
**Phase**: Phase 2 (Core Features)

---

### 18. Logging, Observability, and Audit Trails

**Location**: Cross-cutting (API routes, server actions, admin actions)

**Issue**: Lacks structured logging/error reporting and admin audit logging.

**Solution Required**:
- Add structured logs and error reporting (Sentry/console fallback).
- Record admin-sensitive actions (status changes, deletions) with actor/time.

**Estimated Effort**: 1-2 hours
**Dependencies**: Logging/reporting choice
**Phase**: Phase 1 (Security & Infrastructure)

---

### 19. SEO/Compliance Baseline

**Location**: Global layout/footer, head tags

**Issue**: Cookie/consent/privacy links and basic SEO/meta likely missing.

**Solution Required**:
- Add privacy/terms links and cookie/consent banner if required.
- Ensure basic meta tags/og tags and accessibility checks on key pages.

**Estimated Effort**: 0.5-1 hour
**Dependencies**: Legal copy, layout components
**Phase**: Phase 2 (Core Features)

---

### 20. Server-Side Pagination

**Location**: Admin listings (orders, products, users, etc.) and any list APIs backed by D1

**Issue**: Lists are loaded client-side; no server-side pagination despite D1 supporting `LIMIT/OFFSET`.

**Solution Required**:
- Add pagination parameters to repositories/queries (using `LIMIT/OFFSET`).
- Update server actions/routes to accept pagination; adjust UI to request paged data.
- Include total counts for pagination UI.

**Estimated Effort**: 2-3 hours
**Dependencies**: Relevant repositories/actions, UI wiring
**Phase**: Phase 2 (Core Features)

---

## 📊 TODO Summary by Priority

| Priority | Count | Category | Estimated Time |
|----------|-------|----------|----------------|
| 🔴 Critical | 3 | Types & Security | 7.5-10.5 hours |
| 🟡 High | 6 | Security, Checkout, Integrity | 12-19 hours |
| 🟢 Medium | 11 | CMS & Ops/UX | 16.5-22.5 hours |
| **TOTAL** | **20** | - | **36-52 hours** |

---

## 📊 TODO Summary by Phase

### Phase 1: Security & Infrastructure
- ✅ Cloudflare Workers type definitions
- 🔴 Security audit & hardening
- 🔴 CSRF & session hardening
- 🔴 Turnstile rate limiting
- 🔴 Input/output sanitization
- 🔴 Logging/observability (baseline)

### Phase 2: Core Features (E-commerce)
- ✅ Checkout page API
- ✅ Collection checkout API
- 🟢 Delivery fee constant (orders)
- 🟢 Bake sale transfer stock check
- 🟢 Menu stock indicators
- 🟢 Admin order quick actions
- 🟢 Voucher discount display
- 🟡 Inventory availability enforcement
- 🟡 Voucher integrity enforcement
- 🟢 Order status notifications
- 🟢 SEO/compliance baseline
- 🟢 Server-side pagination

### Phase 3: CMS Features
- ✅ News post creation
- ✅ Testimonial creation
- ✅ Bake sale event creation

---

## 🎯 Implementation Plan

### Sprint 1: Critical Infrastructure (Week 1)
**Goal**: Fix type safety issues and complete security audit

1. ✅ Install `@cloudflare/workers-types`
2. ✅ Update `src/lib/db.ts` with proper types
3. ✅ Test all database operations
4. ✅ Verify IntelliSense working
5. 🔴 Run security audit (admin routes, cookies/sessions, CSRF, API routes, XSS, SQLi, authz)
6. 🔴 Produce findings and recommended remediations

**Time**: ~1 hour (including testing)

---

### Sprint 2: E-commerce Core (Week 2-3)
**Goal**: Complete checkout functionality

1. ✅ Create order repository and service
2. ✅ Implement Stripe payment flow
3. ✅ Build checkout page API
4. ✅ Build collection checkout API
5. ✅ Add order confirmation emails
6. ✅ Test end-to-end checkout

**Time**: 15-20 hours (including testing)

**Dependencies**:
- Stripe setup complete
- Email service configured
- Inventory management system

---

### Sprint 3: CMS Features (Week 4)
**Goal**: Complete admin panel functionality

1. ✅ Create news repository and service
2. ✅ Create testimonial repository and service
3. ✅ Create bake sale repository and service
4. ✅ Implement all admin creation APIs
5. ✅ Add rich text editor support
6. ✅ Test admin workflows

**Time**: 10-15 hours (including testing)

**Dependencies**:
- TinyMCE configuration
- Image upload system
- Admin authentication

---

## 🔧 Technical Debt Resolution

### Type Safety Improvements
```typescript
// Before (current):
type D1Database = any;

// After (target):
import type { D1Database } from '@cloudflare/workers-types';
```

**Benefits**:
- ✅ Full IntelliSense support
- ✅ Compile-time error detection
- ✅ Better developer experience
- ✅ Reduced runtime errors

---

### Service Layer Pattern
All API TODOs should follow the established pattern:

```typescript
// 1. Server Action (presentation layer)
'use server';

export async function actionName(formData: FormData) {
  // CSRF protection
  await requireCsrf();

  // Input sanitization
  const cleanData = sanitizeInputs(formData);

  // Business logic (service layer)
  const result = await service.operation(cleanData);

  // Revalidation and redirect
  revalidatePath('/path');
  return result;
}

// 2. Service Layer (business logic)
class EntityService {
  async operation(data: InputType): Promise<ResultType> {
    // Validation
    this.validate(data);

    // Repository interaction
    return await repository.create(data);
  }
}

// 3. Repository Layer (data access)
class EntityRepository extends BaseRepository<typeof table> {
  // CRUD operations
}
```

---

## 📝 Completion Criteria

### For Each TODO:
- ✅ Implementation complete
- ✅ Unit tests written (>80% coverage)
- ✅ Integration tests passing
- ✅ Security review (CSRF, sanitization)
- ✅ Error handling implemented
- ✅ Documentation updated
- ✅ Code reviewed
- ✅ TODO comment removed

---

## 🚀 Recommended Order of Implementation

### Phase 1 (Immediate - Week 1)
1. **CSRF & Session Hardening** (Critical) - 1-2 hours
2. **Turnstile Rate Limiting** (Critical) - 1-2 hours
3. **Input/Output Sanitization** (Critical) - 1-2 hours
4. **Security Audit** (Critical) - 6-8 hours
5. **Logging/Observability Baseline** (Critical) - 1-2 hours
6. **Cloudflare Types** (Critical) - 1 hour

### Phase 2 (High Priority - Week 2-3)
7. **Checkout API (Pay on Collection)** (High) - 4-6 hours
8. **Collection Checkout API (Pay on Collection)** (High) - 3-4 hours
9. **Inventory Availability Enforcement** (High) - 2-3 hours
10. **Voucher Integrity Enforcement** (High) - 1-2 hours
11. **Delivery Fee Constant** (Medium) - 30-45 minutes
12. **Bake Sale Transfer Stock Check** (Medium) - 1-2 hours
13. **Admin Order Quick Actions** (Medium) - 1.5-2 hours
14. **Order Status Notifications** (Medium) - 1-2 hours
15. **Menu Stock Indicators** (Medium) - 2-3 hours
16. **Voucher Discount Display** (Medium) - 30-45 minutes
17. **SEO/Compliance Baseline** (Medium) - 0.5-1 hour

### Phase 3 (Medium Priority - Week 4)
18. **News API** (Medium) - 2 hours
19. **Testimonial API** (Medium) - 2 hours
20. **Bake Sale API** (Medium) - 3 hours

---

## 📈 Progress Tracking

**Overall TODO Completion**: 0/20 (0%)

| TODO | Status | Assignee | Target Date | Completed |
|------|--------|----------|-------------|-----------|
| Cloudflare Types | ⏳ Pending | - | - | - |
| Security Audit | ⏳ Pending | - | - | - |
| CSRF & Session Hardening | ⏳ Pending | - | - | - |
| Turnstile Rate Limiting | ⏳ Pending | - | - | - |
| Input/Output Sanitization | ⏳ Pending | - | - | - |
| Logging/Observability Baseline | ⏳ Pending | - | - | - |
| Checkout API | ⏳ Pending | - | - | - |
| Collection API | ⏳ Pending | - | - | - |
| Inventory Availability Enforcement | ⏳ Pending | - | - | - |
| Voucher Integrity Enforcement | ⏳ Pending | - | - | - |
| News API | ⏳ Pending | - | - | - |
| Testimonial API | ⏳ Pending | - | - | - |
| Bake Sale API | ⏳ Pending | - | - | - |
| Delivery Fee Constant | ⏳ Pending | - | - | - |
| Bake Sale Transfer Stock | ⏳ Pending | - | - | - |
| Menu Stock Indicators | ⏳ Pending | - | - | - |
| Admin Order Quick Actions | ⏳ Pending | - | - | - |
| Voucher Discount Display | ⏳ Pending | - | - | - |
| Order Status Notifications | ⏳ Pending | - | - | - |
| SEO/Compliance Baseline | ⏳ Pending | - | - | - |
| Server-side Pagination | ⏳ Pending | - | - | - |

---

## 🔗 Related Documents

- [REFACTOR_PROGRESS.md](REFACTOR_PROGRESS.md) - Overall refactor status
- [PROGRESS_SUMMARY.md](PROGRESS_SUMMARY.md) - Comprehensive progress analysis
- [SECURITY_IMPLEMENTATION_GUIDE.md](SECURITY_IMPLEMENTATION_GUIDE.md) - Security patterns
- [refactor-plan.md](refactor-plan.md) - Original refactor plan

---

**Last Updated**: 2025-11-27 (Launch hardening TODOs added)
**Next Review**: After Sprint 1 completion
