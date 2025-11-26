import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { Readable } from "stream";
import { finished } from "stream/promises";
import { hashPassword } from "@/lib/crypto";

// Import mock data
// Note: We need to use dynamic imports or ensure tsx handles these imports correctly
// Since we are running with tsx, direct imports should work if paths are correct.
// However, we are in scripts/ folder, so we need to adjust paths or use tsconfig paths.
// Let's rely on tsx handling tsconfig paths.

import { mockUsers } from "@/lib/mocks/users";
import { mockProductCategories } from "@/lib/mocks/products";
import { mockProducts, mockProductVariants } from "@/lib/mocks/products";
import { mockLocations } from "@/lib/mocks/locations";
import { mockBakeSales } from "@/lib/mocks/bake-sales";
import { mockNewsPosts } from "@/lib/mocks/news";
// import { mockReviews } from "@/lib/mocks/reviews";
// import { mockTestimonials } from "@/lib/mocks/testimonials";
// import { mockFaqs } from "@/lib/mocks/faq";

// Configuration
const DB_NAME = "bandofbakers-db";
const R2_BUCKET = "bandofbakers-assets";
const TEMP_DIR = path.join(process.cwd(), "temp_seed");

// Arguments
const args = process.argv.slice(2);
const isAdminOnly = args.includes("--admin-only");
const skipR2 = args.includes("--skip-r2");
// const forceR2 = args.includes("--force-r2"); // Unused for now

