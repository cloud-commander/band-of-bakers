# Full Stack Next.js + Cloudflare: Development Phases

## Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│  PHASE 0: Discovery & Requirements                                       │
├──────────────────────────────────────────────────────────────────────────┤
│  PHASE 1: Project Foundation                                             │
├──────────────────────────────────────────────────────────────────────────┤
│  PHASE 2: Data Layer                                                     │
├──────────────────────────────────────────────────────────────────────────┤
│  PHASE 3: Core UI Components                                             │
├──────────────────────────────────────────────────────────────────────────┤
│  PHASE 4: Feature Implementation                                         │
├──────────────────────────────────────────────────────────────────────────┤
│  PHASE 5: Authentication & Authorization                                 │
├──────────────────────────────────────────────────────────────────────────┤
│  PHASE 6: Integration & API Layer                                        │
├──────────────────────────────────────────────────────────────────────────┤
│  PHASE 7: Testing & Quality Assurance                                    │
├──────────────────────────────────────────────────────────────────────────┤
│  PHASE 8: Performance & Optimization                                     │
├──────────────────────────────────────────────────────────────────────────┤
│  PHASE 9: Deployment & Infrastructure                                    │
├──────────────────────────────────────────────────────────────────────────┤
│  PHASE 10: Launch & Monitoring                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## PHASE 0: Discovery & Requirements

**Goal:** Understand what we're building before writing any code.

### 0.1 Requirements Gathering

| TODO                             | Status | Notes |
| -------------------------------- | ------ | ----- |
| Define core problem being solved | ⬜     |       |
| Identify target users/personas   | ⬜     |       |
| List must-have features (MVP)    | ⬜     |       |
| List nice-to-have features (v2+) | ⬜     |       |
| Define success metrics           | ⬜     |       |

### 0.2 Technical Constraints

| TODO                                    | Status | Notes |
| --------------------------------------- | ------ | ----- |
| Confirm deployment target (Cloudflare)  | ⬜     |       |
| Identify third-party integrations       | ⬜     |       |
| Define performance requirements         | ⬜     |       |
| Establish budget constraints            | ⬜     |       |
| Determine compliance needs (GDPR, etc.) | ⬜     |       |

### 0.3 Documentation

| TODO                               | Status | Notes |
| ---------------------------------- | ------ | ----- |
| Create `SPEC.md` with requirements | ⬜     |       |
| Create `ARCHITECTURE.md` outline   | ⬜     |       |
| Define glossary of domain terms    | ⬜     |       |

**Phase 0 Exit Criteria:**

- [ ] User has approved `SPEC.md`
- [ ] MVP scope is clearly defined and bounded
- [ ] Technical constraints are documented

---

## PHASE 1: Project Foundation

**Goal:** Set up a working development environment with all tooling.

### 1.1 Repository Setup

| TODO                              | Status | Notes                                     |
| --------------------------------- | ------ | ----------------------------------------- |
| Initialize Next.js 15 project     | ⬜     | `npx create-next-app@latest`              |
| Ensure Next.js 15 (not 16)        | ⬜     | Version 16 not compatible with Cloudflare |
| Configure webpack (not turbopack) | ⬜     | Turbopack not compatible with Cloudflare  |
| Configure for Cloudflare          | ⬜     | Install `@opennextjs/cloudflare`          |
| Initialize git repository         | ⬜     |                                           |
| Create `.gitignore`               | ⬜     |                                           |
| Set up branch protection rules    | ⬜     |                                           |

### 1.2 TypeScript Configuration

| TODO                                       | Status | Notes |
| ------------------------------------------ | ------ | ----- |
| Configure `tsconfig.json` (strict mode)    | ⬜     |       |
| Set up path aliases (`@/components`, etc.) | ⬜     |       |
| Add `tsconfig.json` for Cloudflare Workers | ⬜     |       |

### 1.3 Code Quality Tooling

