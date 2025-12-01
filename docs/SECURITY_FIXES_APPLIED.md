# Security & Observability Fixes - Latest

- CSRF enforced on major state-changing actions: orders, products, vouchers, testimonials, reviews, bake sales, locations, categories, FAQs, news, email templates, admin order status, profile updates, etc.
- PII-safe logging helper added (`src/lib/logger/safe-log.ts`) to redact sensitive fields before logging.
- Client-side Rollbar init added (`src/lib/rollbar-client.ts`) to capture hydration/runtime errors (requires `NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN`).
- Cache-control (SWR) headers added to `/api/list-images` and FAQ page; helper in `src/lib/edge-cache.ts`.
- Serwist removed to avoid Node-only SW on Edge; local DB fallback isolated to dev-only module (`src/lib/db-local.ts`).
- Product variant N+1s eliminated; batched fetchers used across product actions.
- Added D1 index on `bake_sales.date` for overdue queries (`migrations/0014_add_index_bake_sales_date.sql`).

Next suggested actions:
- Apply SWR headers to other read-heavy public endpoints (menu, categories) if desired.
- Ensure Rollbar token is set in prod; use safeLog in remaining endpoints.
- Continue CSRF audit for any remaining mutations (users/notifications if added later).
- Maintain expand/contract pattern for DB migrations and run migrations before deploy.
