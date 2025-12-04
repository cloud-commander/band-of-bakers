#!/usr/bin/env node
/**
 * Pushes Cognito/NextAuth secrets to Cloudflare Workers for a given env.
 * Usage: node scripts/sync-secrets.js --env=staging|production
 * Reads from .env.staging or .env.production and runs `wrangler secret put` for required keys.
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const argEnv = process.argv.find((arg) => arg.startsWith("--env="))?.split("=")[1];
if (!argEnv || !["staging", "production"].includes(argEnv)) {
  console.error("Usage: node scripts/sync-secrets.js --env=staging|production");
  process.exit(1);
}

const WRANGLER_ENV = argEnv === "staging" ? "preview" : "production";

// Prefer .env.local (requested), fall back to .env.<env>
const candidateFiles = [
  path.join(process.cwd(), ".env.local"),
  path.join(process.cwd(), `.env.${argEnv}`),
];
const envFile = candidateFiles.find((f) => fs.existsSync(f));
if (!envFile) {
  console.error(`Missing .env.local and .env.${argEnv}. Add your values first.`);
  process.exit(1);
}

const parsed = dotenv.parse(fs.readFileSync(envFile));

// Stage-specific base URLs (default if not provided in env file)
const baseUrl =
  argEnv === "production"
    ? "https://bandofbakers.co.uk"
    : "https://staging.bandofbakers.co.uk";
if (!parsed.NEXTAUTH_URL) parsed.NEXTAUTH_URL = baseUrl;
if (!parsed.AUTH_URL) parsed.AUTH_URL = baseUrl;

const REQUIRED_SECRETS = [
  "AUTH_COGNITO_ID",
  "AUTH_COGNITO_ISSUER",
  "AUTH_COGNITO_WELLKNOWN",
  "AUTH_COGNITO_AUTH",
  "AUTH_COGNITO_TOKEN",
  "AUTH_COGNITO_USERINFO",
  "AUTH_SECRET",
  "NEXTAUTH_URL",
  "AUTH_URL",
];

const OPTIONAL_SECRETS = ["CRON_SECRET"];

const missing = REQUIRED_SECRETS.filter((k) => !parsed[k]);
if (missing.length) {
  console.error(`Missing keys in ${envFile}: ${missing.join(", ")}`);
  process.exit(1);
}

function putSecret(key, value) {
  const res = spawnSync(
    "pnpm",
    ["exec", "wrangler", "secret", "put", key, "--env", WRANGLER_ENV],
    {
      encoding: "utf-8",
      input: value,
      stdio: ["pipe", "pipe", "inherit"],
    }
  );
  if (res.status !== 0) {
    console.error(`Failed to set ${key}:`, res.stderr || res.stdout);
    process.exit(res.status || 1);
  }
  console.log(`✅ Set ${key}`);
}

console.log(`Pushing secrets to wrangler env "${WRANGLER_ENV}" from ${envFile}...`);
for (const key of REQUIRED_SECRETS) {
  putSecret(key, parsed[key]);
}
for (const key of OPTIONAL_SECRETS) {
  if (parsed[key]) {
    putSecret(key, parsed[key]);
  } else {
    console.log(`ℹ️  Skipping optional secret ${key} (not set in env file)`);
  }
}
console.log("Done.");