| TODO                          | Status | Notes |
| ----------------------------- | ------ | ----- |
| Install & configure ESLint    | ⬜     |       |
| Install & configure Prettier  | ⬜     |       |
| Set up Husky pre-commit hooks | ⬜     |       |
| Configure lint-staged         | ⬜     |       |
| Add `.editorconfig`           | ⬜     |       |

### 1.4 Styling Setup

| TODO                              | Status | Notes                    |
| --------------------------------- | ------ | ------------------------ |
| Configure Tailwind CSS            | ⬜     |                          |
| Set up CSS variables for theming  | ⬜     |                          |
| Install `clsx` + `tailwind-merge` | ⬜     |                          |
| Create `cn()` utility function    | ⬜     |                          |
| Initialize Shadcn/UI              | ⬜     | `npx shadcn@latest init` |

### 1.5 Project Structure

| TODO                                                  | Status | Notes |
| ----------------------------------------------------- | ------ | ----- |
| Create folder structure (user approved)               | ⬜     |       |
| Add README.md with setup instructions                 | ⬜     |       |
| Create environment variable template (`.env.example`) | ⬜     |       |

**Proposed Structure:**

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   ├── (dashboard)/       # Protected routes
│   ├── api/               # API routes (if needed)
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                # Shadcn primitives
│   └── features/          # Feature-specific components
├── db/
│   ├── schema.ts          # Drizzle schema
│   ├── relations.ts       # Table relations
│   ├── migrations/        # Migration files
│   └── index.ts           # DB client export
├── lib/
│   ├── validators/        # Zod schemas
│   ├── utils/             # Utility functions
│   └── constants.ts       # App constants
├── hooks/                 # Custom React hooks
├── types/                 # Shared TypeScript types
└── actions/               # Server Actions
```

**Phase 1 Exit Criteria:**

- [ ] `npm run dev` works without errors
- [ ] `npm run build` completes successfully
- [ ] Linting passes with no errors
- [ ] User has approved folder structure

---

## PHASE 2: Data Layer

**Goal:** Define and validate all data structures before building UI.

### 2.1 Schema Design

| TODO                                    | Status | Notes |
| --------------------------------------- | ------ | ----- |
| Identify all entities from requirements | ⬜     |       |
| Define entity relationships (ERD)       | ⬜     |       |
| Get user approval on data model         | ⬜     |       |

### 2.2 Database Schema (Drizzle)

| TODO                           | Status | Notes |
| ------------------------------ | ------ | ----- |
| Install Drizzle ORM + kit      | ⬜     |       |
| Configure `drizzle.config.ts`  | ⬜     |       |
| Create table schemas           | ⬜     |       |
| Define relations               | ⬜     |       |
| Add indexes for query patterns | ⬜     |       |
| Generate initial migration     | ⬜     |       |

### 2.3 Validation Schemas (Zod)

| TODO                                 | Status | Notes |
| ------------------------------------ | ------ | ----- |
| Create Zod schemas for each entity   | ⬜     |       |
| Create insert/update schema variants | ⬜     |       |
| Create API response schemas          | ⬜     |       |
| Export inferred TypeScript types     | ⬜     |       |

### 2.4 Database Utilities

| TODO                            | Status | Notes |
| ------------------------------- | ------ | ----- |
| Create DB client wrapper        | ⬜     |       |
| Set up local D1 for development | ⬜     |       |
| Create seed script for dev data | ⬜     |       |
| Test migrations locally         | ⬜     |       |

### 2.5 Flat Mock Data Files

| TODO                                                        | Status | Notes                         |
| ----------------------------------------------------------- | ------ | ----------------------------- |
| Create mock file for each entity                            | ⬜     | `src/lib/mocks/[entity].ts`   |
| Include standard mock (happy path)                          | ⬜     |                               |
| Include empty state mock                                    | ⬜     |                               |
| Include error/failure scenarios                             | ⬜     |                               |
| Include edge case mocks (long text, many items, pagination) | ⬜     |                               |
| Type all mocks to Zod schemas                               | ⬜     | Must match validators exactly |
| Add removal markers (`// MOCK DATA: Replace with [Action]`) | ⬜     | For Phase 6                   |
| Export mock data as named exports                           | ⬜     | Not default exports           |

