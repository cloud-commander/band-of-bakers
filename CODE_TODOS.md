# Code TODOs - Band of Bakers v2

Status refreshed: 2025-11-28  
Scan command: `rg "TODO" src` (vendor/editor assets excluded).  
Older backlog entries were removed because they no longer match live TODO comments; see git history for the previous version.

## Completed in this pass
- Delivery fee now reuses the shared `SHIPPING_COST` constant when creating orders (`src/actions/orders.ts`).
- Voucher discounts render in customer order summaries when present (`src/app/(shop)/orders/[id]/page.tsx`).
- Admin order quick actions now call a guarded server action to transition statuses and revalidate (`src/app/(admin)/admin/orders/orders-table.tsx`, `src/actions/orders.ts`).
- Menu stock indicators are driven by real `stock_quantity` data and block add-to-cart when unavailable (`src/app/(shop)/menu/menu-content.tsx`).
- Voucher integrity enforced during checkout (per-customer limits, validity, usage reservation/rollback) and stock rollback retained (`src/actions/orders.ts`, `src/lib/repositories/voucher.repository.ts`).
- Order status updates send notifications for Ready/Fulfilled states (`src/actions/orders.ts`).
- Bake sale transfer now validates stock before moving orders (`src/actions/bake-sale-management.ts`).

## Open TODOs
- Server-side pagination for listings
  - **Progress**: Orders listing now fetches paged data from the server with total counts (`src/actions/orders.ts`, `src/app/(admin)/admin/orders/page.tsx`, `orders-table.tsx`). Current filters/sorting run client-side on the current page only.
  - **Remaining scope**: Migrate other listings (products, users, etc.) to limit/offset queries and adjust UIs to request paged data with totals; consider server-side filtering/sorting for consistency.
  - **Priority**: Medium

Last scan: 2025-11-28 via `rg "TODO" src`