async function main() {
  console.log("🌱 Starting seed process...");
  console.log(`   Mode: ${isAdminOnly ? "Admin Only" : "Full Seed"}`);
  console.log(`   R2: ${skipR2 ? "Skipping" : "Enabled"}`);

  // Create temp directory
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
  }

  try {
    // 1. Generate SQL
    console.log("\n📝 Generating SQL...");
    const sqlStatements: string[] = [];

    // Clear existing data (order matters for foreign keys)
    // We use DELETE FROM to clear data but keep structure
    // We wrap in a transaction or just append.
    // If tables don't exist, this will fail.
    // We should assume migrations have run.
    // If order_items is missing, maybe the migration file is old?

    // Let's verify schema first.
    sqlStatements.push("DELETE FROM order_items;");
    sqlStatements.push("DELETE FROM orders;");
    sqlStatements.push("DELETE FROM bake_sales;");
    sqlStatements.push("DELETE FROM locations;");
    sqlStatements.push("DELETE FROM product_variants;");
    sqlStatements.push("DELETE FROM products;");
    sqlStatements.push("DELETE FROM product_categories;");
    sqlStatements.push("DELETE FROM news_posts;");
    sqlStatements.push("DELETE FROM users;");

    // Users
    const usersToSeed = isAdminOnly ? mockUsers.filter((u) => u.role === "owner") : mockUsers;

    console.log("   Generating password hashes...");
    // Default password for all seeded users
    const DEFAULT_PASSWORD = "password123";

    for (const user of usersToSeed) {
      // Generate password hash using Web Crypto API
      const { hash, salt } = await hashPassword(DEFAULT_PASSWORD);
      // Store as "hash:salt" format
      const passwordHash = `${hash}:${salt}`;

      sqlStatements.push(
        `INSERT OR REPLACE INTO users (id, email, password_hash, name, phone, role, email_verified, created_at, updated_at) VALUES ('${
          user.id
        }', '${user.email.replace(/'/g, "''")}', '${passwordHash}', '${user.name.replace(
          /'/g,
          "''"
        )}', ${user.phone ? `'${user.phone}'` : "NULL"}, '${user.role}', ${
          user.email_verified ? 1 : 0
        }, '${user.created_at}', '${user.updated_at}');`
      );
    }

    if (!isAdminOnly) {
      // Categories
      for (const cat of mockProductCategories) {
        // Handle image URL - if R2 is enabled, we'll update it later or assume standard path
        // For now, let's use the mock URL, but if R2 is enabled, we might want to change it.
        // Let's assume we keep the mock URL structure for now or update it if we download it.
        // Actually, let's standardize R2 paths: /images/categories/[slug].jpg
        // const imageUrl = skipR2 ? cat.image : `/images/categories/${cat.slug}.jpg`;

        sqlStatements.push(
          `INSERT OR REPLACE INTO product_categories (id, name, slug, description, sort_order, created_at, updated_at) VALUES ('${
            cat.id
          }', '${cat.name.replace(/'/g, "''")}', '${cat.slug}', '${(cat.description || "").replace(
            /'/g,
            "''"
          )}', ${cat.sort_order}, '${cat.created_at}', '${cat.updated_at}');`
        );
      }

      // Products
      for (const prod of mockProducts) {
        const imageUrl = skipR2
          ? prod.image_url
          : prod.image_url
          ? `/images/products/${prod.slug}.jpg`
          : "NULL";
        const imageVal = imageUrl === "NULL" ? "NULL" : `'${imageUrl}'`;

        sqlStatements.push(
          `INSERT OR REPLACE INTO products (id, category_id, name, slug, description, base_price, image_url, is_active, created_at, updated_at) VALUES ('${
            prod.id
          }', '${prod.category_id}', '${prod.name.replace(/'/g, "''")}', '${prod.slug}', '${(
            prod.description || ""
          ).replace(/'/g, "''")}', ${prod.base_price}, ${imageVal}, ${prod.is_active ? 1 : 0}, '${
            prod.created_at
          }', '${prod.updated_at}');`
        );
      }

      // Variants
      const validProductIds = new Set(mockProducts.map((p) => p.id));
      const validVariants = mockProductVariants.filter((v) => validProductIds.has(v.product_id));

      for (const variant of validVariants) {
        sqlStatements.push(
          `INSERT OR REPLACE INTO product_variants (id, product_id, name, price_adjustment, sort_order, is_active, created_at, updated_at) VALUES ('${
            variant.id
          }', '${variant.product_id}', '${variant.name.replace(/'/g, "''")}', ${
            variant.price_adjustment
          }, ${variant.sort_order}, ${variant.is_active ? 1 : 0}, '${variant.created_at}', '${
            variant.updated_at
          }');`
        );
      }

      // Locations
      for (const loc of mockLocations) {
        sqlStatements.push(
          `INSERT OR REPLACE INTO locations (id, name, address_line1, address_line2, city, postcode, collection_hours, is_active, created_at, updated_at) VALUES ('${
            loc.id
          }', '${loc.name.replace(/'/g, "''")}', '${loc.address_line1.replace(/'/g, "''")}', ${
            loc.address_line2 ? `'${loc.address_line2.replace(/'/g, "''")}'` : "NULL"
          }, '${loc.city.replace(/'/g, "''")}', '${loc.postcode}', '${loc.collection_hours}', ${
            loc.is_active ? 1 : 0
          }, '${loc.created_at}', '${loc.updated_at}');`
        );
      }

      // Bake Sales
      for (const sale of mockBakeSales) {
        sqlStatements.push(
          `INSERT OR REPLACE INTO bake_sales (id, date, location_id, cutoff_datetime, is_active, created_at, updated_at) VALUES ('${
            sale.id
          }', '${sale.date}', '${sale.location_id}', '${sale.cutoff_datetime}', ${
            sale.is_active ? 1 : 0
          }, '${sale.created_at}', '${sale.updated_at}');`
        );
      }

      // News Posts
      for (const post of mockNewsPosts) {
        const imageUrl = skipR2
          ? post.image_url
          : post.image_url
          ? `/images/news/${post.slug}.jpg`
          : "NULL";
        const imageVal = imageUrl === "NULL" ? "NULL" : `'${imageUrl}'`;

        sqlStatements.push(
          `INSERT OR REPLACE INTO news_posts (id, title, slug, content, excerpt, image_url, author_id, is_published, published_at, created_at, updated_at) VALUES ('${
            post.id
          }', '${post.title.replace(/'/g, "''")}', '${post.slug}', '${post.content.replace(
            /'/g,
            "''"
          )}', '${(post.excerpt || "").replace(/'/g, "''")}', ${imageVal}, '${post.author_id}', ${
            post.is_published ? 1 : 0
          }, '${post.published_at}', '${post.created_at}', '${post.updated_at}');`
        );
      }
    }

    const sqlFile = path.join(TEMP_DIR, "seed.sql");
    fs.writeFileSync(sqlFile, sqlStatements.join("\n"));
    console.log(`   SQL generated at ${sqlFile}`);

    // 2. Execute SQL
    console.log("\n💾 Executing SQL against D1 (local)...");
    execSync(`npx wrangler d1 execute ${DB_NAME} --local --file=${sqlFile}`, {
      stdio: "inherit",
    });

    // 3. R2 Population
    if (!skipR2 && !isAdminOnly) {
      console.log("\n☁️  Populating R2 Storage...");

      // Fallback images (generic bakery/bread images + placeholder)
      const FALLBACK_IMAGES = [
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&h=800&fit=crop&auto=format", // Generic Bread
        "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1200&h=800&fit=crop&auto=format", // Bakery interior
        "https://placehold.co/800x600/e2e8f0/475569?text=No+Image+Available", // Reliable placeholder
      ];

      // Helper to download and upload with fallbacks
      const processImage = async (primaryUrl: string, r2Path: string) => {
        if (!primaryUrl || !primaryUrl.startsWith("http")) return;

        // Try primary URL first, then fallbacks
        const sources = [primaryUrl, ...FALLBACK_IMAGES];
        let downloaded = false;
        const tempPath = path.join(TEMP_DIR, path.basename(r2Path));

        for (const url of sources) {
          try {
            console.log(
              `   Downloading ${url === primaryUrl ? "primary" : "fallback"} image: ${url}...`
            );
            const res = await fetch(url);

            if (res.status === 404) {
              console.warn(`   ⚠️  Image not found (404): ${url}`);
              continue; // Try next source
            }
            if (!res.ok) throw new Error(`Status ${res.status}`);

            const fileStream = fs.createWriteStream(tempPath);
            // @ts-expect-error: Type 'ReadableStream<any>' is not assignable to type 'ReadableStream<Uint8Array>'.
            await finished(Readable.fromWeb(res.body).pipe(fileStream));

            downloaded = true;
            break; // Success! Stop trying other sources
          } catch (error) {
            console.warn(
              `   ⚠️  Failed to download ${url}:`,
              error instanceof Error ? error.message : error
            );
            // Continue to next source
          }
        }

        if (!downloaded) {
          console.error(`   ❌ All image sources failed for ${r2Path}. Skipping upload.`);
          return;
        }

        try {
          // Upload
          console.log(`   Uploading to ${r2Path}...`);
          execSync(`npx wrangler r2 object put ${R2_BUCKET}/${r2Path} --local --file=${tempPath}`, {
            stdio: "ignore",
          });

          // Cleanup temp file immediately
          fs.unlinkSync(tempPath);
        } catch (uploadError) {
          console.error(`   ❌ Failed to upload to R2:`, uploadError);
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
      };

      // Categories
      for (const cat of mockProductCategories) {
        if (cat.image) {
          await processImage(cat.image, `images/categories/${cat.slug}.jpg`);
        }
      }

      // Products
      for (const prod of mockProducts) {
        if (prod.image_url) {
          await processImage(prod.image_url, `images/products/${prod.slug}.jpg`);
        }
      }

      // News
      for (const post of mockNewsPosts) {
        if (post.image_url) {
          await processImage(post.image_url, `images/news/${post.slug}.jpg`);
        }
      }
    }
  } catch (error) {
    console.error("\n❌ Seed failed:", error);
    process.exit(1);
  } finally {
    // Cleanup
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }
  }

  console.log("\n✅ Seed completed successfully!");
}

main();
