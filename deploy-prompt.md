**Role:** You are a Senior DevOps Architect and Cloudflare Infrastructure Expert. You specialize in deploying Next.js 15 applications using the `@opennextjs/cloudflare` adapter.

**Objective:** Design a fully automated deployment pipeline for a Next.js 15 project. The pipeline must support: **Local Dev $\to$ Remote Staging $\to$ Remote Production** with zero manual Cloudflare dashboard intervention.

**Constraints & Requirements:**

1.  **IaC & Automation**: All resources (D1, KV, R2) must be provisioned and managed via scripts/CLI. No manual Cloudflare UI operations.
2.  **Environment Isolation**: Staging and Production must use distinct D1 databases and KV namespaces to prevent accidental data leaks.
3.  **Deployment Orchestration**: A custom `scripts/deploy.ts` that handles building, migrating, backing up, and uploading with safety gates.
4.  **Secret Management**: Only non-Git secrets (API tokens, database credentials) sync to Cloudflare; requires explicit `--confirm` flag before upsert.
5.  **Safety & Auditability**: Backups before migrations, rollback support, branch-protection gates, and audit logs for all deployments.
6.  **Workers Paid Plan Required**: Next.js 15 bundles exceed the 3 MiB free-tier limit (~3.5 MiB gzipped typical). The Workers Paid plan ($5/month) provides a 10 MiB limit. The setup script must validate that the Cloudflare account is on a paid plan before proceeding.

**Scope of Work:**

### 1. The Configuration (`wrangler.jsonc` & `next.config.ts`)

