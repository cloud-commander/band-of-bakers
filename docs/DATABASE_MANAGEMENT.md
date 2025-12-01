# Database Management Guide

This guide covers common database management tasks for the Band of Bakers application.

## Table of Contents

- [Migration Scripts](#migration-scripts)
- [Seeding](#seeding)
- [Admin Access](#admin-access)
- [Common Workflows](#common-workflows)

---

## Migration Scripts

### Migrate to Real Products (Safe)

**Use this when you want to update products to use real WebP images while preserving all customer data.**

```bash
# Local database
node --loader tsx scripts/migrate-to-real-products.ts

# Production database
node --loader tsx scripts/migrate-to-real-products.ts --remote
```

**What it does:**
- ✅ Updates products to use real WebP images from `scripts/seed-data/`
- ✅ Uploads images to R2 storage
- ✅ **Preserves**: Users, Orders, Reviews, Testimonials, Bake Sales, Locations, Vouchers
- ❌ **Replaces**: Products, Categories, Product Variants, Images

**What it preserves:**
- All user accounts and authentication data
- All orders and order history
- All reviews and ratings
- All testimonials
- All bake sale schedules
- All locations
- All vouchers and usage data

---

## Seeding

### Full Database Seed

**⚠️ WARNING: This deletes ALL data including users and orders!**

```bash
# Full seed with mock products (local)
node --loader tsx scripts/seed.ts

# Full seed with real products (local)
node --loader tsx scripts/seed.ts --real-products

# Full seed with real products (production)
node --loader tsx scripts/seed.ts --real-products --r2-remote

# Clear R2 bucket before seeding
node --loader tsx scripts/seed.ts --real-products --clear
```

### Seed Flags

| Flag | Description |
|------|-------------|
| `--real-products` | Use real products from `scripts/seed-data/` instead of mock data |
| `--admin-only` | Only seed admin user (preserves other data) |
| `--images-only` | Full reset mode focusing on images (deletes all data) |
| `--skip-r2` | Skip R2 image uploads |
| `--r2-remote` | Upload to remote R2 instead of local |
| `--clear` | Clear R2 bucket before uploading |
| `--overwrite` | Overwrite existing images in R2 |

### Images Only Mode

```bash
node --loader tsx scripts/seed.ts --images-only --real-products --clear
```

This mode:
- Deletes ALL database data
- Focuses on image upload and setup
- Useful for testing image pipelines

---

## Admin Access

### Problem: Can't Access Admin Panel

When using Google OAuth, you can't use the seeded admin account because it won't pass email verification. Instead, you need to promote your existing Google account to admin.

### Solution: Promote Existing User to Admin

1. **Login with your Google account first** (this creates your user in the database)

2. **Run the promotion script:**

```bash
# Local database
node --loader tsx scripts/promote-to-admin.ts your.email@gmail.com

# Production database
node --loader tsx scripts/promote-to-admin.ts your.email@gmail.com --remote

# Promote to admin instead of owner
node --loader tsx scripts/promote-to-admin.ts your.email@gmail.com --role admin
```

3. **Refresh your browser** - you should now have admin access!

### Roles

| Role | Permissions |
|------|-------------|
| `owner` | Full system access, can manage everything |
| `admin` | Can manage products, orders, and content |
| `customer` | Regular user (default) |

---

## Common Workflows

### 1. Initial Setup (Development)

```bash
# 1. Run migrations to create tables
npx wrangler d1 migrations apply bandofbakers-db --local

# 2. Seed with real products
node --loader tsx scripts/seed.ts --real-products

# 3. Login with your Google account at localhost:3000

# 4. Promote yourself to admin
node --loader tsx scripts/promote-to-admin.ts your.email@gmail.com
```

### 2. Update Products to Real Images (Preserve Data)

```bash
# Migrate existing database to use real products
node --loader tsx scripts/migrate-to-real-products.ts
```

### 3. Fresh Start (Delete Everything)

```bash
# ⚠️ WARNING: This deletes ALL data!
node --loader tsx scripts/seed.ts --real-products --clear
```

### 4. Production Deployment

```bash
# 1. Run migrations on production
npx wrangler d1 migrations apply bandofbakers-db --remote

# 2. Seed production with real products
node --loader tsx scripts/seed.ts --real-products --r2-remote

# 3. Login with your Google account in production

# 4. Promote yourself to admin on production
node --loader tsx scripts/promote-to-admin.ts your.email@gmail.com --remote
```

### 5. Update Product Images Only

```bash
# Local - upload new images without changing data
node --loader tsx scripts/migrate-to-real-products.ts

# Production - upload new images
node --loader tsx scripts/migrate-to-real-products.ts --remote
```

---

## File Formats

### Product Images

- **Real products**: `.webp` files in `scripts/seed-data/`
  - `{product-slug}-card.webp` (used on product cards)
  - `{product-slug}-detail.webp` (used on product detail pages)
  - `{product-slug}-thumbnail.webp` (used for thumbnails)

- **Mock products**: `.jpg` files (downloaded from Unsplash or placeholders)

**Rule of thumb**: If it's a `.webp` file, it's a real product image. If it's a `.jpg`, it's mock data.

---

## Troubleshooting

### "User not found" when promoting to admin

**Problem**: You haven't logged in yet, so the user doesn't exist in the database.

**Solution**: Login with your Google account first, then run the promotion script.

### Images not showing after migration

**Problem**: R2 images may not have been uploaded correctly.

**Solution**: Re-run the migration script, which will re-upload any missing images:
```bash
node --loader tsx scripts/migrate-to-real-products.ts
```

### Want to reset everything

**Problem**: Database is in a messy state and you want to start fresh.

**Solution**: Run full seed with clear flag:
```bash
node --loader tsx scripts/seed.ts --real-products --clear
```

Then promote yourself to admin again:
```bash
node --loader tsx scripts/promote-to-admin.ts your.email@gmail.com
```

---

## Best Practices

1. **Always use `--real-products` flag** unless testing with mock data
2. **Use migration script** instead of full seed when you have customer data
3. **Test migrations locally** before running on production (`--remote`)
4. **Backup production database** before major changes
5. **Keep `scripts/seed-data/` images up to date** with your actual product photos

---

## Quick Reference

```bash
# Safe product update (preserves users/orders)
node --loader tsx scripts/migrate-to-real-products.ts

# Full reset (⚠️ deletes everything)
node --loader tsx scripts/seed.ts --real-products --clear

# Get admin access
node --loader tsx scripts/promote-to-admin.ts your.email@gmail.com

# Production commands (add --remote or --r2-remote)
node --loader tsx scripts/migrate-to-real-products.ts --remote
node --loader tsx scripts/seed.ts --real-products --r2-remote
node --loader tsx scripts/promote-to-admin.ts your.email@gmail.com --remote
```
