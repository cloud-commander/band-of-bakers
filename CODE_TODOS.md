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

## 📊 TODO Summary by Priority

| Priority | Count | Category | Estimated Time |
|----------|-------|----------|----------------|
| 🔴 Critical | 1 | TypeScript Types | 30 min |
| 🟡 High | 2 | Checkout Flow | 7-10 hours |
| 🟢 Medium | 3 | CMS Features | 5-8 hours |
| **TOTAL** | **6** | - | **12.5-18.5 hours** |

---

## 📊 TODO Summary by Phase

### Phase 1: Security & Infrastructure
- ✅ Cloudflare Workers type definitions

### Phase 2: Core Features (E-commerce)
- ✅ Checkout page API
- ✅ Collection checkout API

### Phase 3: CMS Features
- ✅ News post creation
- ✅ Testimonial creation
- ✅ Bake sale event creation

---

## 🎯 Implementation Plan

### Sprint 1: Critical Infrastructure (Week 1)
**Goal**: Fix type safety issues

1. ✅ Install `@cloudflare/workers-types`
2. ✅ Update `src/lib/db.ts` with proper types
3. ✅ Test all database operations
4. ✅ Verify IntelliSense working

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
1. **Cloudflare Types** (Critical) - 1 hour
   - Fixes type safety across entire app
   - Unblocks other development

### Phase 2 (High Priority - Week 2-3)
2. **Checkout API** (High) - 6 hours
   - Core revenue feature
   - Blocks production launch
3. **Collection Checkout API** (High) - 4 hours
   - Alternative order method
   - Customer convenience

### Phase 3 (Medium Priority - Week 4)
4. **News API** (Medium) - 2 hours
   - Marketing/engagement feature
5. **Testimonial API** (Medium) - 2 hours
   - Social proof
6. **Bake Sale API** (Medium) - 3 hours
   - Event management

---

## 📈 Progress Tracking

**Overall TODO Completion**: 0/6 (0%)

| TODO | Status | Assignee | Target Date | Completed |
|------|--------|----------|-------------|-----------|
| Cloudflare Types | ⏳ Pending | - | - | - |
| Checkout API | ⏳ Pending | - | - | - |
| Collection API | ⏳ Pending | - | - | - |
| News API | ⏳ Pending | - | - | - |
| Testimonial API | ⏳ Pending | - | - | - |
| Bake Sale API | ⏳ Pending | - | - | - |

---

## 🔗 Related Documents

- [REFACTOR_PROGRESS.md](REFACTOR_PROGRESS.md) - Overall refactor status
- [PROGRESS_SUMMARY.md](PROGRESS_SUMMARY.md) - Comprehensive progress analysis
- [SECURITY_IMPLEMENTATION_GUIDE.md](SECURITY_IMPLEMENTATION_GUIDE.md) - Security patterns
- [refactor-plan.md](refactor-plan.md) - Original refactor plan

---

**Last Updated**: 2025-11-27
**Next Review**: After Sprint 1 completion
