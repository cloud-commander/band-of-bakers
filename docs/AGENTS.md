# Repository Guidelines

## Project Structure & Module Organization
- `src/app/`: Next.js App Router routes; `(admin)` powers the dashboard, `(shop)` the storefront, API stubs sit in `api/`.
- `src/components/`: shared UI, Shadcn primitives in `ui/`, admin widgets; reuse `cn()` from `src/lib/utils.ts` for Tailwind composition.
- `src/lib/`: business logic, Zod validators, constants, helpers; `src/db/` pairs with `drizzle.config.ts` and `migrations/` for schema work.
- `src/context/`, `src/hooks/`, and `src/constants/` hold cross-cutting state/config. Static assets live in `public/`; utility scripts in `scripts/`. Check `docs/` and `ARCHITECTURE.md` before adding new modules.

## Build, Test, and Development Commands
- `pnpm dev` serve locally; `pnpm build` produce prod output; `pnpm start` run the built app.
- `pnpm lint` run ESLint (Next + TypeScript).
- `pnpm test` execute Vitest; add `-- --watch` or `-- --coverage`.
- Database: `pnpm db:generate`, `pnpm db:migrate:local`, `pnpm db:migrate:prod`; `pnpm seed` loads sample data.
- Assets: `pnpm images:optimize`, `pnpm images:update-refs`, `pnpm images:cleanup`; `pnpm clean-cache` clears Next/Vite caches.

## Coding Style & Naming Conventions
- TypeScript-first; prefer server components, add `"use client"` only when interactivity requires it.
- Naming: PascalCase components, camelCase functions/vars/hooks (`useX`), kebab-case routes/folders, `TypeName`/`Props` for interfaces/types.
- Styling: Tailwind as default; compose classes with `cn()` and Shadcn primitives instead of ad-hoc DOM. Keep related code/tests close to their feature.
- Validation: extend Zod schemas in `src/lib/validators/`; keep shared values in `src/constants/`.

## Testing Guidelines
- Stack: Vitest + Testing Library (`src/tests/setup.ts`, helpers in `src/tests/helpers.ts`).
- Place specs in `__tests__/` beside code or under `src/tests/`; name `*.test.ts[x]`.
- Cover validators, security-sensitive flows, and key UI states; add regression tests with fixes. Run `pnpm test -- --coverage` before larger merges.

## Commit & Pull Request Guidelines
- Small, imperative commits; prefixes like `feat:`, `fix:`, `chore:` fit history. Explain intent and impact.
- PRs: summary + linked issue, commands run (`pnpm lint`, `pnpm test`, migrations), screenshots for UI, and notes for env/schema changes. Update docs when behavior or scripts shift.

## Security & Configuration
- Copy `.env.example` to `.env.local`; never commit Cloudflare/Resend/DB secrets.
- Validate and sanitize user input via existing Zod/utility helpers; gate admin routes behind auth when wiring new pages.
