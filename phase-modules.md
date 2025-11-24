# Phase-Specific Modules

> **Usage:** Load the relevant module when entering a new phase.
> User says: "Load Phase 2" → Include that module in context.

---

## MODULE: Phase 0 — Discovery

### Your Task

Extract clear requirements before any code is written.

### Questions to Ask

1. What problem are we solving?
2. Who are the users?
3. What are the must-have features for launch?
4. What's explicitly out of scope?
5. Are there existing designs/wireframes?
6. What third-party integrations are needed?
7. What's the timeline?
8. Any compliance requirements (GDPR, SOC2)?

### Deliverables

- [ ] `SPEC.md` created
- [ ] MVP features listed and prioritized
- [ ] Out-of-scope items documented
- [ ] User has approved scope

### Red Flags to Challenge

- "Build everything" → Push for MVP definition
- Vague requirements → Ask for specific user stories
- No success metrics → How will we know it works?

---

## MODULE: Phase 1 — Foundation

### Your Task

Set up a working development environment.

### Commands to Run

```bash
# Create Next.js project
npx create-next-app@latest [project-name] --typescript --tailwind --eslint --app --src-dir

# Ensure its a Cloudflare compatible Next.js version
cd [project-name]
pnpm install next@15.5.0 react@latest react-dom@latest

# Ensure Webpack is always used during development as turbopack is not yet supported on Cloudflare
# Open your package.json file and modify the scripts section:

json
{
  "name": "my-nextjs-15-5-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build --webpack",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    // ...
  }
}

# Add Cloudflare adapter
pnpm install @opennextjs/cloudflare

# Add core dependencies
pnpm install drizzle-orm zod
pnpm install -D drizzle-kit wrangler

# Add UI dependencies
pnpm install clsx tailwind-merge
npx shadcn@latest init
```

### Configuration Files Needed

1. `wrangler.jsonc` — Cloudflare config
2. `drizzle.config.ts` — Database config
3. `.env.example` — Environment template
4. Update `next.config.js` for Cloudflare

### Folder Structure (Get Approval)

```
src/
├── app/
├── components/
│   ├── ui/
│   └── features/
├── db/
├── lib/
│   ├── validators/
│   └── utils/
├── actions/
├── hooks/
└── types/
```

### Deliverables

- [ ] Project initializes without errors
- [ ] `pnpm run dev` works
- [ ] `pnpm run build` passes
- [ ] Folder structure approved
- [ ] `ARCHITECTURE.md` created

---

## MODULE: Phase 2 — Data Layer

### Your Task

Define all data structures AND create flat mock files for UI development.

### Process

1. List all entities from SPEC.md
2. Draw relationships (1:1, 1:N, N:N)
3. Get approval on data model
4. Write Drizzle schemas
5. Write Zod validators
6. **Create flat mock files IMMEDIATELY** (used in Phase 3-4)
7. Generate migration
8. Create seed script

### Critical: Mock Files Created in Phase 2

Phases 3 and 4 will use `src/lib/mocks/*.ts` files exclusively. These must be created and typed correctly in Phase 2. Backend team can work independently on migrations and seeds while frontend uses mocks.

### Entity Discovery Questions

- What are the main "things" in this system?
- How do they relate to each other?
- What fields does each entity need?
- Which fields are required vs optional?
- Do we need soft delete?
- Do we need audit fields (createdBy, updatedBy)?

### Schema Checklist

For each table:

- [ ] Primary key defined
- [ ] Required fields marked `.notNull()`
- [ ] Indexes for query patterns
- [ ] Foreign keys with proper cascades
- [ ] Timestamps (created_at, updated_at)

### 2.5 Flat Mock Data Files (Critical)

Create typed mock data for UI development. These are used throughout Phases 3-5 for 100% mock-driven development.

