# Deployment Runbook

## One-Time Setup

Before deploying for the first time, you must bootstrap the environment.

1.  **Login to Cloudflare**:

    ```bash
    pnpm exec wrangler login
    ```

2.  **Bootstrap Staging**:

    ```bash
    pnpm setup:staging
    ```

3.  **Bootstrap Production**:
    ```bash
    pnpm setup:prod
    ```

## Build Configuration

This project uses **OpenNext for Cloudflare** to adapt Next.js for Cloudflare Workers.

### OpenNext/Workers specifics

- The Worker entry point **must** be `.open-next/worker.js`. If that file is missing, rerun `npx opennextjs-cloudflare build` (clean `.open-next` if needed).
- Deploying via `npx opennextjs-cloudflare deploy --env preview` runs the build first; `npx wrangler deploy --env preview` assumes `.open-next` already exists.
- Pages/routes cannot use `runtime = "edge"` in the main bundle. Set `runtime = "nodejs"` for app routes/API handlers you want in the Worker bundle.
- The app uses a KV binding named `NEXT_DATA_KV` (falls back to `KV`) for homepage Instagram settings and other cached data—ensure that binding exists in each Wrangler environment.

### Build Command

```bash
npx opennextjs-cloudflare build
```

**Output**: `.open-next/worker.js` (entry point) and `.open-next/assets` (static assets)

### Required Configuration

**`open-next.config.ts`**:

```typescript
const config = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
  edgeExternals: ["node:crypto"], // REQUIRED
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
};
```

**`wrangler.jsonc`**:

```jsonc
{
  "main": ".open-next/worker.js",
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS",
  },
  "compatibility_flags": ["nodejs_compat"],
  "env": {
    "preview": {
      "name": "bandofbakers-v2-staging",
      // ... bindings
    },
  },
}
```

**`next.config.ts`**:

```typescript
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Only initialize for dev
if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

const nextConfig = {
  output: "standalone", // REQUIRED for OpenNext
  // ... rest of config
};
```

### Environment Mapping

The deployment script maps user-facing environment names to Wrangler environment names:

- `--env=staging` → `--env preview` (for Wrangler commands)
- `--env=production` → `--env production`

This is because **Cloudflare Pages only supports named environments called "preview" and "production"**, but we use "staging" for user-facing commands.

## Custom Domain Setup

**Required**: Custom domains must be manually configured in Cloudflare Dashboard.

See [`docs/CUSTOM_DOMAINS.md`](./CUSTOM_DOMAINS.md) for complete instructions.

**Quick setup**:

1. Go to Cloudflare Dashboard → Workers & Pages → bandofbakers-v2 → Triggers → Custom Domains
2. Add `staging.bandofbakers.co.uk` (for staging/preview environment)
3. Add `bandofbakers.co.uk` (for production environment)

## Quick Start

### Staging Deployment

```bash
# 1. Build and Deploy
pnpm deploy:staging --build-local --confirm

# Or with a fresh build
pnpm deploy:staging --confirm
```

### Production Deployment

```bash
# 1. Build and Deploy
pnpm deploy:prod --build-local --confirm
```

### Rollback

```bash
# Rollback Staging
pnpm deploy:rollback --env=staging --timestamp=20251202-120000

# Rollback Production
pnpm deploy:rollback --env=production --timestamp=20251202-120000
```

## Pre-Flight Checklist

- [ ] Node.js v20+ installed
- [ ] pnpm v9+ installed
- [ ] Wrangler v3.8+ installed
- [ ] Cloudflare account access verified (`wrangler whoami`)
- [ ] `.env.staging` or `.env.production` exists (for local deployments)
- [ ] No uncommitted changes (for production)

## Deployment Flow

1. **Config Validation**: Checks `wrangler.jsonc` and environment setup.
2. **Pre-Deployment Checks**: Verifies branch rules and git status.
3. **Secret Sync**: Syncs whitelisted secrets to Cloudflare (skipped in CI if configured).
4. **Safety Backup**: Backs up D1 database to R2.
5. **Migration**: Applies pending D1 migrations.
6. **Deploy**: Builds and deploys the Next.js app to Cloudflare Workers.
7. **Health Check**: Verifies the deployment is live and responding.

## Failure Scenarios

### Missing Worker entry

Symptom: Wrangler reports “Missing entry-point”.  
Fix: Remove `.open-next`, rerun `npx opennextjs-cloudflare build`, and confirm `.open-next/worker.js` exists.

### Edge runtime in app routes

Symptom: `app/... cannot use the edge runtime. OpenNext requires edge runtime function to be defined in a separate function.`  
Fix: Switch `export const runtime = "edge";` to `"nodejs"` for app routes/API handlers bundled into the Worker.

### KV binding missing for Instagram settings

