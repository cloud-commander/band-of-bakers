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
  - **Progress**: Orders listing uses server pagination. Products listing now server-paginated with URL-driven paging; users listing now server-paginated with URL-driven paging. Repositories and actions support limit/offset.
  - **Remaining scope**: Extend the same pattern to any other admin lists if needed and consider moving filters/sorting server-side for large datasets.
  - **Priority**: Medium

Last scan: 2025-11-28 via `rg "TODO" src`