```typescript
// src/lib/mocks/entities.ts
import { type Entity } from "@/lib/validators/entity";

// Standard mock - happy path
export const mockEntities: Entity[] = [
  {
    id: "mock-1",
    name: "First Entity",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "mock-2",
    name: "Second Entity",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
  },
];

// Edge case mocks
export const mockEmptyEntities: Entity[] = [];

export const mockSingleEntity: Entity[] = [mockEntities[0]];

export const mockLongNameEntity: Entity = {
  id: "mock-long",
  name: "This is an extremely long entity name that might break the UI layout if not handled properly with truncation or wrapping",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockManyEntities: Entity[] = Array.from(
  { length: 50 },
  (_, i) => ({
    id: `mock-${i}`,
    name: `Entity ${i + 1}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
);
```

**Mock File Conventions:**

- Location: `src/lib/mocks/[entity].ts`
- Always typed to Zod schemas
- Include edge cases: empty, single, many, long strings
- No undefined for errors (Server Actions return structured errors)
- Example exports: `mockEntityHappy`, `mockEntityEmpty`, `mockEntityMany`, `mockEntityLongText`

### Deliverables

- [ ] ERD diagram/description approved
- [ ] `src/db/schema.ts` complete
- [ ] `src/lib/validators/*.ts` complete (all types exported)
- [ ] `src/lib/mocks/*.ts` COMPLETE for ALL entities (critical for UI team)
  - [ ] Happy path mock
  - [ ] Empty state mock
  - [ ] Multiple items mock
  - [ ] Edge case mocks (long text, etc.)
- [ ] All mocks TESTED locally before Phase 3 begins
- [ ] Migration generated and tested
- [ ] Seed script works (for D1)
- [ ] Frontend team can now start Phase 3 with zero blocking dependencies

---

## MODULE: Phase 3 — Core UI

### Your Task

Build the design system and layout components using **flat mock files ONLY** (no database calls, no Server Actions).

### Why Flat Mocks Only?

- Instant hot reload (no async)
- Works offline
- Easy to test edge cases
- UI development completely decoupled from backend
- Frontend team can work in parallel with backend team

### Phases 3-4: 100% Mock-Driven Development

**NO backend calls should exist in these phases.** All data comes from `src/lib/mocks/*.ts` files created in Phase 2.

### Data Source in Phase 3

```tsx
// CORRECT for Phase 3: Import flat mocks directly
import { mockEntities, mockEmptyEntities } from "@/lib/mocks/entities";

export function EntityList() {
  // No async, no loading state needed yet
  // No Server Action calls
  const entities = mockEntities;

  return (
    <ul>
      {entities.map((e) => (
        <li key={e.id}>{e.name}</li>
      ))}
    </ul>
  );
}

// Test edge cases by swapping mock:
// const entities = mockEmptyEntities  // Test empty state
// const entities = mockManyEntities   // Test pagination/scroll

// WRONG for Phase 3:
// ❌ const entities = await getEntities()  // No backend calls yet
// ❌ const entities = mockDataFromSeed     // Only flat files, not seed
```

### Shadcn Components to Consider

```bash
# Essential
npx shadcn@latest add button input label
npx shadcn@latest add card form
npx shadcn@latest add toast sonner
npx shadcn@latest add dropdown-menu dialog

# As needed
npx shadcn@latest add table select checkbox
npx shadcn@latest add tabs avatar badge
npx shadcn@latest add skeleton alert
```

### Required Components

**Layouts:**

- [ ] `RootLayout` — html, body, providers
- [ ] `AppLayout` — nav, sidebar, main content
- [ ] `AuthLayout` — centered card layout

**Navigation:**

- [ ] `Header` — logo, nav links, user menu
- [ ] `Sidebar` — if applicable
- [ ] `MobileNav` — responsive navigation

**State Components:**

- [ ] `LoadingSkeleton` — generic skeleton
- [ ] `EmptyState` — icon, message, action
- [ ] `ErrorState` — message, retry button
- [ ] `ErrorBoundary` — catch React errors

### Design Tokens (Get Approval)

```css
/* Confirm color palette */
--primary:
--secondary:
--destructive:
--muted:
--background:
--foreground:
```

### Deliverables

- [ ] All layout components render
- [ ] Navigation works (links, mobile)
- [ ] State components created (skeleton, empty, error)
- [ ] Responsive at all breakpoints
- [ ] Design direction approved
- [ ] **ZERO backend calls in entire Phase 3** (`grep -r "use.*server\|Server.*Action" src/components` returns 0 for Component imports)
- [ ] All components use flat mocks from `src/lib/mocks/`

---

## MODULE: Phase 4 — Features

### Your Task

Build all feature UI with mock data ONLY. Zero backend calls. Repeat for each feature.

### Critical Rule: Phase 4 is 100% Frontend

- **NO Server Actions called**
- **NO database queries**
- **ONLY mock data from Phase 2**
- All interactivity is client-side or form preparation only
- Backend team can work independently on Server Actions (Phase 6)

### Feature Implementation Checklist

```markdown
## Feature: [Name]

### Requirements

- [ ] User story documented
- [ ] Acceptance criteria defined

### Components

- [ ] Component tree approved
- [ ] Parent component built
- [ ] Child components built
- [ ] Props typed (no `any`)
- [ ] **NO Server Action imports** ← Critical

### States

- [ ] Loading state (skeleton)
- [ ] Empty state (helpful message)
- [ ] Error state (message + retry)
- [ ] Success state (full UI)

### Interactivity

- [ ] Click handlers work (client-side only)
- [ ] Forms validate locally (Zod)
- [ ] Keyboard navigation works
- [ ] Focus management correct

### Mock Data

- [ ] All data from `src/lib/mocks/`
- [ ] Mocks typed to Zod schemas from Phase 2
- [ ] Edge cases tested (empty, single, many, error states)

### Approval

- [ ] User has tested workflows
- [ ] UX approved
- [ ] Ready for Phase 6 integration
```

### Mock Data Pattern

```tsx
// src/components/features/[feature]/[Component].tsx
// NOT a separate mocks.ts file - import directly from Phase 2 mocks

import { mockEntities } from "@/lib/mocks/entities"

export function EntityFeature() {
  // Use mocks directly from Phase 2
  const entities = mockEntities

  return (
    // Component JSX
  )
}

// To test different states, swap mocks during development:
// import { mockEmptyEntities, mockManyEntities } from "@/lib/mocks/entities"
```

### Phase 4 Exit Criteria

- [ ] All feature UIs built and tested with mocks
- [ ] **ZERO backend calls**: `grep -r "from.*actions\|use.*server" src/components/` returns 0
- [ ] **All data from Phase 2 mocks**: `grep -r "from.*mocks" src/components/` shows only Phase 2 imports
- [ ] All workflows clickable and navigable
- [ ] All form validations work (client-side Zod only)
- [ ] User approves UX and workflows
- [ ] Backend team has completed Phase 2 schema (ready for Phase 6)
- [ ] **(Optional) Auth flow mocked if Phase 5 needed in parallel**

---

## MODULE: Phase 5 — Authentication

### Your Task

Implement secure authentication. **Can run in parallel with Phase 4.**

### First: Confirm Requirements

- Email/password, OAuth, or both?
- Which OAuth providers?
- Do we need roles/permissions?
- Session duration?
- Password requirements?

### Note: Phase 5 Parallelization

Phase 5 (auth) can run **in parallel with Phase 4** (features). Auth is independent of feature development. If auth is mocked in Phase 4 (optional), real auth replaces mocks in Phase 6.

### Auth Options (Discuss with User)

| Option  | Pros                     | Cons                 | Best For     |
| ------- | ------------------------ | -------------------- | ------------ |
| Auth.js | Flexible, many providers | Complex setup        | Custom needs |
| Clerk   | Fast setup, great UX     | Vendor lock-in, cost | Quick launch |
| Lucia   | Lightweight, edge-native | More manual work     | Full control |
| Custom  | Total control            | Security risk        | Experts only |

### Implementation Checklist

- [ ] Auth strategy approved
- [ ] Package installed and configured
- [ ] Database tables for sessions/users
- [ ] Sign-up flow works
- [ ] Sign-in flow works
- [ ] Sign-out works
- [ ] Session persists correctly
- [ ] Protected routes redirect
- [ ] Auth state in UI (nav, etc.)

### Security Checklist

- [ ] Passwords hashed (if custom)
- [ ] Sessions are httpOnly
- [ ] CSRF protection enabled
- [ ] Rate limiting on auth endpoints
- [ ] Secure password requirements

---

## MODULE: Phase 6 — Integration

### Your Task

Replace ALL mock data with real Server Actions. **Systematically remove all mocks from components one component at a time.**

### Mock Removal Checklist

**Flat Mock Files:**

```bash
# Find all flat mock imports in COMPONENTS ONLY
grep -r "from.*mocks" src/components/
grep -r "from.*mocks" src/app/

