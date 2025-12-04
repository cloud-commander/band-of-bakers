"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// scripts/deploy.ts
var import_child_process = require("child_process");
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_readline = __toESM(require("readline"));
var WRANGLER_CONFIG_PATH = import_path.default.join(process.cwd(), "wrangler.jsonc");
var STATE_FILE_DEFAULT = "deploy-state.json";
var BACKUP_DIR = import_path.default.join(process.cwd(), "backups");
var args = process.argv.slice(2);
var envArg = args.find((arg) => arg.startsWith("--env="))?.split("=")[1];
var confirm = args.includes("--confirm");
var dryRun = args.includes("--dry-run");
var skipSecrets = args.includes("--skip-secrets");
var skipBackup = args.includes("--skip-backup");
var backupOnly = args.includes("--backup-only");
var resume = args.includes("--resume");
var rollback = args.includes("--rollback");
var timestampArg = args.find((arg) => arg.startsWith("--timestamp="))?.split("=")[1];
var buildLocal = args.includes("--build-local");
var noHealthCheck = args.includes("--no-health-check");
var healthCheckTimeoutArg = args.find((arg) => arg.startsWith("--health-check-timeout="))?.split("=")[1];
var healthCheckTimeout = healthCheckTimeoutArg ? parseInt(healthCheckTimeoutArg, 10) : 60;
var stateFileArg = args.find((arg) => arg.startsWith("--state-file="))?.split("=")[1];
var stateFile = stateFileArg || STATE_FILE_DEFAULT;
if (!envArg || envArg !== "staging" && envArg !== "production") {
  console.error("\u274C Error: Please specify --env=staging or --env=production");
  process.exit(1);
}
var ENV = envArg;
var WRANGLER_ENV = ENV === "staging" ? "preview" : ENV;
function runCommand(command, options = {}) {
  console.log(`> ${command}`);
  try {
    return (0, import_child_process.execSync)(command, { encoding: "utf-8", stdio: "pipe", ...options }).trim();
  } catch (error) {
    if (!options.ignoreError) {
      console.error(`\u274C Command failed: ${command}`);
      const err = error;
      console.error(err.stderr || err.message);
      throw error;
    }
    throw error;
  }
}
function log(message) {
  console.log(`
${message}`);
}
function saveState(stage, data = {}) {
  const state = {
    stage,
    env: ENV,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    ...data
  };
  import_fs.default.writeFileSync(stateFile, JSON.stringify(state, null, 2));
}
function loadState() {
  if (import_fs.default.existsSync(stateFile)) {
    return JSON.parse(import_fs.default.readFileSync(stateFile, "utf-8"));
  }
  return null;
}
async function askConfirmation(message) {
  if (confirm) return true;
  const rl = import_readline.default.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(`${message} (y/N) `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y");
    });
  });
}
async function stage0_ConfigValidation() {
  log("\u{1F50D} Stage 0: Configuration Validation");
  const wranglerVersion = runCommand("pnpm exec wrangler --version");
  log(`   Wrangler version: ${wranglerVersion}`);
  const nodeVersion = process.version;
  log(`   Node version: ${nodeVersion}`);
  runCommand("pnpm --version");
  runCommand("pnpm exec drizzle-kit --version");
  const configContent = import_fs.default.readFileSync(WRANGLER_CONFIG_PATH, "utf-8");
  if (!configContent.includes(`"${WRANGLER_ENV}"`)) {
    throw new Error(`Missing [env.${WRANGLER_ENV}] block in wrangler.jsonc`);
  }
  if (configContent.includes("TODO_STAGING_DB_ID") || configContent.includes("TODO_PROD_DB_ID")) {
    throw new Error(
      "\u274C wrangler.jsonc contains TODO placeholders. Please run scripts/setup.ts first."
    );
  }
  log("\u2705 Configuration valid.");
}
async function stage1_PreDeploymentChecks() {
  log("\u{1F6E1}\uFE0F Stage 1: Pre-Deployment Checks");
  const currentBranch = runCommand("git rev-parse --abbrev-ref HEAD");
  log(`   Current branch: ${currentBranch}`);
  if (ENV === "production" && currentBranch !== "main") {
    throw new Error("\u274C Production deployments must be from main branch.");
  }
  if (ENV === "staging" && !["develop", "main"].includes(currentBranch) && !currentBranch.startsWith("feature/")) {
    console.warn("\u26A0\uFE0F  Warning: Staging deployment from non-standard branch.");
  }
  const status = runCommand("git status --porcelain");
  if (status) {
    console.warn("\u26A0\uFE0F  Uncommitted changes detected:");
    console.log(status);
    if (!await askConfirmation("Continue with uncommitted changes?")) {
      process.exit(1);
    }
  }
  if (dryRun) {
    log("\u2139\uFE0F  Dry-run enabled. Skipping actual changes.");
    process.exit(0);
  }
}
async function stage2_SecretSync() {
  if (skipSecrets) {
    log("\u23ED\uFE0F  Stage 2: Secret Sync (Skipped)");
    return;
  }
  log("\u{1F511} Stage 2: Secret Sync");
  const envFile = `.env.${ENV}`;
  if (!import_fs.default.existsSync(envFile)) {
    console.warn(`\u26A0\uFE0F  ${envFile} not found. Skipping secret sync.`);
    return;
  }
  const envContent = import_fs.default.readFileSync(envFile, "utf-8");
  const secrets = envContent.split("\n").filter((line) => line.trim() && !line.startsWith("#"));
  const whitelist = ["CLOUDFLARE_", "DATABASE_", "RESEND_", "BANDOFBAKERS_"];
  const secretsToSync = secrets.filter((s) => whitelist.some((prefix) => s.startsWith(prefix)));
  if (secretsToSync.length === 0) {
    log("   No whitelisted secrets found to sync.");
    return;
  }
  log("   Secrets to sync:");
  secretsToSync.forEach((s) => console.log(`   - ${s.split("=")[0]}`));
  if (!await askConfirmation("Sync these secrets?")) {
    log("   Skipping secret sync.");
    return;
  }
  for (const secret of secretsToSync) {
    const [key, value] = secret.split("=");
    try {
      const child = (0, import_child_process.spawnSync)(
        "pnpm",
        ["exec", "wrangler", "secret", "put", key, "--env", WRANGLER_ENV],
        {
          input: value,
          encoding: "utf-8"
        }
      );
      if (child.status !== 0) {
        console.error(`Failed to sync ${key}: ${child.stderr}`);
      } else {
        console.log(`   \u2705 Synced ${key}`);
      }
    } catch (error) {
      console.error(`Failed to sync ${key}:`, error);
    }
  }
}
async function stage3_SafetyBackup() {
  if (skipBackup) {
    log("\u23ED\uFE0F  Stage 3: Safety Backup (Skipped)");
    return;
  }
  log("\u{1F4BE} Stage 3: Safety Backup");
  if (!import_fs.default.existsSync(BACKUP_DIR)) {
    import_fs.default.mkdirSync(BACKUP_DIR);
  }
  const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  const backupFile = import_path.default.join(BACKUP_DIR, `d1-${ENV}-${timestamp}.sql`);
  const dbName = ENV === "production" ? "bandofbakers-db-prod" : "bandofbakers-db-staging";
  log(`   Backing up ${dbName} to ${backupFile}...`);
  try {
    runCommand(`pnpm exec wrangler d1 export ${dbName} --remote --output ${backupFile}`);
    const stats = import_fs.default.statSync(backupFile);
    const sizeMB = stats.size / (1024 * 1024);
    log(`   Backup size: ${sizeMB.toFixed(2)} MB`);
    if (sizeMB > 100) {
      if (!await askConfirmation("Backup is large (>100MB). Continue?")) {
        process.exit(1);
      }
    }
    log("   Uploading to R2...");
    const r2Key = `backups/d1-${ENV}-${timestamp}.sql`;
    runCommand(
      `pnpm exec wrangler r2 object put bandofbakers-assets/${r2Key} --file=${backupFile}`
    );
    log("   \u2705 Backup uploaded to R2.");
  } catch (error) {
    console.error("\u274C Backup failed.");
    throw error;
  }
  if (backupOnly) {
    log("\u{1F6D1} Backup-only mode. Exiting.");
    process.exit(0);
  }
}
async function stage4_Migration() {
  log("\u{1F504} Stage 4: Migration");
  if (!await askConfirmation("Apply database migrations?")) {
    log("   Skipping migrations.");
    return;
  }
  const dbName = ENV === "production" ? "bandofbakers-db-prod" : "bandofbakers-db-staging";
  try {
    runCommand(`pnpm exec wrangler d1 migrations apply ${dbName} --env ${WRANGLER_ENV} --remote`);
    log("   \u2705 Migrations applied.");
  } catch (error) {
    console.error("\u274C Migration failed.");
    console.log("   See instructions for manual recovery.");
    throw error;
  }
}
async function stage5_Deploy() {
  log("\u{1F680} Stage 5: Deploy");
  if (!buildLocal) {
    log("   Building project with opennextjs-cloudflare...");
    runCommand("npx opennextjs-cloudflare build");
    log("   \u2705 Build completed.");
  } else {
    log("   Using local build artifacts...");
    if (!import_fs.default.existsSync(".open-next/cloudflare")) {
      throw new Error(
        "\u274C .open-next/cloudflare folder missing. Run build first or remove --build-local."
      );
    }
  }
  log(`   Deploying to ${ENV}...`);
  runCommand(`npx opennextjs-cloudflare deploy`);
  if (noHealthCheck) {
    log("   Health check skipped.");
    return;
  }
  log("   Running health checks...");
  const baseUrl = ENV === "production" ? "https://bandofbakers.co.uk" : "https://staging.bandofbakers.co.uk";
  const healthUrl = `${baseUrl}/api/health`;
  log(`   Checking ${healthUrl}...`);
  let attempts = 0;
  const maxAttempts = healthCheckTimeout / 2;
  let success = false;
  while (attempts < maxAttempts) {
    try {
      const res = await fetch(healthUrl);
      if (res.ok) {
        success = true;
        break;
      }
    } catch {
    }
    await new Promise((r) => setTimeout(r, 2e3));
    attempts++;
    process.stdout.write(".");
  }
  if (success) {
    log("   \u2705 Health check passed.");
  } else {
    console.error("\n\u274C Health check failed.");
    if (await askConfirmation("Health check failed. Rollback?")) {
      log("   Triggering rollback...");
    }
  }
}
async function performRollback() {
  log("\u23EA Rollback Mode");
  if (!timestampArg) {
    throw new Error("\u274C --timestamp required for rollback (format: YYYYMMDD-HHMMSS)");
  }
  const dbName = ENV === "production" ? "bandofbakers-db-prod" : "bandofbakers-db-staging";
  const backupFile = `d1-${ENV}-${timestampArg}.sql`;
  const r2Key = `backups/${backupFile}`;
  const localBackupPath = import_path.default.join(BACKUP_DIR, backupFile);
  log(`   Target backup: ${r2Key}`);
  if (!import_fs.default.existsSync(localBackupPath)) {
    log("   Local backup not found. Downloading from R2...");
    if (!import_fs.default.existsSync(BACKUP_DIR)) {
      import_fs.default.mkdirSync(BACKUP_DIR);
    }
    try {
      runCommand(
        `pnpm exec wrangler r2 object get bandofbakers-assets/${r2Key} --file=${localBackupPath}`
      );
      log("   \u2705 Downloaded backup from R2.");
    } catch {
      throw new Error(`\u274C Failed to download backup ${r2Key}. Check timestamp and R2.`);
    }
  }
  if (!await askConfirmation(
    `\u26A0\uFE0F  ARE YOU SURE? This will overwrite the ${ENV} database with backup ${timestampArg}.`
  )) {
    log("   Rollback cancelled.");
    return;
  }
  log(`   Restoring ${dbName} from ${localBackupPath}...`);
  try {
    runCommand(`pnpm exec wrangler d1 execute ${dbName} --remote --file=${localBackupPath}`);
    runCommand(
      `pnpm exec wrangler d1 execute ${dbName} --env ${WRANGLER_ENV} --remote --file=${localBackupPath}`
    );
    log("   \u2705 Database restored successfully.");
  } catch {
    throw new Error("\u274C Database restore failed.");
  }
  log("\n\u2139\uFE0F  Worker Rollback:");
  log(
    "   To rollback the worker, please use the Cloudflare Dashboard or re-deploy the specific commit."
  );
  log(
    `   Visit: https://dash.cloudflare.com/${process.env.CLOUDFLARE_ACCOUNT_ID}/pages/view/bandofbakers-v2/deployments`
  );
}
async function main() {
  try {
    if (rollback) {
      await performRollback();
      return;
    }
    if (resume) {
      const state = loadState();
      if (state && state.env === ENV) {
        log(`Resuming from stage ${state.stage}...`);
      }
    }
    await stage0_ConfigValidation();
    saveState("stage0");
    await stage1_PreDeploymentChecks();
    saveState("stage1");
    await stage2_SecretSync();
    saveState("stage2");
    await stage3_SafetyBackup();
    saveState("stage3");
    await stage4_Migration();
    saveState("stage4");
    await stage5_Deploy();
    saveState("complete");
    log("\n\u2728 Deployment complete!");
  } catch (error) {
    console.error(
      "\n\u274C Deployment failed:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}
main();
