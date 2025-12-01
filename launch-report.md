# Launch Report (Cloudflare Pages Edge + D1)

## What Was Implemented
- **CSRF coverage expanded**: Added `requireCsrf` to state-changing actions (orders, products, vouchers, testimonials, reviews, bake sales, locations, categories, news, email templates, profile, admin order status). Role checks retained on admin paths.
- **N+1 and DB performance**: Batched product variant fetching across all product actions; overdue orders indexed (`migrations/0014_add_index_bake_sales_date.sql` adds `idx_bake_sales_date`).
- **Edge safety**: Local SQLite fallback isolated to dev-only module (`src/lib/db-local.ts`); Serwist removed to keep Node-only modules out of Edge builds. Pages marked `runtime = "edge"` where applicable.
- **SWR caching**: `/api/list-images` now returns `Cache-Control: public, max-age=60, stale-while-revalidate=600`. FAQ page also sets SWR headers.
- **Logging & observability**: Added PII-scrubbing logger (`src/lib/logger/safe-log.ts`) and Rollbar client init (`src/lib/rollbar-client.ts`) to capture hydration/runtime errors (requires `NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN`).
- **Analytics**: Google Analytics snippet added; driven by `NEXT_PUBLIC_GA_ID` (`src/components/analytics/google-analytics.tsx`).

## WAF / Rate Limiting (configure in Cloudflare Dashboard)
Protect these routes with sensible per-IP limits (GET/POST as appropriate):
- Public heavy reads: `/api/list-images`, `/faq`, `/menu`, `/` (home) if bot traffic is a risk.
- Admin APIs: `/api/upload-image`, `/api/delete-image`, `/api/update-image` (only allow authenticated admin IP ranges if possible).
- Checkout/orders: `/checkout`, `/api/*` order actions (guard against brute-force abuse; Turnstile already in place when keys set).

## Env Vars Required
- `BANDOFBAKERS_TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_BANDOFBAKERS_TURNSTILE_SITEKEY`
- `NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN` (for client error capture; Rollbar server token if used elsewhere)
- `NEXT_PUBLIC_GA_ID` (Google Analytics)
- App URLs: `NEXT_PUBLIC_APP_URL` (used in emails/links)
- Cloudflare bindings: `DB`, `R2`, `KV` (as provisioned)

## Deployment & Migration Order (Expand/Contract)
1) Apply migrations before deploy: `wrangler d1 migrations apply DB --remote` (includes `0014_add_index_bake_sales_date.sql`).
2) Deploy new Worker/Pages bundle.
3) For future schema changes: add nullable column/index (deploy #1), backfill, then enforce NOT NULL/drop old column in a later deploy (#2). Avoid ALTER-in-place in one step.
4) Handle version skew: keep new fields optional for at least one release; API should tolerate old payloads.

## Testing Checklist (Staging → Prod)
- E2E (Playwright) against staging Pages + staging D1 (not localhost).
- Checkout flow with Turnstile enabled; verify orders succeed and emails/refs correct.
- Admin actions (products/vouchers/FAQs/news/locations) succeed with CSRF headers; unauthorized users blocked.
- Rollbar client/server receiving test errors; Web Analytics present.
- Cache headers: `/api/list-images` responses show SWR cache-control; FAQ page returns SWR headers.
- D1 index present (`PRAGMA index_list('bake_sales')` shows `idx_bake_sales_date`).

## Backups & DR
- Take a fresh D1 export before launch: `wrangler d1 export DB > backup.sql` (store in R2/secure storage).
- If R2 assets are critical, enable versioning or periodic backup.

## Monitoring & Alerts
- Configure alerts for Worker CPU/timeouts and D1 read/write usage.
- Watch 4xx/5xx rates; scan logs for CSRF/Unauthorized spikes.
- Budget alert for D1 and Pages usage to avoid bill shock.