**Mock Data Strategy:**

```
Phase 3 (Core UI Components):  Flat mock files ONLY (fast, offline, all states)
Phase 4 (Feature Implementation): Flat mock files ONLY (complete UX validation)
Phase 5 (Auth):                 Add auth with flat mocks still in place
Phase 6 (Integration):          Swap mocks → real Server Actions (one-by-one)
Phase 7+ (Testing/Deployment):  Zero mocks remaining
```

**Mock File Structure:**

```typescript
// src/lib/mocks/tasks.ts
export const mockTaskHappy = {
  id: "1",
  title: "Complete project setup",
  completed: false,
};

export const mockTaskEmpty: (typeof mockTaskHappy)[] = [];

export const mockTaskMany = [
  { id: "1", title: "Task 1", completed: false },
  { id: "2", title: "Task 2", completed: true },
  // ... 50+ more
];

export const mockTaskLongText = {
  id: "3",
  title: "Task with extremely long description to test text wrapping",
  completed: false,
};

// For error states, use try/catch in components or null check
// Don't use undefined for error representation - let Server Actions return errors
```

### 2.6 MSW Setup (Deferred to Phase 6)

_Only if needed for client-side data fetching integration testing._

**Decision Point (Confirm with user):**

- [ ] Will we use Server Actions (recommended, skip MSW)
- [ ] Will we use client-side fetching (React Query/SWR, need MSW)

If using **Server Actions only** (Phase 6 integration):

- ❌ Skip MSW entirely — flat mocks sufficient for UI development
- ✅ Replace mocks directly with Server Action calls

If using **client-side fetching** (React Query/SWR):

- Set up MSW in Phase 6 when connecting to real data
- MSW handlers replace flat mocks for client fetching

| TODO                           | Status | Notes                              |
| ------------------------------ | ------ | ---------------------------------- |
| Confirm data fetching strategy | ⬜     | Server Actions vs client fetching? |
| MSW Setup (if client fetching) | ⬜     | Defer to Phase 6                   |

**Phase 2 Exit Criteria:**

- [ ] All Zod schemas compile without errors
- [ ] Drizzle ORM schemas defined and validated
- [ ] Migrations run successfully on local D1
- [ ] Seed script works for manual testing
- [ ] **Flat mock files created for ALL entities** (typed to Zod schemas)
- [ ] Mock files cover: happy path, empty, errors, edge cases
- [ ] All mocks marked for Phase 6 removal
- [ ] User has approved data model
- [ ] Backend team can begin Phase 6 work in parallel

---

## PHASE 3: Core UI Components

**Goal:** Build the reusable UI foundation using **flat mock files** (no database calls).

### Why Flat Mocks for UI Development?

- **Instant hot reload** — No async overhead, immediate feedback
- **Complete offline** — Works without database or backend
- **Test edge cases easily** — Empty states, long text, many items
- **Decoupled from data layer** — UI team works independently
- **Fast iteration** — Change mock data, see UI instantly
- **No backend blocking** — Frontend work continues parallel to backend

### The Mock-First Philosophy

Phases 3-4 are **completely driven by flat mock data files**. No actual database calls, no Server Actions, no API routes. This allows:

✅ UI components to be fully developed and tested  
✅ All user workflows to be validated with mock data  
✅ Edge cases (empty, error, loading) to be experienced early  
✅ Backend and frontend teams to work in parallel  
✅ Quick design changes without data layer complications

**Frontend team:** Uses `src/lib/mocks/*.ts` files  
**Backend team:** Simultaneously builds database schema & Server Actions  
**Integration:** Phase 6 swaps mock files for real data

### 3.1 Design System Setup

