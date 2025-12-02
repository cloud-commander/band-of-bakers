# Deployment Runbook

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
6. **Deploy**: Builds and deploys the Next.js app to Cloudflare Pages.
7. **Health Check**: Verifies the deployment is live and responding.

## Failure Scenarios

### Migration Failed

If a migration fails, the script will stop before deployment.

1. Check the logs for the specific SQL error.
2. Fix the migration file or the database state.
3. Resume deployment or manually apply the fix.

### Health Check Failed

If the health check fails after deployment:

1. The script will prompt for rollback (interactive mode).
2. Check Cloudflare Pages logs for runtime errors.
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
- **Runtime Logs**: Cloudflare Pages logs / Logflare.
- **State File**: `deploy-state.json` (local) or artifact (CI).
