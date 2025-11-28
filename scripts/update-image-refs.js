/**
 * Update Image References Script
 *
 * Updates all image references in code to use new optimized filenames.
 *
 * Usage: node scripts/update-image-refs.js
 */

import { promises as fs } from "fs";
import path from "path";

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};

// Mapping of old filenames to new filenames
const IMAGE_MAPPINGS = [
  // Hero images
  { old: "/artisan-bread.jpg", new: "/hero-artisan-bread.jpg" },
  { old: "artisan-bread.jpg", new: "hero-artisan-bread.jpg" },

  // Logos
  { old: "/Bandofbakers-logo.png", new: "/logo-bandofbakers-256.png" },
  { old: "Bandofbakers-logo.png", new: "logo-bandofbakers-256.png" },
  { old: "/Bandofbakers-logo-removebg-preview.png", new: "/logo-bandofbakers-256.png" },

  // Team photos
  { old: "/mike.webp", new: "/team-mike.webp" },
  { old: "mike.webp", new: "team-mike.webp" },
  { old: "/jon.webp", new: "/team-jon.webp" },
  { old: "jon.webp", new: "team-jon.webp" },

  // Instagram images
  { old: "/instagram/instagram-1.jpg", new: "/instagram/gallery-instagram-01.jpg" },
  { old: "/instagram/instagram-2.jpg", new: "/instagram/gallery-instagram-02.jpg" },
  { old: "/instagram/instagram-3.jpg", new: "/instagram/gallery-instagram-03.jpg" },
  { old: "/instagram/instagram-4.jpg", new: "/instagram/gallery-instagram-04.jpg" },
  { old: "/instagram/instagram-5.jpg", new: "/instagram/gallery-instagram-05.jpg" },
  { old: "/instagram/instagram-6.jpg", new: "/instagram/gallery-instagram-06.jpg" },
];

// Files to update
const FILES_TO_UPDATE = [
  "src/components/home/sticky-hero.tsx",
  "src/components/navbar/logo.tsx",
  "src/components/footer.tsx",
  "src/app/layout.tsx",
  "src/components/seo/structured-data.tsx",
  "src/components/instagram-feed.tsx",
  "src/lib/mocks/about.ts",
  "src/lib/constants/frontend.ts",
];

async function updateFileReferences(filePath, mappings) {
  const fullPath = path.join(__dirname, "..", filePath);

  try {
    let content = await fs.readFile(fullPath, "utf-8");
    let modified = false;
    const replacements = [];

    for (const mapping of mappings) {
      if (content.includes(mapping.old)) {
        const count = (
          content.match(new RegExp(mapping.old.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []
        ).length;
        content = content.split(mapping.old).join(mapping.new);
        modified = true;
        replacements.push({ old: mapping.old, new: mapping.new, count });
      }
    }

    if (modified) {
      await fs.writeFile(fullPath, content, "utf-8");
      console.log(`${colors.green}✓${colors.reset} Updated ${filePath}`);
      for (const rep of replacements) {
        console.log(
          `  ${rep.old} → ${rep.new} (${rep.count} occurrence${rep.count > 1 ? "s" : ""})`
        );
      }
      return replacements.length;
    } else {
      console.log(`${colors.yellow}○${colors.reset} No changes needed: ${filePath}`);
      return 0;
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(`${colors.yellow}○${colors.reset} File not found (skipped): ${filePath}`);
    } else {
      console.error(`${colors.yellow}✗${colors.reset} Error updating ${filePath}:`, error.message);
    }
    return 0;
  }
}

async function main() {
  console.log(
    `\n${colors.bright}${colors.cyan}Band of Bakers - Update Image References${colors.reset}\n`
  );
  console.log("Updating image references in code...\n");

  let totalUpdates = 0;

  for (const file of FILES_TO_UPDATE) {
    const updates = await updateFileReferences(file, IMAGE_MAPPINGS);
    totalUpdates += updates;
    console.log("");
  }

  console.log(`${colors.bright}${colors.green}✅ Complete!${colors.reset}`);
  console.log(
    `Updated ${totalUpdates} reference${totalUpdates !== 1 ? "s" : ""} across ${FILES_TO_UPDATE.length} files\n`
  );

  console.log(`${colors.bright}${colors.yellow}Next Steps:${colors.reset}`);
  console.log("1. Test the site: pnpm dev");
  console.log("2. Check all images load correctly");
  console.log("3. Delete old images if everything works:");
  console.log("   - public/artisan-bread.jpg");
  console.log("   - public/Bandofbakers-logo.png");
  console.log("   - public/Bandofbakers-logo-removebg-preview.png");
  console.log("   - public/mike.webp");
  console.log("   - public/jon.webp");
  console.log("   - public/instagram/instagram-*.jpg (old files)");
  console.log("");
}

main().catch(console.error);