| TODO                         | Status | Notes |
| ---------------------------- | ------ | ----- |
| Define color palette / theme | ⬜     |       |
| Set up typography scale      | ⬜     |       |
| Define spacing system        | ⬜     |       |
| Create design tokens         | ⬜     |       |

### 3.2 Shadcn Component Installation

| TODO                                   | Status | Notes |
| -------------------------------------- | ------ | ----- |
| Install Button component               | ⬜     |       |
| Install Input/Form components          | ⬜     |       |
| Install Card component                 | ⬜     |       |
| Install Dialog/Modal component         | ⬜     |       |
| Install Toast/Sonner for notifications | ⬜     |       |
| Install Dropdown/Select                | ⬜     |       |
| Install Table (if needed)              | ⬜     |       |
| Install other required components      | ⬜     |       |

### 3.3 Layout Components

| TODO                             | Status | Notes |
| -------------------------------- | ------ | ----- |
| Create root layout               | ⬜     |       |
| Create navigation/header         | ⬜     |       |
| Create sidebar (if applicable)   | ⬜     |       |
| Create footer (if applicable)    | ⬜     |       |
| Create page container/wrapper    | ⬜     |       |
| Implement responsive breakpoints | ⬜     |       |

### 3.4 State Components

| TODO                               | Status | Notes |
| ---------------------------------- | ------ | ----- |
| Create loading skeleton components | ⬜     |       |
| Create empty state component       | ⬜     |       |
| Create error state component       | ⬜     |       |
| Create error boundary              | ⬜     |       |

### 3.5 Mock Data Integration

| TODO                                         | Status | Notes                          |
| -------------------------------------------- | ------ | ------------------------------ |
| Import mock data from `src/lib/mocks/*.ts`   | ⬜     | Already created in Phase 2     |
| Test all mock variants (happy, empty, error) | ⬜     | In each component              |
| Verify components handle all states          | ⬜     | Loading, empty, error, success |
| Document mock usage in component files       | ⬜     | Where mocks are used           |

**Phase 3 Exit Criteria:**

- [ ] **All core components render correctly with mock data**
- [ ] **All UI states implemented:** loading skeletons, empty states, error states, success states
- [ ] Components are accessible (keyboard nav, ARIA)
- [ ] Responsive design works at all breakpoints
- [ ] User has approved visual design direction
- [ ] **No Server Actions or database calls yet** (pure UI with mocks)

---

## PHASE 4: Feature Implementation

**Goal:** Build feature-specific UI using **flat mock files only**. Complete all user workflows with mocks before any backend wiring.

### Phase 4 & 5: Can Run in Parallel

**Dependency:** Phase 4 features **do not require** Phase 5 (Auth) to be complete. They can develop in parallel:

- **If auth is needed** in feature workflows: Mock auth context/hooks in Phase 4
- **If auth is separate**: Build Phase 4 features, add real auth in Phase 5 without UI changes

_This keeps teams unblocked during development._

### Why Mocks Only in Phase 4?

Phase 4 is the **critical validation phase**:

- ✅ **All workflows work with mock data** — No backend dependencies
- ✅ **All edge cases tested** — Empty, error, loading, success
- ✅ **Design locked down** — Before backend changes it
- ✅ **Backend can develop in parallel** — No blocking
- ✅ **Easy to fix UI issues** — Just update mock data

### No Database Calls Yet

**Phase 4 is 100% frontend:**

- ❌ No Server Actions
- ❌ No database queries
- ❌ No API calls
- ❌ No backend dependencies
- ✅ Only mock data from `src/lib/mocks/*.ts`

_Repeat this section for each feature._

### 4.X Feature: [Feature Name]

| TODO                             | Status | Notes |
| -------------------------------- | ------ | ----- |
| Define feature requirements      | ⬜     |       |
| Create component tree diagram    | ⬜     |       |
| Get user approval on approach    | ⬜     |       |
| Build parent container component | ⬜     |       |
| Build child components           | ⬜     |       |
| Implement loading state          | ⬜     |       |
| Implement empty state            | ⬜     |       |
| Implement error state            | ⬜     |       |
| Add client-side interactivity    | ⬜     |       |
| Connect to mock data             | ⬜     |       |
| Test all user interactions       | ⬜     |       |