# Should return ZERO results
# (Mock files in src/lib/mocks/ still exist for reference but are not imported)
```

### Server Action Checklist (Per Entity)

- [ ] `create[Entity]` — with Zod validation
- [ ] `get[Entity]` — by ID with auth check
- [ ] `get[Entities]` — list with filters and pagination
- [ ] `update[Entity]` — with Zod validation and auth
- [ ] `delete[Entity]` — with auth check

### Mock Replacement Workflow (Per Component)

1. Remove: `import { mockEntities } from "@/lib/mocks/entities"`
2. Add: `import { getEntities } from "@/actions/entities"`
3. Change: `const entities = mockEntities` → `const { data, error } = await getEntities()`
4. Handle: Add loading/error states if using async components, or move to Server Component
5. Test: Verify real data displays correctly

### Mock Replacement Tracker

```markdown
| Component                     | Status | Notes                              |
| ----------------------------- | ------ | ---------------------------------- |
| UserList                      | ⬜     | Replace mockUsers with getUsers()  |
| PostCard                      | ⬜     | Replace mockPosts with getPost(id) |
| (Continue for each component) |        |                                    |
```

### Integration Checklist

- [ ] All Server Actions created (Phase 2 schema defines required actions)
- [ ] All Actions have Zod input validation
- [ ] All Actions have auth checks
- [ ] All Actions have structured error handling
- [ ] All mock imports removed from components: `grep -r "from.*mocks" src/components/` returns 0
- [ ] All CRUD operations tested with real data
- [ ] Error states display correctly (from Server Actions)
- [ ] Loading states display correctly (Suspense boundaries)

### Phase 6 Exit Criteria

- [ ] **NO mock imports in components**: `grep -r "from.*mocks" src/components/` returns 0
- [ ] All components call real Server Actions
- [ ] All data flows from D1 database via Server Actions
- [ ] Error handling tested end-to-end
- [ ] Performance acceptable (LCP, FID, CLS targets)
- [ ] Ready for Phase 7 (Testing)

---

## MODULE: Phase 7 — Testing

### Your Task

Add tests for critical paths.

### Setup

```bash
pnpm install -D vitest @testing-library/react @testing-library/jest-dom
pnpm install -D @playwright/test
npx playwright install
```

### Test Structure

```
src/
├── __tests__/           # Integration tests
├── components/
│   └── Component/
│       ├── Component.tsx
│       └── Component.test.tsx  # Co-located
└── lib/
    └── validators/
        └── entity.test.ts
```

### Coverage Targets

| Type        | Target      | Focus                   |
| ----------- | ----------- | ----------------------- |
| Unit        | 80%         | Validators, utils       |
| Component   | Critical    | Interactive components  |
| Integration | Happy paths | User flows              |
| E2E         | Smoke       | Auth, critical features |

### Must-Test List

- [ ] All Zod validators
- [ ] All utility functions
- [ ] Form submissions
- [ ] Auth flows
- [ ] CRUD operations
- [ ] Error states render

---

## MODULE: Phase 8 — Performance

### Your Task

Optimize for production performance.

### Audit Commands

```bash
# Build and analyze
pnpm run build
# Check bundle
npx @next/bundle-analyzer

# Lighthouse (after deploy)
npx lighthouse [url] --view
```

### Optimization Checklist

- [ ] Images use `next/image`
- [ ] Dynamic imports for heavy components
- [ ] Suspense boundaries added
- [ ] No unnecessary client components
- [ ] Database queries optimized (indexes)
- [ ] Caching strategy implemented

### Performance Targets

| Metric              | Target  | Actual |
| ------------------- | ------- | ------ |
| LCP                 | < 2.5s  |        |
| FID                 | < 100ms |        |
| CLS                 | < 0.1   |        |
| Initial JS          | < 200kb |        |
| Time to Interactive | < 3s    |        |

---

## MODULE: Phase 9 — Deployment

### Your Task

Set up production infrastructure.

### Cloudflare Setup

```bash
# Login
npx wrangler login

# Create D1 database
npx wrangler d1 create [db-name]

# Create R2 bucket (if needed)
npx wrangler r2 bucket create [bucket-name]

# Create KV namespace (if needed)
npx wrangler kv:namespace create [namespace]
```

### wrangler.jsonc Template

```jsonc
name = "project-name"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB"
database_name = "project-db"
database_id = "xxx"

# [vars]
# PUBLIC_VAR = "value"