- Structure `wrangler.jsonc` for `[env.staging]` and `[env.production]`.
- **Crucial**: Include the specific caching bindings required for Next.js 15 ISR (Incremental Static Regeneration) to work on the edge.
  - Reference: [`@opennextjs/cloudflare` adapter docs](https://github.com/opennextjs/opennextjs-cloudflare) for binding requirements.
  - Expected bindings: `NEXT_DATA_KV` (for cached routes), `ASSETS_KV` (for static assets), and direct D1 binding for database access.
  - Each environment (staging/prod) must have isolated KV namespaces (e.g., `band-of-bakers-data-staging` vs `band-of-bakers-data-prod`).
  - Each binding must reference the correct KV namespace IDs in `wrangler.jsonc` (e.g., `NEXT_DATA_KV` binding points to `band-of-bakers-next-data-staging` in staging and `band-of-bakers-next-data-prod` in production).

### 2. The "Bootstrap" Script (`scripts/setup.ts`)

- Create a script that I run _once_ to initialize a new environment (staging or production).
- It should:
  - Check if D1 databases and KV namespaces exist; create them if missing via Wrangler CLI.
  - Validate that the new IDs are written to `wrangler.jsonc` (or a separate `wrangler.staging.jsonc` / `wrangler.production.jsonc`).
  - Apply all migrations from `migrations/` to the newly created D1 database.
  - Seed initial data (reference data only: products, categories, roles, etc.) via `scripts/seed.ts` with `--env=<staging|production>` flag; seeding is idempotent (safe to re-run).
  - Output a summary of created resources (database IDs, namespace IDs, binding names) for verification.

**Seeding Strategy:**

- **Seed data source:** Reference/static seed data lives in `scripts/seed.ts` and includes products, categories, roles, and other baseline entities (not user-generated content).
- **Environment-specific seeds:** Use a `--env=<staging|production>` flag in `scripts/seed.ts` to handle differences (e.g., staging uses test product names, production uses live product data from a config).
- **Idempotency:** Seed scripts must be idempotent (e.g., `INSERT ... ON CONFLICT DO NOTHING` or check existence before inserting) so they can be safely re-run during bootstrap or troubleshooting without creating duplicates.
- **One-time only:** Seeding runs once during bootstrap (`scripts/setup.ts`); it does NOT run during regular deployments (`scripts/deploy.ts`). Manual re-seeding requires an explicit `pnpm seed --env=<env> --force` command.
- **Rollback behavior:** When `scripts/deploy.ts` rolls back a failed migration, the seed data is preserved (only the schema is rolled back). If you need to reset seed data, use `pnpm seed:reset --env=<env> --confirm`.

### 3. The Deployment Script (`scripts/deploy.ts`)

Create a robust deployment script with the following stages that start with validating the deployed config:

**Stage 0: Configuration Validation**

- **Account Plan Check**: Before any deployment, verify the Cloudflare account is on the Workers Paid plan by running `wrangler whoami` and checking account type; fail with a clear error if on the free plan (Next.js 15 bundles typically exceed the 3 MiB free-tier limit at ~3.5 MiB gzipped). Provide upgrade instructions: "Upgrade at dash.cloudflare.com → Workers & Pages → Plans".
- Verify Wrangler is installed and meets the minimum version (e.g., `>=3.8`) by running `wrangler --version`; fail fast if the version is too old or missing.
- Verify Node version matches `.nvmrc` (if present) or meets `engines` in `package.json`; fail if mismatch.
- Verify `pnpm` version and that lock file is up-to-date (`pnpm install --frozen-lockfile` in dry-run mode to check).
- Verify Drizzle CLI version matches `package.json`; warn if lock file is out of sync.
- Load `wrangler.jsonc` (or the env-specific override) and verify the `[env.staging]`/`[env.production]` blocks exist with the expected `name`, `kv_namespaces`, and `d1_databases` entries.
- Ensure each ISR binding (`NEXT_DATA_KV`, `ASSETS_KV`, `D1_DB`) references the correct namespace/database IDs for the target environment (fail fast if the IDs do not match the ones stored in the bootstrap script output).
- Validate that `vars` such as `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_API_URL`, and any required Cloudflare secrets are present or will be injected during secret sync.
- Confirm that the `route`/`domains` entries (if any) match the expected staging/production hostnames before touching DNS.
- When IDs/namespaces are missing, invoke `wrangler kv namespace list` / `wrangler d1 databases list` (or the Wrangler API) to discover them and persist the discovered values back into the per-environment config (`wrangler.<env>.jsonc` or the main file) so future runs see the same binding IDs.
- When persisting discoveries, write to a temporary copy first (e.g., `wrangler.jsonc.tmp`) and atomically replace the target file only after validation succeeds; this avoids leaving partially updated configs if a later stage fails.
- If any `route`/`domains` entry diverges from the expected hostnames, fail fast with a clear error that lists the mismatch and references the expected values; do not modify DNS automatically,-only allow manual confirmation (or a follow-up script) before proceeding.

**Stage 1: Pre-Deployment Checks**

- **Branch Gate**: Enforce `main` → production, `develop`/`feature/*` → staging. Exit with error code 1 if violated; log the violation.
- **Git Status**: Ensure no uncommitted changes (safety check to prevent deploying stale code).
- **Dry-Run Option**: If `--dry-run` flag is passed, show the migration plan and secrets that will sync, then exit without applying.

**Stage 2: Secret Sync (Conditional)**

- Only sync env vars matching a whitelist pattern (e.g., `CLOUDFLARE_*`, `DATABASE_*`, `RESEND_*`; exclude `NEXT_PUBLIC_*` which are public).
- For production deployments, read secrets from `.env.production`; staging deployments source `.env.staging`. Never promote staging secrets into prod and vice versa.
- Require explicit `--confirm` flag before upserting secrets; otherwise, list secrets to be synced and prompt interactively.
- Log which secrets were created/updated for audit trail.

**Stage 3: Safety Backup**

- Before applying migrations, export the current remote D1 database:
  - Run `wrangler d1 execute band-of-bakers-db --<env> --command "SELECT * FROM sqlite_master;"` to validate current schema.
  - Export full database as SQL: `wrangler d1 execute band-of-bakers-db --<env> --command ".dump" > backups/d1-{env}-{timestamp}.sql`.
  - Upload backup to R2 bucket `backups/d1-{env}-{timestamp}.sql` for archival.
  - Log backup size; warn if >100MB and provide the operator a chance to abort.
- On failure, exit and preserve the backup for manual inspection.
- **Backup Retention:** Auto-prune backups older than 30 days from R2 (or keep only the last 5 per environment, whichever is stricter) to avoid unbounded storage costs; log which backups were deleted.
- **Backup Verification (optional stage, `--verify-backup`):** If flag is provided, restore the backup to a temporary shadow D1 database, validate the schema matches the target migration set (check table counts, column names, indexes), then delete the shadow DB. This ensures backups are not corrupted before the migration proceeds.

**Stage 4: Migration**

- Run `drizzle-kit migrate --dialect sqlite` against the remote D1 database.
- Validate migration success; if failed, abort (do not proceed to Stage 5) and output the rollback command.
- If migration fails mid-way, enter **Pause & Investigate Mode**: do NOT auto-rollback; instead, log the error, save the checkpoint, and print instructions for manual recovery (e.g., "Run `pnpm deploy:rollback --env=staging --timestamp=<ts>` to restore, or fix the issue and `pnpm deploy --env=staging --resume` to retry").

**Stage 5: Deploy**

- If `--build-local` is not provided, build the Next.js app: `pnpm build`. If `--build-local` is provided, verify that the `.next/` folder exists and contains recent artifacts (check `.next/` mtime is within 1 hour of the deploy start); fail if missing or stale.
- **Bundle Size Check**: After build, run `wrangler deploy --dry-run` and parse the output for "Total Upload: X KiB / gzip: Y KiB". Fail if gzipped size exceeds 10 MiB (paid plan limit) or warn if approaching 8 MiB. Log the bundle size in the deployment summary.
- Validate build artifact cache freshness: ensure `node_modules/` and `.next/` cache were generated within the last 24 hours; warn if older and offer to rebuild.
- Deploy worker: `wrangler deploy --env <env>`.
- **Health checks (post-deploy):** After deployment, poll the target worker endpoint (e.g., `GET https://<env>.example.com/api/health`) for up to 60 seconds; check for 200 status and response time <2s. If health checks fail, automatically trigger rollback (`pnpm deploy:rollback --env=<env> --auto`).
- On success, output deployment summary (URL, commit hash, timestamp, build source: "local" or "fresh", health check status).
- Provide a `--build-local` option so operators can reuse a locally built `pnpm build` artifact instead of triggering another build inside the script (useful when deploying from the dev machine after testing changes).

**Stage 6: Rollback (Optional)**

- If any stage fails, provide a rollback script that:
  - Identifies the last successful backup.
  - Restores it to D1 via `wrangler d1 execute` (with manual `--confirm` required).
  - Rolls back the worker to the previous version (if available via Wrangler history); if Wrangler history is unavailable, provide the commit hash and deployment timestamp so an operator can manually re-deploy the prior commit.
  - Prints the backup filename (e.g., `backups/d1-production-20251202T1200.sql`) so `pnpm deploy:rollback --timestamp=20251202T1200` can pick it up automatically.

**State Persistence & Restartability**

- After each stage, write a checkpoint file (default `deploy-state.json`) capturing the last completed stage, environment, applied migrations, synced secrets, and the current commit hash.
- On startup, if `--resume` is provided, the script should read this file to skip completed stages and continue from the next pending step. Without `--resume` it may warn and overwrite the checkpoint before running.
- Support `--state-file=<path>` so operators can choose a custom checkpoint location when running parallel deployments or troubleshooting.
- Include a linked worker deployment timestamp in the checkpoint so rollback scripts can reference the exact deployed version.

**Deployment Script Options**

- `--env=<staging|production>` (required) — selects the Wrangler environment, KV/D1 targets, and `.env.*` file to read.
- `--confirm` — forces secret sync and backup actions without pausing for interactive approval; omit to review the plan first.
- `--dry-run` — only performs pre-checks and prints the plan; no secrets, backups, migrations, or deployments are executed.
- `--skip-secrets` — skips the whitelist-based secret sync when you know env vars already match the target environment.
- `--backup-only` — runs only Stage 3 (Safety Backup) and stops; useful before manual schema edits.
- `--domain=<hostname>` — optional override to verify or provision the target domain/subdomain during the setup phase.
- `--timestamp=<YYYYMMDDTHHMM>` — points `pnpm deploy:rollback` to a specific backup file (matching `backups/d1-<env>-<timestamp>.sql`).
- `--resume` — when provided, restores the previous checkpoint to resume from the next stage instead of starting over.
- `--state-file=<path>` — override the default `deploy-state.json` checkpoint location (useful for parallel deployments or reruns).
- `--build-local` — skip the built-in `pnpm build` step and use artifacts from a prior local build; combined with `--dry-run` this allows manual preflight checks.
- `--min-wrangler-version=<version>` — override the default minimum Wrangler version check (default: `3.8`); useful for testing newer features.
- `--verify-backup` — after backing up D1, restore to a shadow database and validate schema before proceeding with migration (adds ~30s but ensures backup integrity).
- `--health-check-timeout=<seconds>` — override the default 60-second post-deploy health check timeout.
- `--no-health-check` — skip post-deploy health checks (not recommended for production).

- `scripts/seed.ts --env=<staging|production>` — idempotent seed script that inserts reference data (products, categories, roles, etc.) into the target environment; safe to re-run.
- `scripts/seed.ts --env=<env> --force` — re-runs all seed inserts, clearing and re-populating reference data (use with caution; may be destructive on production).
- `scripts/seed:reset.ts --env=<env> --confirm` — dangerous operation: truncates all seed tables and re-populates them; requires explicit confirmation and is intended for development/testing only.

**Automated Tests (expected coverage)**

- **Unit tests:** each stage should be covered by unit tests that mock Wrangler, Git, and filesystem calls (`jest`/`vitest`). Examples:
- Build fixture configs under `tests/fixtures/wrangler.sample.jsonc` (and per-env variations) so unit tests can swap these in when validating branch gating and config updates without needing real secrets.
- `scripts/deploy.ts` exports a stage runner object that can be invoked with fake inputs so you can assert branch gating logic, secret whitelisting, and `wrangler.jsonc` validation without touching Cloudflare.
- `scripts/setup.ts` helpers can be tested against stubbed Wrangler CLI output (e.g., `wrangler kv namespace list`) to ensure new IDs are persisted to `wrangler.jsonc`.
- **Integration tests:** run in a CI job that uses `wrangler dev` or a Cloudflare sandbox to verify the `--dry-run` path produces the expected `wrangler deploy` command string; also assert checkpoint writing/resumption by running the script twice with a fake state file.
- **Migration tests:** use `pnpm test` to spin up an in-memory SQLite D1 database via `drizzle-kit migrate` and ensure `scripts/deploy.ts` can connect, export backups, and restore them safely.
- **CI workflow tests:** the GitHub Actions workflow should itself be validated using `act` or `npm run workflow:test` (if available) to confirm secrets injection and environment gating work as expected.
- **Seed tests:** verify that `scripts/seed.ts` runs idempotently (assert no constraint violations on re-run) and that seed data matches the expected schema after migration; test both `--env=staging` and `--env=production` variants.

### 4. CI/CD (GitHub Actions)

- A workflow file (`.github/workflows/deploy.yml`) that authenticates via `CLOUDFLARE_API_TOKEN` (stored in GitHub Secrets).
- Workflow triggers:
  - **Push to `main`** → runs `scripts/deploy.ts --env=production --confirm` (after manual approval in GitHub).
  - **Push to `develop`** → runs `scripts/deploy.ts --env=staging --confirm`.
  - **Manual trigger** (`workflow_dispatch`) for ad-hoc deployments with environment selection.
  - Use GitHub `environment: production` with required reviewers so pushes to `main` pause until an approver (e.g., release manager) signs off; staging can use `environment: staging` without blockers.
- **Secret Management in CI:**
  - Store `CLOUDFLARE_API_TOKEN` as a GitHub Organization secret (rotate quarterly).
  - Store `.env.production` secrets as separate secrets (e.g., `RESEND_API_KEY`, `DATABASE_PASSWORD`).
  - Do NOT commit `.env` files; reconstruct them in the workflow from secrets.
- **Audit Trail:**
  - Log all deployments (branch, environment, timestamp, deployed commit hash, health check result, backup size) to a summary artifact (JSON format for programmatic access).
  - On failure, log the failure reason and print recovery steps to console (e.g., rollback command, manual restore steps).
  - Send logs to **Logflare** and **Rollbar** for centralized aggregation; include deployment context (env, commit, deployer) as metadata.
  - On critical failure (health check failure, migration rollback), log to console with clear severity so the operator can screenshot or forward to on-call.
- For CLI-driven (local) deployments, the typical workflow is:
  1. `pnpm build` (on dev machine, verify no TypeScript/lint errors).
  2. `npx tsx scripts/deploy.ts --env=staging --dry-run` (preview secrets, migrations, routes).
  3. `npx tsx scripts/deploy.ts --env=staging --build-local --confirm` (deploy the reviewed build).
- For GitHub Actions workflows, `pnpm build` happens inside the workflow, then `scripts/deploy.ts` is called without `--build-local` (so it uses the fresh build artifact from the runner).

---

**Pre-Requisites (User Must Provide Upfront):**

Before running the scripts, provide:

1. **Current `wrangler.jsonc`** — Show the existing layout and which environments are already defined.
2. **Existing D1 Migrations** — List all migrations in `migrations/` and the current schema.
3. **`.env.example`** — Show which environment variables are needed (public vs. secret).
4. **Current `package.json` scripts** — Show existing build/deploy scripts (if any) to avoid conflicts.
5. **GitHub Actions Setup** — Confirm if any CI/CD workflow already exists.
6. **Cloudflare Account Setup** — Confirm:
   - **Workers Paid Plan** — Required for Next.js 15 deployments (bundle exceeds 3 MiB free-tier limit). Upgrade at dash.cloudflare.com → Workers & Pages → Plans ($5/month).
   - D1 database name and current IDs (if already created).
   - R2 bucket for backups (name, region).
   - KV namespace naming convention.
   - API token availability and scope (D1, KV, Workers, R2).

---

**Output Format:**

1.  **`scripts/setup.ts`** — The one-time provisioning script.
2.  **`scripts/deploy.ts`** — The multi-stage deployment driver with safety gates and rollback.
3.  **`.github/workflows/deploy.yml`** — GitHub Actions workflow for CI/CD.
4.  **`wrangler.jsonc` (updated)** — With `[env.staging]` and `[env.production]` blocks and ISR bindings.
5.  **`package.json` (updated)** — New scripts: `deploy:staging`, `deploy:prod`, `setup:staging`, `setup:prod`, `deploy:rollback`, `seed`, `seed:reset`.
6.  **`docs/DEPLOYMENT.md`** — A runbook explaining the workflow, failure recovery, resource limits, on-call escalation, logging, and canary deployment strategy.
7.  **`scripts/seed.ts`** — Idempotent seed script for reference data (products, categories, roles) with env-specific variants.
8.  **`scripts/seed-config.json`** — Environment-specific seed data (staging test products vs. production live products).

---

**Runbook Structure (`docs/DEPLOYMENT.md`)**

The generated runbook must include the following sections:

1. **Quick Start** — How to deploy to staging and production (copy-paste commands).
2. **Pre-Flight Checklist** — Verify Node/pnpm/Drizzle versions, check secrets exist, ensure no uncommitted changes.
3. **Deployment Flow** — Visual diagram of the 6 stages + health checks + rollback.
4. **Failure Scenarios** — Common issues and recovery:
   - "Migration failed mid-way" → manual recovery steps (investigate, rollback, or fix & resume).
   - "Health checks failed, rollback triggered" → how to diagnose the issue and re-deploy.
   - "Backup is corrupted" → how to restore from R2 history or manually.
   - "Worker deployed but DB didn't migrate" → state of the system, recovery options.
5. **Rollback Procedures** — How to manually invoke `pnpm deploy:rollback --timestamp=<ts>` with examples.
6. **Resource Limits & Cost** — Backup size thresholds, R2 retention policy, estimated monthly costs.
   - **Workers Plan**: Requires Workers Paid ($5/month) due to Next.js 15 bundle size (~3.5 MiB gzipped, exceeds 3 MiB free limit).
   - **Bundle Size Limits**: Free tier = 3 MiB, Paid tier = 10 MiB (gzipped). Current app uses ~3.5 MiB.
   - **Bundle Size Monitoring**: Track bundle size trends across deployments; alert if size increases by >10% between releases.
7. **On-Call Escalation** — Who to contact if deploy fails (console log for team, optional Slack/email forwarding).
8. **Logging & Debugging** — Where to find logs (Logflare, Rollbar), how to access raw deployment artifacts (R2 backups), how to read `deploy-state.json`.
9. **Canary/Shadow Deploys** — How to use staging environment as a pre-prod test before pushing to production.

- When using `--build-local`, the script expects `.next/` to exist locally and validates its age (fail if older than 1 hour) to prevent stale artifacts.
- Validate build cache freshness: check that `node_modules/.pnpm` and `.next/` were created/modified within 24 hours; warn if older and suggest a full rebuild.
- When using the default build path (no `--build-local`), Stage 2 reads `.env.staging` or `.env.production` from disk and syncs only whitelisted secrets to Cloudflare; the local `.env` files are never committed.
- Before deploying locally with `--build-local`, operators must ensure the correct `.env.<env>` file exists in the repo root; the script will warn if secrets are missing and prompt for manual confirmation.
- In GitHub Actions, secrets are reconstructed from GitHub Secrets at runtime (not from local `.env` files) and injected into the environment before `scripts/deploy.ts` runs.
- **No secrets in logs/checkpoints:** Ensure that `deploy-state.json` and all logs redact secret values (use placeholders like `***REDACTED***` for API keys); never write raw secrets to disk.

---

**Example Workflows**

**Local Staging Deploy (with review):**

```bash
pnpm build
npx tsx scripts/deploy.ts --env=staging --dry-run
npx tsx scripts/deploy.ts --env=staging --build-local --confirm
```

**Local Production Deploy (requires manual approval in GitHub + local build):**

```bash
pnpm build
npx tsx scripts/deploy.ts --env=production --dry-run
# Push to main, wait for GitHub approval
npx tsx scripts/deploy.ts --env=production --build-local --confirm
```

**Resume a failed deployment:**

```bash
npx tsx scripts/deploy.ts --env=staging --resume --confirm
```

**Rollback after failed migration:**

```bash
pnpm deploy:rollback --env=staging --timestamp=20251202T1230
```

---

**Instructions for the User:**

Please provide the pre-requisites listed above. Then I will generate the complete deployment infrastructure.