**Feature Checklist Template:**

```markdown
### Feature: **\*\***\_\_\_**\*\***

**Components Created:**

- [ ] `ComponentA.tsx`
- [ ] `ComponentB.tsx`

**States Handled:**

- [ ] Loading
- [ ] Empty
- [ ] Error
- [ ] Success

**Interactions:**

- [ ] Click handlers
- [ ] Form submissions
- [ ] Keyboard navigation

**Mocks Used (to replace in Phase 6):**

- [ ] `mockDataX` in `ComponentA`
```

**Phase 4 Exit Criteria:**

- [ ] **All features fully work with mock data only**
- [ ] **User can complete 100% of all workflows** using mocks
- [ ] All edge cases tested (empty, error, loading, success)
- [ ] No console errors or TypeScript errors
- [ ] All user interactions work (forms, navigation, modals, etc.)
- [ ] **Zero backend/Server Action calls** (pure frontend)
- [ ] User has approved feature UX and workflows
- [ ] Backend team has completed Phase 2 schema (ready for Phase 6)
- [ ] _(Optional) Auth flow mocked if needed for feature workflows_

---

## PHASE 5: Authentication & Authorization

**Goal:** Secure the application appropriately.

### 5.1 Auth Strategy Selection

| TODO                                   | Status | Notes |
| -------------------------------------- | ------ | ----- |
| Confirm auth requirements with user    | ⬜     |       |
| Select auth provider (discuss options) | ⬜     |       |
| Get user approval on approach          | ⬜     |       |

### 5.2 Auth Implementation

| TODO                                     | Status | Notes |
| ---------------------------------------- | ------ | ----- |
| Install auth package                     | ⬜     |       |
| Configure auth provider                  | ⬜     |       |
| Create auth middleware                   | ⬜     |       |
| Implement sign-up flow                   | ⬜     |       |
| Implement sign-in flow                   | ⬜     |       |
| Implement sign-out                       | ⬜     |       |
| Implement password reset (if applicable) | ⬜     |       |
| Add session management                   | ⬜     |       |

### 5.3 Auth UI

| TODO                         | Status | Notes |
| ---------------------------- | ------ | ----- |
| Create sign-in page          | ⬜     |       |
| Create sign-up page          | ⬜     |       |
| Create forgot password page  | ⬜     |       |
| Add auth state to navigation | ⬜     |       |
| Create user profile dropdown | ⬜     |       |

### 5.4 Authorization

| TODO                              | Status | Notes |
| --------------------------------- | ------ | ----- |
| Define user roles (if applicable) | ⬜     |       |
| Implement route protection        | ⬜     |       |
| Add role-based access control     | ⬜     |       |
| Protect Server Actions            | ⬜     |       |

**Phase 5 Exit Criteria:**

- [ ] Auth flows work end-to-end
- [ ] Protected routes redirect correctly
- [ ] Sessions persist appropriately
- [ ] User has tested auth flows

---

## PHASE 6: Integration & API Layer

**Goal:** Replace all flat mock files with real data operations (Server Actions, database calls).

### ⚠️ CRITICAL: Mock Replacement Phase

This phase **removes all mocks** and wires real data:

1. Keep mock files nearby for reference
2. Replace one component at a time
3. Test after each replacement
4. Delete mock imports when done
5. Verify no mocks remain in codebase

### 6.1 Server Actions Setup

| TODO                             | Status | Notes |
| -------------------------------- | ------ | ----- |
| Create actions folder structure  | ⬜     |       |
| Set up error handling pattern    | ⬜     |       |
| Create reusable action utilities | ⬜     |       |

### 6.2 CRUD Operations

