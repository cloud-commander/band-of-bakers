import { execSync } from "child_process";

/**
 * Promote User to Admin Script
 *
 * This script promotes an existing user to admin/owner role without requiring
 * email verification. Useful when you can't use the seeded admin account
 * due to Google IDP email verification requirements.
 *
 * Usage:
 *   node --loader tsx scripts/promote-to-admin.ts <email> [--local|--remote] [--role owner|admin]
 *
 * Examples:
 *   node --loader tsx scripts/promote-to-admin.ts your.email@gmail.com --local
 *   node --loader tsx scripts/promote-to-admin.ts your.email@gmail.com --remote --role owner
 */

const DB_NAME = "bandofbakers-db";

// Parse arguments
const args = process.argv.slice(2);
const email = args[0];
const isRemote = args.includes("--remote");
const dbFlag = isRemote ? "--remote" : "--local";

// Parse role (default to owner)
const roleIndex = args.indexOf("--role");
const role = roleIndex !== -1 && args[roleIndex + 1] ? args[roleIndex + 1] : "owner";

// Validate role
if (!["owner", "admin", "customer"].includes(role)) {
  console.error("❌ Invalid role. Must be one of: owner, admin, customer");
  process.exit(1);
}

async function main() {
  if (!email) {
    console.error("❌ Error: Email address is required");
    console.log("\nUsage:");
    console.log("  node --loader tsx scripts/promote-to-admin.ts <email> [--local|--remote] [--role owner|admin]");
    console.log("\nExamples:");
    console.log("  node --loader tsx scripts/promote-to-admin.ts your.email@gmail.com --local");
    console.log("  node --loader tsx scripts/promote-to-admin.ts your.email@gmail.com --remote --role owner");
    process.exit(1);
  }

  console.log("👤 Admin Promotion Script");
  console.log(`   Email: ${email}`);
  console.log(`   Role: ${role}`);
  console.log(`   Target: ${isRemote ? "Remote (Production)" : "Local (Development)"}`);
  console.log("");

  try {
    // Step 1: Check if user exists
    console.log("🔍 Checking if user exists...");
    const checkUserQuery = `SELECT id, email, name, role, email_verified FROM users WHERE email = '${email.replace(
      /'/g,
      "''"
    )}';`;

    const userResult = execSync(
      `npx wrangler d1 execute ${DB_NAME} ${dbFlag} --command="${checkUserQuery}"`,
      {
        encoding: "utf-8",
        stdio: ["ignore", "pipe", "pipe"],
      }
    );

    const userJson = JSON.parse(userResult);
    const users = userJson[0]?.results || [];

    if (users.length === 0) {
      console.error(`❌ User not found with email: ${email}`);
      console.log("\n💡 Tip: The user must already exist in the database.");
      console.log("   Make sure they have logged in at least once via Google OAuth.");
      process.exit(1);
    }

    const user = users[0];
    console.log(`   ✅ User found: ${user.name || "No name"} (${user.email})`);
    console.log(`   Current role: ${user.role}`);
    console.log(`   Email verified: ${user.email_verified ? "Yes" : "No"}`);

    // Step 2: Prompt for confirmation if changing role
    if (user.role === role) {
      console.log(`\n✨ User already has role: ${role}`);
      if (user.email_verified) {
        console.log("   No changes needed.");
        return;
      }
      console.log("   Will verify email...");
    }

    // Step 3: Update user role and verify email
    console.log(`\n🔄 Promoting user to ${role} and verifying email...`);
    const updateQuery = `UPDATE users SET role = '${role}', email_verified = 1, updated_at = CURRENT_TIMESTAMP WHERE email = '${email.replace(
      /'/g,
      "''"
    )}';`;

    execSync(`npx wrangler d1 execute ${DB_NAME} ${dbFlag} --command="${updateQuery}"`, {
      stdio: "pipe",
      encoding: "utf-8",
    });

    console.log("   ✅ User updated successfully");

    // Step 4: Verify the update
    console.log("\n🔍 Verifying update...");
    const verifyResult = execSync(
      `npx wrangler d1 execute ${DB_NAME} ${dbFlag} --command="${checkUserQuery}"`,
      {
        encoding: "utf-8",
        stdio: ["ignore", "pipe", "pipe"],
      }
    );

    const verifyJson = JSON.parse(verifyResult);
    const updatedUser = verifyJson[0]?.results[0];

    if (updatedUser && updatedUser.role === role && updatedUser.email_verified === 1) {
      console.log("   ✅ Update verified");
      console.log("\n✨ Success! User details:");
      console.log(`   Email: ${updatedUser.email}`);
      console.log(`   Name: ${updatedUser.name || "No name"}`);
      console.log(`   Role: ${updatedUser.role}`);
      console.log(`   Email Verified: Yes`);
      console.log("\n🎉 You can now log in with this account and access admin features!");
    } else {
      console.error("   ⚠️  Update verification failed");
      console.log("   User may have been updated but verification failed");
    }
  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
