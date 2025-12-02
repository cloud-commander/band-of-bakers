# Copilot / AI Agent Instructions — Band of Bakers

Purpose: give AI coding agents immediate, actionable context for working in this repo.

**Big Picture:**

- **Framework:** Next.js (App Router) + TypeScript (strict). See `src/app/` for routes and layouts.
- **Data & ORM:** Drizzle + Cloudflare D1. Config: `drizzle.config.ts`; migrations in `migrations/`.
- **UI & Styling:** Tailwind + Shadcn UI. Reusable primitives live in `src/components/ui/`.
- **Validation:** Zod schemas in `src/lib/validators/` shared between client/server.

**Quick Dev Commands**

- **Install:** `pnpm install`
- **Dev:** `pnpm dev`
- **Build:** `pnpm build` then `pnpm start`
- **Tests:** `pnpm test` (Vitest). Use `-- --watch` or `-- --coverage` as needed.
- **Lint/Types:** `pnpm lint` and `pnpm type-check`
- **DB (local D1):** use Wrangler: `pnpm wrangler d1 migrations apply band-of-bakers-db --local` and seed via `npx tsx scripts/seed.ts`.

**Project Conventions (explicit & discoverable)**

- **Components:** PascalCase for React components; prefer Server Components. Add `"use client"` only when necessary.
- **Exports:** Named exports only (no default exports) to preserve tree-shaking consistency.
- **Styling:** Use `cn()` from `src/lib/utils.ts` to compose Tailwind classes; prefer Shadcn primitives over ad-hoc markup.
- **Files & tests:** Tests live next to code (`__tests__/`) or under `src/tests/`; filename pattern: `*.test.ts[x]`.
- **Types:** Avoid `any`; use Zod + TypeScript inference. Keep complex files < ~200 lines where feasible.

**Integration & Workflows to Respect**

- **Migrations:** All schema changes must include a migration in `migrations/` and be applied via Wrangler for D1. See `README.md` DB section.
- **Seeds & scripts:** Reusable scripts live in `scripts/` (e.g., `scripts/seed.ts`, `optimize-images.js`). Run them with `npx tsx` when necessary.
- **Assets:** `public/` contains static assets; image scripts update references — run `pnpm images:update-refs` after big image edits.

**Decision / Escalation Rules (must-follow)**

- **Escalate (ask human):** Adding new npm packages, altering folder structure, auth/security strategy, major state-management choices, or production DB changes.
- **Safe to act (with tests/PR):** Small refactors, bug fixes, type improvements, and documentation updates.
- See `docs/agent-instructions.md` and `docs/AGENTS.md` for the full decision matrix and Phase flow.

**Testing & Quality Gate**

- **Minimum checks pre-merge:** `pnpm lint`, `pnpm type-check`, `pnpm test -- --coverage` for changed areas.
- **Accessibility & UX:** Implement accessible states for loading/error/empty; prefer skeletons over spinners for critical paths.

**Where to look for examples**

- Validation pattern: `src/lib/validators/*` (Zod + type exports).
- UI primitives & patterns: `src/components/ui/*` and `src/components/*` for feature components.
- DB wiring: `src/db/`, `drizzle.config.ts`, and `migrations/`.
- Scripts and seeds: `scripts/` (e.g., `scripts/seed.ts`).
- Existing agent policies: `docs/agent-instructions.md` and `docs/AGENTS.md`.

If anything here is ambiguous or you want me to expand a section (examples, commands, or escalation rules), tell me which part to elaborate.