_For each entity:_
| TODO | Status | Notes |
|------|--------|-------|
| Create `create[Entity]` action | ⬜ | |
| Create `get[Entity]` action | ⬜ | |
| Create `get[Entities]` (list) action | ⬜ | |
| Create `update[Entity]` action | ⬜ | |
| Create `delete[Entity]` action | ⬜ | |
| Add input validation (Zod) | ⬜ | |
| Add authorization checks | ⬜ | |

### 6.3 Mock Replacement Tracker

**ALL mocks must be tracked and replaced in Phase 6. No mock data should remain in production code.**

_Before Phase 6 starts:_ Backend team should have provided a list of all mock locations from Phase 4 development.

**Example Tracker:**
| Mock Location | Component | Replaced With | Status | Verified |
|---|---|---|---|---|
| `ComponentA` uses `mockUsers` | UserList.tsx | `getUsers()` Server Action | ⬜ | ⬜ |
| `ComponentB` uses `mockPosts` | PostFeed.tsx | `getPosts()` Server Action | ⬜ | ⬜ |
| `lib/mocks/tasks.ts` (all) | Various | `createTask()`, `getTasks()`, etc. | ⬜ | ⬜ |
| _Add all mocks from Phase 4_ | | | | |

**Replacement Process per Component:**

1. Identify all mock files imported: `grep -r "from.*mocks" src/`
2. Create corresponding Server Action
3. Swap import: `mockData` → `fetchData()`
4. Test the component
5. Delete mock import
6. ✅ Mark as replaced

### 6.4 External Integrations

| TODO                                | Status | Notes |
| ----------------------------------- | ------ | ----- |
| List all external APIs needed       | ⬜     |       |
| Create API client wrappers          | ⬜     |       |
| Add error handling for API failures | ⬜     |       |
| Implement retry logic (if needed)   | ⬜     |       |

### 6.5 Cloudflare Services

| TODO                                   | Status | Notes |
| -------------------------------------- | ------ | ----- |
| Configure D1 bindings                  | ⬜     |       |
| Set up R2 for file storage (if needed) | ⬜     |       |
| Configure KV for caching (if needed)   | ⬜     |       |
| Set up Queues (if needed)              | ⬜     |       |

**Phase 6 Exit Criteria:**

- [ ] **All mocks replaced with Server Actions / database calls**
- [ ] **ZERO mock imports in components** (`grep -r "from.*mocks" src/components/` returns 0 results)
- [ ] Mock files still exist in `src/lib/mocks/` for reference only (not imported)
- [ ] All CRUD operations work correctly
- [ ] Error states display appropriately from real Server Action errors
- [ ] External integrations working
- [ ] All components load real data, not mocks

---

## PHASE 7: Testing & Quality Assurance

**Goal:** Ensure reliability and catch bugs before deployment.

### 7.1 Testing Setup

| TODO                          | Status | Notes |
| ----------------------------- | ------ | ----- |
| Install Vitest                | ⬜     |       |
| Install React Testing Library | ⬜     |       |
| Install Playwright (E2E)      | ⬜     |       |
| Configure test environments   | ⬜     |       |
| Set up test database          | ⬜     |       |

### 7.2 Unit Tests

| TODO                     | Status | Notes |
| ------------------------ | ------ | ----- |
| Test all Zod validators  | ⬜     |       |
| Test utility functions   | ⬜     |       |
| Test custom hooks        | ⬜     |       |
| Test pure business logic | ⬜     |       |

### 7.3 Component Tests

| TODO                        | Status | Notes |
| --------------------------- | ------ | ----- |
| Test interactive components | ⬜     |       |
| Test form components        | ⬜     |       |
| Test conditional rendering  | ⬜     |       |
| Test loading/error states   | ⬜     |       |

### 7.4 Integration Tests

| TODO                     | Status | Notes |
| ------------------------ | ------ | ----- |
| Test Server Actions      | ⬜     |       |
| Test critical user flows | ⬜     |       |
| Test auth flows          | ⬜     |       |

### 7.5 E2E Tests

