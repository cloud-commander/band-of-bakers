# Development Setup Guide

This guide details the steps required to configure the development environment for **Band of Bakers v2**.

## 1. Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: Version 18 or higher (LTS recommended).
- **pnpm**: The recommended package manager.
  ```bash
  npm install -g pnpm
  ```
- **Wrangler CLI**: For Cloudflare infrastructure emulation.
  ```bash
  npm install -g wrangler
  ```
- **Cloudflare Account**: Required for deploying and managing remote resources (D1, R2, KV).

## 2. Installation

1.  **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd bandofbakers-v2
    ```

2.  **Install dependencies**:
    ```bash
    pnpm install
    ```

## 3. Environment Configuration

1.  **Create local environment file**:
    Copy the example environment file to `.env.local`.

    ```bash
    cp .env.example .env.local
    ```

2.  **Configure Environment Variables**:
    Open `.env.local` and populate the necessary variables.

    > [!IMPORTANT]
    > For local development, many Cloudflare resources (D1, KV, R2) are emulated locally by Wrangler, so you might not need real IDs immediately. However, for full functionality (especially Auth and third-party services), you will need:

    - **Authentication**:
      - `AUTH_SECRET`: Generate one using `npx auth secret`.
      - `AUTH_GOOGLE_ID` & `AUTH_GOOGLE_SECRET`: From Google Cloud Console (if using Google Auth).
    - **Database (D1)**:
      - `BANDOFBAKERS_DB_ID`: Can be a placeholder for local dev, but required for remote.
    - **Storage (R2)**:
      - `BANDOFBAKERS_R2_BUCKET_NAME`: Defined in `wrangler.jsonc`.
    - **Third-Party Services** (Optional for basic dev):
      - `BANDOFBAKERS_RESEND_API_KEY`: For emails.
      - `BANDOFBAKERS_STRIPE_*`: For payments.
      - `NEXT_PUBLIC_BANDOFBAKERS_TURNSTILE_SITEKEY`: For bot protection.

## 4. Database Setup (Cloudflare D1)

The project uses Cloudflare D1 (SQLite) with Drizzle ORM.

1.  **Apply Migrations Locally**:
    This creates the local SQLite database file in `.wrangler/state/v3/d1`.

    ```bash
    pnpm wrangler d1 migrations apply bandofbakers-db --local
    ```

    > [!NOTE]
    > If you see errors about missing tables, ensure you have run this step.

2.  **Seed the Database**:
    Populate the database with mock data from `src/lib/mocks`.

    **Full seed** (all users, products, categories, locations, bake sales, news):

    ```bash
    pnpm seed
    ```

    **Admin-only seed** (just the owner user, useful for testing auth):

    ```bash
    pnpm seed --admin-only
    ```

    **Skip R2 uploads** (faster, uses external image URLs):

    ```bash
    pnpm seed --skip-r2
    ```

    > [!TIP]
    > The seed script automatically downloads product/category images and uploads them to local R2 storage. This can take a few minutes on first run. Use `--skip-r2` to skip this step during development.

    > [!IMPORTANT] > **Default Admin Credentials** (when using `--admin-only` or full seed):
    >
    > - **Email**: `admin@bandofbakers.co.uk`
    > - **Password**: `password123`
    >
    > All seeded users use the same default password. Change this in production!

3.  **Manual SQL Commands** (optional):
    To run SQL commands manually:
    ```bash
    pnpm wrangler d1 execute bandofbakers-db --local --command "SELECT * FROM users"
    ```

## 5. Running the Application

1.  **Start the Development Server**:

    ```bash
    pnpm dev
    ```

    The application will be available at `http://localhost:3000`.

2.  **Access Admin Dashboard**:
    Navigate to `/dashboard`. You may need to modify your user role in the database to gain access if auth is enabled.

## 6. Troubleshooting

### Build or Cache Issues

If you encounter strange build errors or stale content, use the clean script:

```bash
pnpm clean-cache
```

Or for a full reset (removes `node_modules`):

```bash
pnpm clean-all
```

### Database Issues

If the local database seems corrupted:

1.  Stop the dev server.
2.  Delete the `.wrangler` directory.
3.  Re-run migrations:
    ```bash
    pnpm wrangler d1 migrations apply band-of-bakers-db --local
    ```

### "Self is not defined" Error

This usually happens in Edge runtime. Ensure you are using compatible libraries or checking for `window`/`self` existence before using them in client components, or ensure server-only code isn't leaking to client.

## 7. Deployment

To deploy to Cloudflare Pages:

```bash
pnpm wrangler pages deploy
```

Ensure you have set the necessary secrets in the Cloudflare Dashboard or via CLI:

```bash
wrangler secret put AUTH_SECRET
# ... repeat for other secrets
```