# Secrets set via: wrangler secret put SECRET_NAME
```

### Deployment Checklist

- [ ] `wrangler.jsonc` configured
- [ ] D1 database created
- [ ] Migrations run on production
- [ ] Environment variables set
- [ ] Secrets configured
- [ ] Domain configured
- [ ] SSL working
- [ ] Preview deployments work
- [ ] Production deployment works

---

## MODULE: Phase 10 — Launch

### Your Task

Go live safely.

### Pre-Launch Checklist

- [ ] All tests pass
- [ ] Performance targets met
- [ ] Security review complete
- [ ] Error tracking configured
- [ ] Analytics configured (if needed)
- [ ] Backup strategy in place
- [ ] Rollback plan documented

### Monitoring Setup

- [ ] Error tracking (Sentry, etc.)
- [ ] Uptime monitoring
- [ ] Performance monitoring
- [ ] Alerting configured

### Launch Day

- [ ] Final smoke test on production
- [ ] Monitor error rates (1 hour)
- [ ] Monitor performance (1 hour)
- [ ] Be available for hotfixes

### Post-Launch

- [ ] Document known issues
- [ ] Gather initial feedback
- [ ] Plan v1.1 improvements

---

# EXTENSION MODULES

> **Usage:** Load these modules when the feature is needed.
> These extend the core phases with specific implementation details.

---

## MODULE: Cloudflare R2 — File Storage

### Overview

R2 is S3-compatible object storage. Use for user uploads, assets, exports.

### When to Use

- User profile images
- Document uploads
- Generated exports (PDFs, CSVs)
- Any file > 1MB

### Setup

**1. Create R2 Bucket**

```bash
npx wrangler r2 bucket create [project]-uploads
```

**2. Update wrangler.jsonc**

```jsonc
[[r2_buckets]]
binding = "R2"
bucket_name = "project-uploads"
```

**3. TypeScript Bindings**

```typescript
// src/types/cloudflare.ts
export interface CloudflareEnv {
  DB: D1Database;
  R2: R2Bucket;
}
```

### Implementation Pattern

**File Upload Action**

```typescript
// src/actions/upload.ts
"use server";

import { z } from "zod";
import { getCloudflareContext } from "@cloudflare/next-on-pages";
import { createId } from "@paralleldrive/cuid2";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const uploadSchema = z.object({
  fileName: z.string(),
  fileType: z
    .string()
    .refine((t) => ALLOWED_TYPES.includes(t), "Invalid file type"),
  fileSize: z.number().max(MAX_FILE_SIZE, "File too large"),
});

type UploadResult =
  | { success: true; data: { key: string; url: string } }
  | { success: false; error: { code: string; message: string } };

export async function getUploadUrl(
  input: z.infer<typeof uploadSchema>
): Promise<UploadResult> {
  const parsed = uploadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: parsed.error.message },
    };
  }

  // Generate unique key
  const ext = parsed.data.fileName.split(".").pop();
  const key = `uploads/${createId()}.${ext}`;

  // For direct upload, return signed URL (requires R2 public access or presigned URL)
  // Simple approach: return the key, upload via API route

  return {
    success: true,
    data: { key, url: `/api/upload?key=${encodeURIComponent(key)}` },
  };
}

export async function deleteFile(key: string): Promise<{ success: boolean }> {
  try {
    const { env } = getCloudflareContext();
    await env.R2.delete(key);
    return { success: true };
  } catch {
    return { success: false };
  }
}
```

**Upload API Route (for multipart)**

```typescript
// src/app/api/upload/route.ts
import { getCloudflareContext } from "@cloudflare/next-on-pages";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function PUT(request: NextRequest) {
  const { env } = getCloudflareContext();
  const key = request.nextUrl.searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  // TODO: Add auth check here

  const contentType =
    request.headers.get("content-type") || "application/octet-stream";
  const body = await request.arrayBuffer();

  try {
    await env.R2.put(key, body, {
      httpMetadata: { contentType },
    });

    return NextResponse.json({ success: true, key });
  } catch (e) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
```

**Download/Serve Files**

```typescript
// src/app/api/files/[...path]/route.ts
import { getCloudflareContext } from "@cloudflare/next-on-pages";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const { env } = getCloudflareContext();
  const key = params.path.join("/");

  // TODO: Add auth check for private files

  const object = await env.R2.get(key);

  if (!object) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    object.httpMetadata?.contentType || "application/octet-stream"
  );
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new NextResponse(object.body, { headers });
}
```

**React Upload Component**

```tsx
// src/components/ui/file-upload.tsx
"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUploadUrl } from "@/actions/upload";

interface FileUploadProps {
  onUploadComplete: (key: string) => void;
  accept?: string;
  maxSize?: number; // bytes
}

export function FileUpload({
  onUploadComplete,
  accept = "image/*",
  maxSize = 10 * 1024 * 1024,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);

      try {
        // Get upload URL
        const result = await getUploadUrl({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        });

        if (!result.success) {
          throw new Error(result.error.message);
        }

        // Upload file
        const response = await fetch(result.data.url, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!response.ok) throw new Error("Upload failed");

        onUploadComplete(result.data.key);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onUploadComplete]
  );

  return (
    <div className="border-2 border-dashed rounded-lg p-6 text-center">
      <input
        type="file"
        accept={accept}
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        className="hidden"
        id="file-upload"
        disabled={uploading}
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        {uploading ? (
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
        ) : (
          <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          {uploading ? "Uploading..." : "Click to upload"}
        </p>
      </label>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
```

### R2 Checklist

- [ ] R2 bucket created
- [ ] Binding added to wrangler.jsonc
- [ ] Upload action with validation
- [ ] Upload API route
- [ ] Download/serve route
- [ ] Auth checks on private files
- [ ] File size limits enforced
- [ ] File type validation
- [ ] Cleanup of orphaned files (if needed)

---

## MODULE: Resend — Transactional Email

### Overview

Resend is a modern email API. Use for transactional emails (welcome, reset password, notifications).

### When to Use

- Welcome emails
- Password reset
- Email verification
- Notifications
- Receipts/invoices

### Setup

**1. Install Package**

```bash
pnpm install resend
```

**2. Get API Key**

- Sign up at resend.com
- Create API key
- Add to secrets:

```bash
npx wrangler secret put RESEND_API_KEY
```

**3. Configure Domain (Production)**

- Add domain in Resend dashboard
- Configure DNS records
- Verify domain

### Implementation Pattern

**Email Client**

```typescript
// src/lib/email/client.ts
import { Resend } from "resend";

// Note: Initialize per-request in edge runtime
export function getEmailClient(apiKey: string) {
  return new Resend(apiKey);
}
```

**Email Templates**

```tsx
// src/lib/email/templates/welcome.tsx
import * as React from "react";

interface WelcomeEmailProps {
  name: string;
  loginUrl: string;
}

export function WelcomeEmail({ name, loginUrl }: WelcomeEmailProps) {
  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ color: "#333" }}>Welcome, {name}!</h1>
      <p style={{ color: "#666", lineHeight: 1.6 }}>
        Thanks for signing up. We're excited to have you on board.
      </p>
      <a
        href={loginUrl}
        style={{
          display: "inline-block",
          padding: "12px 24px",
          backgroundColor: "#000",
          color: "#fff",
          textDecoration: "none",
          borderRadius: 6,
          marginTop: 16,
        }}
      >
        Get Started
      </a>
    </div>
  );
}
```

```tsx
// src/lib/email/templates/password-reset.tsx
import * as React from "react";

