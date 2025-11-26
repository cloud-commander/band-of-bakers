# Local Development Environment Setup Guide

This guide covers the complete setup of the local development environment for Band of Bakers v2, including Cloudflare D1 (Database), KV (Cache), and R2 (Storage).

## Prerequisites

- **Node.js** (v20+)
- **pnpm** (Package Manager)
- **Cloudflare Account**

---

## 1. Cloudflare Authentication

The `wrangler whoami` command failed, indicating you are not logged in or your token is invalid.

### Step 1: Login to Cloudflare

Run the following command and follow the browser prompts to authorize Wrangler:

```bash
npx wrangler login
```

### Step 2: Verify Login

Once logged in, verify your account details:

```bash
npx wrangler whoami
```

_Note your Account ID from the output, you may need it later._

---

## 2. D1 Database Setup (User Data & Orders)

We need to create a D1 database to store user accounts, orders, and products.

### Step 1: Create the Database

```bash
npx wrangler d1 create bandofbakers-db
```

_Copy the `database_id` from the output._

### Step 2: Update `wrangler.jsonc`

Open `wrangler.jsonc` and update the `d1_databases` section with your new ID:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "bandofbakers-db",
    "database_id": "YOUR_NEW_DATABASE_ID_HERE" // <--- Paste ID here
  }
],
```

### Step 3: Create Local Database & Apply Schema

This command creates the local SQLite database file and applies your schema:

```bash
npx wrangler d1 migrations apply DB --local
```

_Select "Yes" if asked to create the database._

---

## 3. KV Namespace Setup (Session & Cache)

KV is used for caching and potentially session storage.

### Step 1: Create Namespaces

We need two namespaces: one for production and one for preview/dev.

```bash
npx wrangler kv namespace create "bandofbakers-kv"
npx wrangler kv namespace create "bandofbakers-kv"--preview
```

### Step 2: Update `wrangler.jsonc`

Update the `kv_namespaces` section with the IDs from the output:

```jsonc
"kv_namespaces": [
  {
    "binding": "KV",
    "id": "YOUR_PRODUCTION_KV_ID",
    "preview_id": "YOUR_PREVIEW_KV_ID"
  }
],
```

---

## 4. R2 Storage Setup (Images & Assets)

R2 is used to store product images and user avatars.

### Step 1: Create Bucket

```bash
npx wrangler r2 bucket create bandofbakers-assets
```

### Step 2: Verify `wrangler.jsonc`

Ensure the bucket name matches:

```jsonc
"r2_buckets": [
  {
    "binding": "R2",
    "bucket_name": "bandofbakers-assets"
  }
]
```

---

## 5. Seed the Database (Optional but Recommended)

Populate your local database with initial data (products, categories, etc.).

```bash
pnpm run seed
```

---

## 6. Start Development Server

Now that all resources are configured, start the development server. It will automatically connect to your local D1, KV, and R2 instances.

```bash
pnpm run dev
```

---

## Troubleshooting

### "Invalid request headers" or Login Issues

If `npx wrangler login` fails, try:

1. `npx wrangler logout`
2. `npx wrangler login` again

### "Database not found"

Ensure you ran `npx wrangler d1 migrations apply DB --local`. The `--local` flag is crucial for `pnpm run dev`.

### "Missing Environment Variables"

Check your `.env.local` file. While Cloudflare resources are configured in `wrangler.jsonc`, secrets like `AUTH_SECRET` and GCP keys must be in `.env.local`.