| TODO                              | Status | Notes |
| --------------------------------- | ------ | ----- |
| Test happy path for core features | ⬜     |       |
| Test auth flow end-to-end         | ⬜     |       |
| Test on multiple browsers         | ⬜     |       |

### 7.6 Quality Checks

| TODO                              | Status | Notes |
| --------------------------------- | ------ | ----- |
| Run accessibility audit (axe)     | ⬜     |       |
| Check all forms have validation   | ⬜     |       |
| Verify all errors are handled     | ⬜     |       |
| Check for console errors/warnings | ⬜     |       |
| Review for security issues        | ⬜     |       |

**Phase 7 Exit Criteria:**

- [ ] All tests pass
- [ ] Coverage meets targets (80%+ for critical paths)
- [ ] No critical accessibility issues
- [ ] User has approved test coverage scope

---

## PHASE 8: Performance & Optimization

**Goal:** Ensure the application is fast and efficient.

### 8.1 Performance Audit

| TODO                             | Status | Notes |
| -------------------------------- | ------ | ----- |
| Run Lighthouse audit             | ⬜     |       |
| Identify performance bottlenecks | ⬜     |       |
| Measure Core Web Vitals          | ⬜     |       |

### 8.2 Optimization Tasks

| TODO                            | Status | Notes |
| ------------------------------- | ------ | ----- |
| Optimize images (next/image)    | ⬜     |       |
| Implement code splitting        | ⬜     |       |
| Add Suspense boundaries         | ⬜     |       |
| Optimize database queries       | ⬜     |       |
| Add appropriate caching         | ⬜     |       |
| Minimize client-side JavaScript | ⬜     |       |

### 8.3 Bundle Analysis

| TODO                         | Status | Notes |
| ---------------------------- | ------ | ----- |
| Analyze bundle size          | ⬜     |       |
| Remove unused dependencies   | ⬜     |       |
| Check for duplicate packages | ⬜     |       |
| Implement dynamic imports    | ⬜     |       |

### 8.4 Performance Targets

| Metric     | Target  | Actual | Status |
| ---------- | ------- | ------ | ------ |
| LCP        | < 2.5s  |        | ⬜     |
| FID        | < 100ms |        | ⬜     |
| CLS        | < 0.1   |        | ⬜     |
| Initial JS | < 200kb |        | ⬜     |

**Phase 8 Exit Criteria:**

- [ ] Core Web Vitals pass
- [ ] Bundle size within budget
- [ ] No unnecessary re-renders
- [ ] User has approved performance

---

## PHASE 9: Deployment & Infrastructure

**Goal:** Set up production infrastructure on Cloudflare.

### 9.1 Cloudflare Setup

| TODO                                | Status | Notes |
| ----------------------------------- | ------ | ----- |
| Create Cloudflare account/project   | ⬜     |       |
| Configure `wrangler.toml`           | ⬜     |       |
| Set up production D1 database       | ⬜     |       |
| Set up R2 bucket (if needed)        | ⬜     |       |
| Configure KV namespaces (if needed) | ⬜     |       |

### 9.2 Environment Configuration

| TODO                            | Status | Notes |
| ------------------------------- | ------ | ----- |
| Set up production env variables | ⬜     |       |
| Configure secrets in Cloudflare | ⬜     |       |
| Verify all bindings are correct | ⬜     |       |

### 9.3 Domain & DNS

| TODO                    | Status | Notes |
| ----------------------- | ------ | ----- |
| Configure custom domain | ⬜     |       |
| Set up SSL certificate  | ⬜     |       |
| Configure DNS records   | ⬜     |       |

### 9.4 CI/CD Pipeline

| TODO                               | Status | Notes |
| ---------------------------------- | ------ | ----- |
| Set up GitHub Actions (or similar) | ⬜     |       |
| Configure build pipeline           | ⬜     |       |
| Add test step to pipeline          | ⬜     |       |
| Configure preview deployments      | ⬜     |       |
| Set up production deployment       | ⬜     |       |

### 9.5 Database Migration (Production)