interface PasswordResetEmailProps {
  resetUrl: string;
  expiresIn: string;
}

export function PasswordResetEmail({
  resetUrl,
  expiresIn,
}: PasswordResetEmailProps) {
  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ color: "#333" }}>Reset Your Password</h1>
      <p style={{ color: "#666", lineHeight: 1.6 }}>
        Click the button below to reset your password. This link expires in{" "}
        {expiresIn}.
      </p>
      <a
        href={resetUrl}
        style={{
          display: "inline-block",
          padding: "12px 24px",
          backgroundColor: "#000",
          color: "#fff",
          textDecoration: "none",
          borderRadius: 6,
          marginTop: 16,
        }}
      >
        Reset Password
      </a>
      <p style={{ color: "#999", fontSize: 14, marginTop: 24 }}>
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  );
}
```

**Email Actions**

```typescript
// src/actions/email.ts
"use server";

import { getCloudflareContext } from "@cloudflare/next-on-pages";
import { getEmailClient } from "@/lib/email/client";
import { WelcomeEmail } from "@/lib/email/templates/welcome";
import { PasswordResetEmail } from "@/lib/email/templates/password-reset";
import { render } from "@react-email/render";

const FROM_EMAIL = "noreply@yourdomain.com"; // Must be verified domain

type EmailResult =
  | { success: true; messageId: string }
  | { success: false; error: string };

export async function sendWelcomeEmail(
  to: string,
  name: string
): Promise<EmailResult> {
  try {
    const { env } = getCloudflareContext();
    const resend = getEmailClient(env.RESEND_API_KEY);

    const html = render(
      <WelcomeEmail name={name} loginUrl="https://app.yourdomain.com" />
    );

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Welcome to [App Name], ${name}!`,
      html,
    });

    if (error) {
      console.error("Email send failed:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data!.id };
  } catch (e) {
    console.error("Email error:", e);
    return { success: false, error: "Failed to send email" };
  }
}

export async function sendPasswordResetEmail(
  to: string,
  resetToken: string
): Promise<EmailResult> {
  try {
    const { env } = getCloudflareContext();
    const resend = getEmailClient(env.RESEND_API_KEY);

    const resetUrl = `https://app.yourdomain.com/reset-password?token=${resetToken}`;
    const html = render(
      <PasswordResetEmail resetUrl={resetUrl} expiresIn="1 hour" />
    );

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Reset your password",
      html,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data!.id };
  } catch (e) {
    return { success: false, error: "Failed to send email" };
  }
}
```

### Email Checklist

- [ ] Resend account created
- [ ] API key stored as secret
- [ ] Domain verified (production)
- [ ] Email templates created
- [ ] Send actions implemented
- [ ] Error handling in place
- [ ] Rate limiting considered
- [ ] Unsubscribe link (for marketing emails)

---

## MODULE: Google Identity Platform — Authentication

### Overview

Google Identity Platform provides email/password auth and Google OAuth. This module covers both.

### Architecture Decision

**Options:**
| Approach | Pros | Cons |
|----------|------|------|
| Firebase Client SDK | Easy setup | Large bundle, client-side only |
| Firebase Admin SDK | Full control | Not edge-compatible |
| Google Identity Services + Custom | Edge-native, small bundle | More manual work |

**Recommended:** Google Identity Services (GIS) for OAuth + custom email/password with Google Identity Toolkit API.

### Setup

**1. Google Cloud Console**

- Create project at console.cloud.google.com
- Enable Identity Toolkit API
- Enable Google Sign-In (OAuth)
- Configure OAuth consent screen
- Create OAuth 2.0 credentials (Web application)
- Create API key for Identity Toolkit

**2. Environment Variables**

```bash
# Add to wrangler secrets
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
npx wrangler secret put GOOGLE_API_KEY
```

**3. Database Schema**

```typescript
// src/db/schema.ts (add to existing)
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  name: text("name"),
  image: text("image"),
  googleId: text("google_id").unique(),
  passwordHash: text("password_hash"), // null for OAuth-only users
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

export const sessions = sqliteTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const passwordResetTokens = sqliteTable("password_reset_tokens", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});
```

### Implementation: Email/Password Auth

**Password Utilities**

```typescript
// src/lib/auth/password.ts
// Using Web Crypto API (edge-compatible)

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const key = await crypto.subtle.importKey(
    "raw",
    data,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256
  );

  const hashArray = new Uint8Array(hash);
  const combined = new Uint8Array(salt.length + hashArray.length);
  combined.set(salt);
  combined.set(hashArray, salt.length);

  return btoa(String.fromCharCode(...combined));
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const combined = Uint8Array.from(atob(storedHash), (c) => c.charCodeAt(0));
  const salt = combined.slice(0, 16);
  const originalHash = combined.slice(16);

  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const key = await crypto.subtle.importKey(
    "raw",
    data,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256
  );

  const hashArray = new Uint8Array(hash);

  if (hashArray.length !== originalHash.length) return false;

  let match = true;
  for (let i = 0; i < hashArray.length; i++) {
    if (hashArray[i] !== originalHash[i]) match = false;
  }

  return match;
}
```

**Session Management**

```typescript
// src/lib/auth/session.ts
import { cookies } from "next/headers";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

const SESSION_COOKIE = "session";
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function createSession(userId: string): Promise<string> {
  const sessionId = createId();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
  });

  cookies().set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return sessionId;
}

export async function getSession() {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const [session] = await db
    .select()
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.id, sessionId), gt(sessions.expiresAt, new Date())))
    .limit(1);

  if (!session) return null;

  return {
    session: session.sessions,
    user: session.users,
  };
}