Symptom: Build logs “Failed to fetch instagram settings from KV (env binding undefined)”.  
Fix: Ensure the environment binds `NEXT_DATA_KV` (or `KV`) in `wrangler.jsonc`; the code reads Instagram embed HTML and feature flag from that KV.

### Migration Failed

If a migration fails, the script will stop before deployment.

1. Check the logs for the specific SQL error.
2. Fix the migration file or the database state.
3. Resume deployment or manually apply the fix.

### Database Seeding

The seed script supports several flags to control what data is populated:

- **`--env=staging|production`**: Targets the specified environment (defaults to development).
- **`--prod-init`**: **Recommended for initial setup.** Seeds only real products, images, and the admin user. Skips all mock data (news, reviews, testimonials, orders).
- **`--real-products`**: Seeds real products and images, but includes mock news and users. Uses real reviews/testimonials if available.
- **`--clear`**: **Destructive.** Clears the R2 bucket before seeding. (Note: The database is always cleared before seeding).
- **`--admin-only`**: Seeds only the admin user.

**Examples:**

```bash
# Initial Staging Setup (Clean Slate)
pnpm seed --env=staging --prod-init --clear

# Reset Staging Database (Keep Images)
pnpm seed --env=staging --prod-init

# Seed with Mock Data for Testing
pnpm seed --env=staging --real-products
```

### Health Check Failed

If the health check fails after deployment:

1. The script will prompt for rollback (interactive mode).
2. Check Cloudflare Workers logs for runtime errors.
3. Verify environment variables and secrets.

### Backup Corrupted

If backup verification fails (optional step):

1. The deployment will abort.
2. Check R2 for the backup file.
3. Retry the deployment.

## Rollback Procedures

To roll back to a previous state:

1. Identify the timestamp of the last successful backup from R2 or logs.
2. Run the rollback command:
   ```bash
   pnpm deploy:rollback --env=staging --timestamp=<TIMESTAMP>
   ```
   _Note: This feature requires manual implementation of the rollback logic in `scripts/deploy.ts` if not fully automated._

## Resource Limits & Cost

- **Backups**: Stored in R2. Retention policy should be set to 30 days to manage costs.
- **D1 Database**: Monitor storage usage.
- **KV Namespaces**: Monitor read/write limits.

## On-Call Escalation

- **DevOps Team**: [Contact Info]
- **Cloudflare Status**: [status.cloudflare.com](https://status.cloudflare.com)

## Logging & Debugging

- **Deployment Logs**: GitHub Actions logs.
- **Runtime Logs**: Cloudflare Workers logs / Logflare.
- **State File**: `deploy-state.json` (local) or artifact (CI).

## Troubleshooting

### Authentication Error (Code 10000)

If you see `Authentication error [code: 10000]`, it means Wrangler is not authenticated.
**Fix**: Run `pnpm exec wrangler login`.

### Unknown Argument: json

If you see `Unknown argument: json` or `Unknown arguments: json, kv:namespace, list`, ensure you are using the latest `scripts/setup.ts`.
**Fix**: The script has been updated to use `pnpm exec` and avoid unsupported flags. Pull the latest changes.

### JSON Parse Error in Setup

If you see `SyntaxError: Bad control character in string literal`, it might be due to URL parsing in `wrangler.jsonc`.
**Fix**: The `scripts/setup.ts` regex has been updated to handle URLs correctly. Ensure you are using the latest version.

### OpenNext Build Errors

#### `copyTracedFiles` Error

If `opennextjs-cloudflare build` fails with a `copyTracedFiles` error, this is often caused by:

1.  **Missing `open-next.config.ts`** - Ensure the config file exists with proper Cloudflare configuration
2.  **Missing `edgeExternals`** - The config MUST include `edgeExternals: ["node:crypto"]`
3.  **Incomplete config** - All required fields must be present (see Build Configuration section)

**Workaround**: If builds are inconsistent, use the `--build-local` flag to reuse a successful build:

```bash
# Build once successfully
npx opennextjs-cloudflare build

# Deploy without rebuilding
pnpm deploy:staging --confirm --skip-backup --build-local
```

#### "Missing entry-point" Error

If deployment fails with "Missing entry-point":

- Ensure `wrangler.jsonc` has `"main": ".open-next/worker.js"`
- Ensure the build completed successfully and created `.open-next/worker.js`
- Try cleaning the build directory: `rm -rf .open-next` and rebuilding

#### "Module format" Error

If deployment fails with "Unexpected external import...":

- You might be pointing `main` to `.open-next/cloudflare/init.js` instead of `.open-next/worker.js`
- Ensure `wrangler.jsonc` points to the correct worker file

### Health Check Always Fails

If health checks always fail:

1.  **Custom domain not configured** - The health check tries `staging.bandofbakers.co.uk` which requires manual DNS setup
2.  **No health endpoint** - Ensure `/api/health/route.ts` exists
3.  **Temporary workaround** - Use `--no-health-check` flag
