# Seed Data

This directory contains mock data used for database seeding and development testing.

## Files

- **users.ts** - Mock user accounts with various roles (owner, manager, staff, customer)
- **locations.ts** - Mock bakery locations (UK locations)
- **bake-sales.ts** - Mock bake sale events (past and upcoming)
- **products.ts** - Mock product catalog (breads, pastries, cakes, etc.)
- **orders.ts** - Mock customer orders with various statuses
- **vouchers.ts** - Mock discount vouchers
- **news.ts** - Mock blog posts/news articles
- **testimonials.ts** - Mock customer testimonials

## Usage

### Database Seeding

These files are primarily used by the seed script to populate the database with test data:

```bash
# Seed with mock products
pnpm seed

# Seed with real products from seed-products/products.txt
pnpm seed --real-products
```

### Edge Case Testing

Each file includes variations for testing edge cases:
- `*Empty` - Empty arrays for testing empty states
- `*Single` - Single items for minimal data scenarios
- `*Many` - Large datasets for pagination testing
- `*Inactive` - Inactive/disabled items
- `*LongText` - Long names/descriptions for UI overflow testing

## Related Files

- **../real-products-data.ts** - Real product catalog from seed-products/products.txt
- **../real-products-mock-data.ts** - Orders, reviews, and testimonials for real products
- **../../scripts/seed.ts** - Database seeding script

## Notes

- These files are for **development and testing only**
- Production code should **never** import from this directory
- Data follows the schema defined in `src/db/schema.ts`