export async function deleteSession(): Promise<void> {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;
  if (sessionId) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }
  cookies().delete(SESSION_COOKIE);
}
```

**Auth Actions**

```typescript
// src/actions/auth.ts
"use server";

import { z } from "zod";
import { db } from "@/db";
import { users, passwordResetTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, deleteSession } from "@/lib/auth/session";
import { sendWelcomeEmail, sendPasswordResetEmail } from "@/actions/email";
import { createId } from "@paralleldrive/cuid2";
import { redirect } from "next/navigation";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(1).max(100),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthResult =
  | { success: true }
  | { success: false; error: { code: string; message: string } };

export async function signUp(
  input: z.infer<typeof signUpSchema>
): Promise<AuthResult> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Invalid input" },
    };
  }

  const { email, password, name } = parsed.data;

  // Check if user exists
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing.length > 0) {
    return {
      success: false,
      error: { code: "EMAIL_EXISTS", message: "Email already registered" },
    };
  }

  // Create user
  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      name,
    })
    .returning();

  // Create session
  await createSession(user.id);

  // Send welcome email (don't await, fire and forget)
  sendWelcomeEmail(email, name);

  return { success: true };
}

export async function signIn(
  input: z.infer<typeof signInSchema>
): Promise<AuthResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Invalid input" },
    };
  }

  const { email, password } = parsed.data;

  // Find user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (!user || !user.passwordHash) {
    return {
      success: false,
      error: {
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
      },
    };
  }

  // Verify password
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return {
      success: false,
      error: {
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
      },
    };
  }

  // Create session
  await createSession(user.id);

  return { success: true };
}

export async function signOut(): Promise<void> {
  await deleteSession();
  redirect("/");
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  // Always return success to prevent email enumeration
  if (!user) {
    return { success: true };
  }

  // Create reset token
  const token = createId();
  const tokenHash = await hashPassword(token); // Reuse password hash function

  await db.insert(passwordResetTokens).values({
    userId: user.id,
    tokenHash,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  });

  // Send email
  await sendPasswordResetEmail(email, token);

  return { success: true };
}
```

### Implementation: Google OAuth

**OAuth Utilities**

```typescript
// src/lib/auth/google.ts
import { getCloudflareContext } from "@cloudflare/next-on-pages";

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  picture: string;
}

export function getGoogleAuthUrl(redirectUri: string, state: string): string {
  const { env } = getCloudflareContext();

  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "consent",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function exchangeCodeForTokens(
  code: string,
  redirectUri: string
): Promise<GoogleTokenResponse> {
  const { env } = getCloudflareContext();

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange code for tokens");
  }

  return response.json();
}

export async function getGoogleUserInfo(
  accessToken: string
): Promise<GoogleUserInfo> {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get user info");
  }

  return response.json();
}
```

**OAuth Routes**

```typescript
// src/app/api/auth/google/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/auth/google";
import { createId } from "@paralleldrive/cuid2";
import { cookies } from "next/headers";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const state = createId();
  const redirectUri = `${request.nextUrl.origin}/api/auth/google/callback`;

  // Store state in cookie for verification
  cookies().set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });

  const authUrl = getGoogleAuthUrl(redirectUri, state);

  return NextResponse.redirect(authUrl);
}
```

```typescript
// src/app/api/auth/google/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens, getGoogleUserInfo } from "@/lib/auth/google";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSession } from "@/lib/auth/session";
import { cookies } from "next/headers";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const storedState = cookies().get("oauth_state")?.value;
  const error = request.nextUrl.searchParams.get("error");

  // Clear state cookie
  cookies().delete("oauth_state");

  // Handle errors
  if (error) {
    return NextResponse.redirect(
      `${request.nextUrl.origin}/sign-in?error=oauth_cancelled`
    );
  }

  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(
      `${request.nextUrl.origin}/sign-in?error=invalid_state`
    );
  }

  try {
    const redirectUri = `${request.nextUrl.origin}/api/auth/google/callback`;

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code, redirectUri);

    // Get user info
    const googleUser = await getGoogleUserInfo(tokens.access_token);

    // Find or create user
    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.googleId, googleUser.id))
      .limit(1);

    if (!user) {
      // Check if email exists (link accounts)
      [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, googleUser.email))
        .limit(1);

      if (user) {
        // Link Google account to existing user
        await db
          .update(users)
          .set({
            googleId: googleUser.id,
            emailVerified: true,
            image: user.image || googleUser.picture,
          })
          .where(eq(users.id, user.id));
      } else {
        // Create new user
        const [newUser] = await db
          .insert(users)
          .values({
            email: googleUser.email,
            emailVerified: true,
            name: googleUser.name,
            image: googleUser.picture,
            googleId: googleUser.id,
          })
          .returning();
        user = newUser;
      }
    }

    // Create session
    await createSession(user.id);

    return NextResponse.redirect(`${request.nextUrl.origin}/dashboard`);
  } catch (e) {
    console.error("OAuth callback error:", e);
    return NextResponse.redirect(
      `${request.nextUrl.origin}/sign-in?error=oauth_failed`
    );
  }
}
```

### Auth UI Components

**Sign In Form**

```tsx
// src/components/features/auth/sign-in-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/actions/auth";
import { Loader2 } from "lucide-react";

export function SignInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signIn({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    if (result.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(result.error.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign In
      </Button>
    </form>
  );
}
```

**Sign Up Form**

```tsx
// src/components/features/auth/sign-up-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/actions/auth";
import { Loader2 } from "lucide-react";

export function SignUpForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signUp({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
    });

    if (result.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(result.error.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" type="text" required autoComplete="name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
        <p className="text-xs text-muted-foreground">
          Must be at least 8 characters
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
      </Button>
    </form>
  );
}
```

**Google Sign In Button**

```tsx
// src/components/features/auth/google-sign-in-button.tsx
"use client";

import { Button } from "@/components/ui/button";

export function GoogleSignInButton() {
  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => {
        window.location.href = "/api/auth/google";
      }}
    >
      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Continue with Google
    </Button>
  );
}
```

**Auth Page Layout**

```tsx
// src/app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
```

**Sign In Page**

```tsx
// src/app/(auth)/sign-in/page.tsx
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInForm } from "@/components/features/auth/sign-in-form";
import { GoogleSignInButton } from "@/components/features/auth/google-sign-in-button";

