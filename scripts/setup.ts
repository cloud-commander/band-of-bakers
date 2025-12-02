import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const ENV = process.argv.find((arg) => arg.startsWith("--env="))?.split("=")[1];

if (!ENV || (ENV !== "staging" && ENV !== "production")) {
  console.error("Please specify --env=staging or --env=production");
  process.exit(1);
}

const WRANGLER_CONFIG_PATH = path.join(process.cwd(), "wrangler.jsonc");

function runCommand(command: string): string {
  try {
    return execSync(command, { encoding: "utf-8", stdio: "pipe" }).trim();
  } catch (error: any) {
    console.error(`Command failed: ${command}`);
    console.error(error.stderr || error.message);
    throw error;
  }
}

function getWranglerConfig() {
  const content = fs.readFileSync(WRANGLER_CONFIG_PATH, "utf-8");
  // Robust JSONC parser that preserves strings containing //
  const json = content.replace(/(".*?"|'.*?')|(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm, (match, string) => {
    if (string) return string; // Keep strings
    return ""; // Remove comments
  });
  return JSON.parse(json);
}

function updateWranglerConfig(newConfig: any) {
  // We can't easily preserve comments with JSON.stringify, so we'll do a regex replacement on the original file content
  // to update specific IDs. This is safer than rewriting the whole file and losing comments.
  let content = fs.readFileSync(WRANGLER_CONFIG_PATH, "utf-8");

  const envConfig = newConfig.env[ENV!];

  // Update D1 ID
  const dbId = envConfig.d1_databases[0].database_id;
  const dbPlaceholder = ENV === "staging" ? "TODO_STAGING_DB_ID" : "TODO_PROD_DB_ID";
  if (dbId && dbId !== dbPlaceholder) {
    content = content.replace(dbPlaceholder, dbId);
  }

  // Update KV IDs
  const nextDataKvId = envConfig.kv_namespaces.find((kv: any) => kv.binding === "NEXT_DATA_KV")?.id;
  const nextDataKvPlaceholder =
    ENV === "staging" ? "TODO_STAGING_NEXT_DATA_KV_ID" : "TODO_PROD_NEXT_DATA_KV_ID";
  if (nextDataKvId && nextDataKvId !== nextDataKvPlaceholder) {
    content = content.replace(nextDataKvPlaceholder, nextDataKvId);
  }

  const assetsKvId = envConfig.kv_namespaces.find((kv: any) => kv.binding === "ASSETS_KV")?.id;
  const assetsKvPlaceholder =
    ENV === "staging" ? "TODO_STAGING_ASSETS_KV_ID" : "TODO_PROD_ASSETS_KV_ID";
  if (assetsKvId && assetsKvId !== assetsKvPlaceholder) {
    content = content.replace(assetsKvPlaceholder, assetsKvId);
  }

  fs.writeFileSync(WRANGLER_CONFIG_PATH, content);
}

async function main() {
  console.log(`🚀 Bootstrapping ${ENV} environment...`);

  const config = getWranglerConfig();
  const envConfig = config.env[ENV!];

  // 1. D1 Database
  const dbName = envConfig.d1_databases[0].database_name;
  console.log(`Checking D1 database: ${dbName}...`);
  try {
    const d1List = JSON.parse(runCommand("pnpm exec wrangler d1 list --json"));
    let db = d1List.find((d: any) => d.name === dbName);

    if (!db) {
      console.log(`Creating D1 database: ${dbName}...`);
      runCommand(`pnpm exec wrangler d1 create ${dbName}`);
      // Re-fetch list to get the new DB ID
      const d1ListNew = JSON.parse(runCommand("pnpm exec wrangler d1 list --json"));
      db = d1ListNew.find((d: any) => d.name === dbName);
    }

    console.log(`✅ D1 Database ID: ${db.uuid}`);
    envConfig.d1_databases[0].database_id = db.uuid;
  } catch (error) {
    console.error("Failed to manage D1 database");
    process.exit(1);
  }

  // 2. KV Namespaces
  const kvBindings = ["NEXT_DATA_KV", "ASSETS_KV"];
  const kvNamespaceSuffix = ENV === "staging" ? "staging" : "prod";

  for (const binding of kvBindings) {
    const kvName = `bandofbakers-${binding.toLowerCase().replace(/_/g, "-")}-${kvNamespaceSuffix}`;
    console.log(`Checking KV namespace: ${kvName}...`);

    try {
      // wrangler kv namespace list returns JSON by default
      const kvList = JSON.parse(runCommand("pnpm exec wrangler kv namespace list"));
      let kv = kvList.find((k: any) => k.title === kvName);

      if (!kv) {
        console.log(`Creating KV namespace: ${kvName}...`);
        runCommand(`pnpm exec wrangler kv namespace create ${kvName}`);

        // Re-fetch list to get the new KV ID
        const kvListNew = JSON.parse(runCommand("pnpm exec wrangler kv namespace list"));
        kv = kvListNew.find((k: any) => k.title === kvName);
      }

      console.log(`✅ KV Namespace ID for ${binding}: ${kv.id}`);
      const configKv = envConfig.kv_namespaces.find((k: any) => k.binding === binding);
      if (configKv) {
        configKv.id = kv.id;
      }
    } catch (error) {
      console.error(`Failed to manage KV namespace ${kvName}`);
      process.exit(1);
    }
  }

  // 3. Update wrangler.jsonc
  console.log("Updating wrangler.jsonc...");
  updateWranglerConfig(config);

  // 4. Apply Migrations
  console.log("Applying migrations...");
  try {
    runCommand(`pnpm exec wrangler d1 migrations apply DB --env ${ENV} --remote`);
    console.log("✅ Migrations applied successfully.");
  } catch (error) {
    console.error("Failed to apply migrations.");
    // Don't exit here, maybe we want to continue to seeding or just warn
  }

  console.log(`\n🎉 ${ENV} environment bootstrapped successfully!`);
  console.log("Next steps:");
  console.log(`1. Run "pnpm seed --env=${ENV}" to seed initial data.`);
  console.log(`2. Run "pnpm deploy:${ENV === "production" ? "prod" : "staging"}" to deploy.`);
}

main();