| TODO                            | Status | Notes |
| ------------------------------- | ------ | ----- |
| Run migrations on production D1 | ⬜     |       |
| Verify schema is correct        | ⬜     |       |
| Seed initial data (if needed)   | ⬜     |       |

**Phase 9 Exit Criteria:**

- [ ] Preview deployment works
- [ ] Production deployment works
- [ ] All environment variables set
- [ ] Database migrations successful

---

## PHASE 10: Launch & Monitoring

**Goal:** Go live and ensure ongoing reliability.

### 10.1 Pre-Launch Checklist

| TODO                            | Status | Notes |
| ------------------------------- | ------ | ----- |
| Final QA on production          | ⬜     |       |
| Test all critical paths         | ⬜     |       |
| Verify auth works in production | ⬜     |       |
| Check all external integrations | ⬜     |       |
| Review security settings        | ⬜     |       |
| Backup database                 | ⬜     |       |

### 10.2 Monitoring Setup

| TODO                                 | Status | Notes |
| ------------------------------------ | ------ | ----- |
| Set up error tracking (Sentry, etc.) | ⬜     |       |
| Configure uptime monitoring          | ⬜     |       |
| Set up analytics (if needed)         | ⬜     |       |
| Configure alerting                   | ⬜     |       |

### 10.3 Documentation

| TODO                             | Status | Notes |
| -------------------------------- | ------ | ----- |
| Update README with prod info     | ⬜     |       |
| Document deployment process      | ⬜     |       |
| Create runbook for common issues | ⬜     |       |
| Document environment variables   | ⬜     |       |

### 10.4 Launch

| TODO                        | Status | Notes |
| --------------------------- | ------ | ----- |
| Announce launch internally  | ⬜     |       |
| Monitor error rates         | ⬜     |       |
| Monitor performance metrics | ⬜     |       |
| Be ready for hotfixes       | ⬜     |       |

**Phase 10 Exit Criteria:**

- [ ] Application is live and stable
- [ ] Monitoring is active
- [ ] Team knows how to deploy updates
- [ ] Documentation is complete

---

## Quick Reference: Phase Dependencies

```
Phase 0 (Requirements)
    │
    ▼
Phase 1 (Foundation)
    │
    ▼
Phase 2 (Data Layer)  ◄──── Creates Zod schemas + flat mock files
    │
    ├─────────────────────────────────────────────────┐
    │                                                 │
    ▼                                                 ▼
Phase 3 (Core UI)          Backend Team Prep
Mock-driven                (Phase 6 setup)
    │
    ▼
┌─────────────────────────────────┐
│ Phase 4 & 5 (Parallel)          │
│ ┌─────────────────────────────┐ │
│ │ Phase 4: Features (mocks)   │ │
│ │ Phase 5: Auth (can overlap) │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
    │
    ▼
Phase 6 (Integration)  ◄──── REPLACE ALL MOCKS with real data
Server Actions ready
    │
    ├──────────────────────────┐
    ▼                          ▼
Phase 7 (Testing)    Phase 8 (Performance)
    │                          │
    └──────────────┬───────────┘
                   ▼
            Phase 9 (Deployment)
                   │
                   ▼
            Phase 10 (Launch)

┌────────────────────────────────────────────────────────────────┐
│ STRATEGY:                                                      │
│ Phases 3-4 = MOCK-DRIVEN (Frontend only, zero backend calls)   │
│ Phases 4-5 = PARALLEL (Features + Auth can develop together)   │
│ Phase 6 = INTEGRATION (Swap mocks for real Server Actions)     │
│ Phases 7+ = VERIFICATION (All mocks removed, real data only)   │
└────────────────────────────────────────────────────────────────┘
```

---

## Status Legend

| Symbol | Meaning               |
| ------ | --------------------- |
| ⬜     | Not started           |
| 🟡     | In progress           |
| ✅     | Complete              |
| ❌     | Blocked               |
| ⏭️     | Skipped (with reason) |