export default function SignInPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <GoogleSignInButton />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <SignInForm />

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/sign-up" className="underline hover:text-foreground">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
```

### Auth Middleware

```typescript
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/sign-in", "/sign-up", "/forgot-password"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session");
  const isAuthenticated = !!sessionCookie?.value;
  const path = request.nextUrl.pathname;

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect non-public routes
  if (
    !isAuthenticated &&
    !publicRoutes.some((route) => path.startsWith(route))
  ) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

### Google Auth Checklist

- [ ] Google Cloud project created
- [ ] Identity Toolkit API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth credentials created
- [ ] Environment variables set
- [ ] User schema includes googleId
- [ ] Session schema created
- [ ] Password hashing implemented (edge-compatible)
- [ ] Session management implemented
- [ ] Sign up action works
- [ ] Sign in action works
- [ ] Sign out action works
- [ ] Password reset flow works
- [ ] Google OAuth redirect works
- [ ] Google OAuth callback works
- [ ] Account linking works (existing email)
- [ ] Middleware protects routes
- [ ] Auth UI components created
- [ ] Error handling complete

### Security Considerations

- [ ] Passwords hashed with PBKDF2 (100k iterations)
- [ ] Sessions are httpOnly cookies
- [ ] OAuth state parameter prevents CSRF
- [ ] Email enumeration prevented in password reset
- [ ] Rate limiting on auth endpoints (implement separately)
- [ ] Secure cookie settings in production

---

## MODULE: MSW — Mock Service Worker

### Overview

MSW intercepts network requests at the service worker level, providing realistic API mocking without changing application code. Use for client-side data fetching during development and testing.

### When to Use MSW

| Scenario                              | Use MSW? | Why                                  |
| ------------------------------------- | -------- | ------------------------------------ |
| Server Components + Server Actions    | ❌ No    | No client-side fetches to intercept  |
| Client Components + React Query/SWR   | ✅ Yes   | Intercepts fetch calls               |
| Testing components with data fetching | ✅ Yes   | Isolate tests from real APIs         |
| Simulating loading/error states       | ✅ Yes   | Control response timing and failures |
| Third-party API integration           | ✅ Yes   | Mock external services               |
| Offline development                   | ✅ Yes   | No network dependency                |

### When NOT to Use MSW

- Pure Server Components (use flat mocks or D1 seed)
- Server Actions (execute on server, not interceptable by browser SW)
- Simple static UI development (flat mocks are simpler)

### Setup

**1. Install MSW**

```bash
pnpm install -D msw
npx msw init public/ --save
```

**2. Folder Structure**

```
src/
├── mocks/
│   ├── browser.ts      # Browser service worker setup
│   ├── server.ts       # Node server setup (for tests)
│   ├── handlers/
│   │   ├── index.ts    # Export all handlers
│   │   ├── entities.ts # Entity-related handlers
│   │   └── users.ts    # User-related handlers
│   └── data/
│       ├── entities.ts # Mock data (can reuse from lib/mocks)
│       └── users.ts
```

**3. Browser Setup**

```typescript
// src/mocks/browser.ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
```

**4. Server Setup (for tests)**

```typescript
// src/mocks/server.ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

### Implementation

**Handler Definition**

```typescript
// src/mocks/handlers/entities.ts
import { http, HttpResponse, delay } from "msw";
import { mockEntities, mockEmptyEntities } from "@/lib/mocks/entities";
import { type CreateEntity } from "@/lib/validators/entity";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Simulated database (in-memory for session)
let entities = [...mockEntities];

export const entityHandlers = [
  // GET /api/entities - List all
  http.get(`${BASE_URL}/api/entities`, async () => {
    await delay(150); // Simulate network latency

    return HttpResponse.json({
      success: true,
      data: entities,
    });
  }),

  // GET /api/entities/:id - Get one
  http.get(`${BASE_URL}/api/entities/:id`, async ({ params }) => {
    await delay(100);

    const entity = entities.find((e) => e.id === params.id);

    if (!entity) {
      return HttpResponse.json(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "Entity not found" },
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({ success: true, data: entity });
  }),

  // POST /api/entities - Create
  http.post(`${BASE_URL}/api/entities`, async ({ request }) => {
    await delay(200);

    const body = (await request.json()) as CreateEntity;

    const newEntity = {
      id: `mock-${Date.now()}`,
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    entities.push(newEntity);

    return HttpResponse.json(
      { success: true, data: newEntity },
      { status: 201 }
    );
  }),

  // PATCH /api/entities/:id - Update
  http.patch(`${BASE_URL}/api/entities/:id`, async ({ params, request }) => {
    await delay(150);

    const body = (await request.json()) as Partial<CreateEntity>;
    const index = entities.findIndex((e) => e.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "Entity not found" },
        },
        { status: 404 }
      );
    }

    entities[index] = {
      ...entities[index],
      ...body,
      updatedAt: new Date(),
    };

    return HttpResponse.json({ success: true, data: entities[index] });
  }),

  // DELETE /api/entities/:id - Delete
  http.delete(`${BASE_URL}/api/entities/:id`, async ({ params }) => {
    await delay(100);

    const index = entities.findIndex((e) => e.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "Entity not found" },
        },
        { status: 404 }
      );
    }

    entities.splice(index, 1);

    return HttpResponse.json({ success: true, data: null });
  }),
];

// Reset function for tests
export function resetEntityMocks() {
  entities = [...mockEntities];
}
```

**Aggregate Handlers**

```typescript
// src/mocks/handlers/index.ts
import { entityHandlers } from "./entities";
import { userHandlers } from "./users";

export const handlers = [...entityHandlers, ...userHandlers];
```

### Simulating Edge Cases

**Error Responses**

```typescript
// src/mocks/handlers/entities.ts

// Add to handlers array for testing error states
http.get(`${BASE_URL}/api/entities/error-test`, async () => {
  await delay(100)

  return HttpResponse.json(
    { success: false, error: { code: "SERVER_ERROR", message: "Something went wrong" } },
    { status: 500 }
  )
}),
```

**Slow Responses (Loading State Testing)**

```typescript
http.get(`${BASE_URL}/api/entities/slow`, async () => {
  await delay(3000) // 3 second delay

  return HttpResponse.json({ success: true, data: mockEntities })
}),
```

**Empty Responses**

```typescript
http.get(`${BASE_URL}/api/entities/empty`, async () => {
  await delay(100)

  return HttpResponse.json({ success: true, data: [] })
}),
```

**Network Failure**

```typescript
import { http, HttpResponse, passthrough } from "msw"

http.get(`${BASE_URL}/api/entities/network-error`, () => {
  return HttpResponse.error() // Simulates network failure
}),
```

### Integration with Next.js

**Development Mode Initialization**

```typescript
// src/lib/msw-init.ts
export async function initMSW() {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    const { worker } = await import("@/mocks/browser");
    await worker.start({
      onUnhandledRequest: "bypass", // Don't warn for unhandled requests
    });
  }
}
```

**App Provider**

```tsx
// src/components/providers/msw-provider.tsx
"use client";

import { useEffect, useState } from "react";
import { initMSW } from "@/lib/msw-init";

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Only initialize in development
    if (process.env.NODE_ENV === "development") {
      initMSW().then(() => setReady(true));
    } else {
      setReady(true);
    }
  }, []);

  // Optional: Show nothing until MSW is ready
  // Remove this if you want to show UI immediately
  if (!ready) {
    return null;
  }

  return <>{children}</>;
}
```

**Root Layout Integration**

```tsx
// src/app/layout.tsx
import { MSWProvider } from "@/components/providers/msw-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MSWProvider>{children}</MSWProvider>
      </body>
    </html>
  );
}
```

### Integration with Testing

**Vitest Setup**

```typescript
// vitest.setup.ts
import { beforeAll, afterAll, afterEach } from "vitest";
import { server } from "@/mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

**Test Example**

```typescript
// src/components/features/entities/EntityList.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { EntityList } from "./EntityList";

describe("EntityList", () => {
  it("renders entities", async () => {
    render(<EntityList />);

    await waitFor(() => {
      expect(screen.getByText("First Entity")).toBeInTheDocument();
    });
  });

  it("shows error state on failure", async () => {
    // Override handler for this test
    server.use(
      http.get("/api/entities", () => {
        return HttpResponse.json(
          { success: false, error: { code: "ERROR", message: "Failed" } },
          { status: 500 }
        );
      })
    );

    render(<EntityList />);

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it("shows empty state when no entities", async () => {
    server.use(
      http.get("/api/entities", () => {
        return HttpResponse.json({ success: true, data: [] });
      })
    );

    render(<EntityList />);

    await waitFor(() => {
      expect(screen.getByText(/no entities found/i)).toBeInTheDocument();
    });
  });

  it("shows loading state", async () => {
    server.use(
      http.get("/api/entities", async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return HttpResponse.json({ success: true, data: [] });
      })
    );

    render(<EntityList />);

    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
  });
});
```

### MSW with React Query

```tsx
// src/hooks/use-entities.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type Entity, type CreateEntity } from "@/lib/validators/entity";

async function fetchEntities(): Promise<Entity[]> {
  const res = await fetch("/api/entities");
  const json = await res.json();

  if (!json.success) throw new Error(json.error.message);

  return json.data;
}

async function createEntity(input: CreateEntity): Promise<Entity> {
  const res = await fetch("/api/entities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = await res.json();

  if (!json.success) throw new Error(json.error.message);

  return json.data;
}

export function useEntities() {
  return useQuery({
    queryKey: ["entities"],
    queryFn: fetchEntities,
  });
}

export function useCreateEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEntity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entities"] });
    },
  });
}
```

**Component Using the Hook**

```tsx
// src/components/features/entities/EntityList.tsx
"use client";

import { useEntities } from "@/hooks/use-entities";
import { EntityCard } from "./EntityCard";
import { EntityListSkeleton } from "./EntityListSkeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";

export function EntityList() {
  const { data: entities, isLoading, error, refetch } = useEntities();

  if (isLoading) {
    return <EntityListSkeleton />;
  }

  if (error) {
    return (
      <ErrorState message="Failed to load entities" onRetry={() => refetch()} />
    );
  }

  if (!entities || entities.length === 0) {
    return <EmptyState message="No entities found" />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {entities.map((entity) => (
        <EntityCard key={entity.id} entity={entity} />
      ))}
    </div>
  );
}
```

### MSW Checklist

**Setup:**

- [ ] MSW installed (`pnpm install -D msw`)
- [ ] Service worker initialized (`npx msw init public/`)
- [ ] Browser setup created (`src/mocks/browser.ts`)
- [ ] Server setup created (`src/mocks/server.ts`)
- [ ] Handlers folder structure created

**Handlers:**

- [ ] Handlers defined for each API endpoint
- [ ] Handlers typed to Zod schemas
- [ ] Simulated latency added (`delay()`)
- [ ] Error scenarios covered
- [ ] Empty state scenarios covered

**Integration:**

- [ ] MSW provider created
- [ ] Provider added to root layout
- [ ] Only initializes in development mode
- [ ] Vitest setup configured

**Testing:**

- [ ] Tests can override handlers (`server.use()`)
- [ ] Reset handlers between tests (`server.resetHandlers()`)
- [ ] Loading states tested
- [ ] Error states tested
- [ ] Empty states tested

### When to Remove MSW

Unlike flat mocks, **MSW can remain in your codebase** for:

- Development mode API mocking
- Test isolation
- Offline development

**In production builds:**

- MSW is dev-only, not included in production bundle
- The `process.env.NODE_ENV === "development"` check prevents initialization

**Remove MSW only if:**

- You're not using client-side data fetching
- All data comes from Server Components/Actions
- You don't need it for testing
