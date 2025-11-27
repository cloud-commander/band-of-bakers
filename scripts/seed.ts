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
import { mockBakeSales, mockPastBakeSales } from "@/lib/mocks/bake-sales";
import { mockNewsPosts } from "@/lib/mocks/news";

import { mockOrders, mockOrderItems } from "@/lib/mocks/orders";
import { mockVouchers } from "@/lib/mocks/vouchers";

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
    // 0. Clear R2 if requested
    if (args.includes("--clear")) {
      console.log("\n🧹 Clearing R2 bucket...");
      try {
        const listOutput = execSync(`npx wrangler r2 object list ${R2_BUCKET} --local`, {
          encoding: "utf-8",
          stdio: ["ignore", "pipe", "ignore"], // Suppress stderr
        });

        const objects = JSON.parse(listOutput);
        if (Array.isArray(objects) && objects.length > 0) {
          console.log(`   Found ${objects.length} objects to delete.`);
          for (const obj of objects) {
            try {
              execSync(`npx wrangler r2 object delete ${R2_BUCKET}/${obj.key} --local`, {
                stdio: "ignore",
              });
              process.stdout.write("."); // Progress indicator
            } catch {
              // Ignore deletion errors
            }
          }
          console.log("\n   ✅ Bucket cleared.");
        } else {
          console.log("   Bucket is already empty.");
        }
      } catch (error) {
        console.warn(
          "   ⚠️ Failed to list/clear bucket (it might be empty or not exist):",
          error instanceof Error ? error.message : String(error)
        );
      }
    }

    // 1. Generate SQL
    console.log("\n📝 Generating SQL...");
    const sqlStatements: string[] = [];

    // Clear existing data (order matters for foreign keys)
    // We use DELETE FROM to clear data but keep structure
    // If tables don't exist, this will fail.
    // We should assume migrations have run.
    // If order_items is missing, maybe the migration file is old?

    // Let's verify schema first.
    // Clear existing data (order matters for foreign keys)
    sqlStatements.push("DELETE FROM order_items;");
    sqlStatements.push("DELETE FROM orders;");
    sqlStatements.push("DELETE FROM reviews;");
    sqlStatements.push("DELETE FROM testimonials;");
    sqlStatements.push("DELETE FROM news_posts;");
    sqlStatements.push("DELETE FROM product_variants;");
    sqlStatements.push("DELETE FROM products;");
    sqlStatements.push("DELETE FROM product_categories;");
    sqlStatements.push("DELETE FROM bake_sales;");
    sqlStatements.push("DELETE FROM locations;");
    sqlStatements.push("DELETE FROM vouchers;");
    sqlStatements.push("DELETE FROM users;");
    sqlStatements.push("DELETE FROM images;");

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

      for (const sale of mockPastBakeSales) {
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

      // Vouchers
      for (const voucher of mockVouchers) {
        sqlStatements.push(
          `INSERT OR REPLACE INTO vouchers (id, code, type, value, min_order_value, max_uses, current_uses, max_uses_per_customer, valid_from, valid_until, is_active, created_at, updated_at) VALUES ('${
            voucher.id
          }', '${voucher.code}', '${voucher.type}', ${voucher.value}, ${voucher.min_order_value}, ${
            voucher.max_uses === null ? "NULL" : voucher.max_uses
          }, ${voucher.current_uses}, ${voucher.max_uses_per_customer}, '${voucher.valid_from}', '${
            voucher.valid_until
          }', ${voucher.is_active ? 1 : 0}, '${voucher.created_at}', '${voucher.updated_at}');`
        );
      }

      // Orders
      for (const order of mockOrders) {
        sqlStatements.push(
          `INSERT OR REPLACE INTO orders (id, user_id, bake_sale_id, status, fulfillment_method, payment_method, payment_status, payment_intent_id, subtotal, delivery_fee, voucher_discount, total, shipping_address_line1, shipping_address_line2, shipping_city, shipping_postcode, billing_address_line1, billing_address_line2, billing_city, billing_postcode, voucher_id, notes, created_at, updated_at) VALUES ('${
            order.id
          }', '${order.user_id}', '${order.bake_sale_id}', '${order.status}', '${
            order.fulfillment_method
          }', '${order.payment_method}', '${order.payment_status}', ${
            order.payment_intent_id ? `'${order.payment_intent_id}'` : "NULL"
          }, ${order.subtotal}, ${order.delivery_fee}, ${order.voucher_discount}, ${order.total}, ${
            order.shipping_address_line1
              ? `'${order.shipping_address_line1.replace(/'/g, "''")}'`
              : "NULL"
          }, ${
            order.shipping_address_line2
              ? `'${order.shipping_address_line2.replace(/'/g, "''")}'`
              : "NULL"
          }, ${order.shipping_city ? `'${order.shipping_city.replace(/'/g, "''")}'` : "NULL"}, ${
            order.shipping_postcode ? `'${order.shipping_postcode}'` : "NULL"
          }, '${order.billing_address_line1.replace(/'/g, "''")}', ${
            order.billing_address_line2
              ? `'${order.billing_address_line2.replace(/'/g, "''")}'`
              : "NULL"
          }, '${order.billing_city.replace(/'/g, "''")}', '${order.billing_postcode}', ${
            order.voucher_id ? `'${order.voucher_id}'` : "NULL"
          }, ${order.notes ? `'${order.notes.replace(/'/g, "''")}'` : "NULL"}, '${
            order.created_at
          }', '${order.updated_at}');`
        );
      }

      // Order Items
      for (const item of mockOrderItems) {
        sqlStatements.push(
          `INSERT OR REPLACE INTO order_items (id, order_id, product_id, product_variant_id, quantity, unit_price, total_price, is_available, unavailable_reason, created_at, updated_at) VALUES ('${
            item.id
          }', '${item.order_id}', '${item.product_id}', ${
            item.product_variant_id ? `'${item.product_variant_id}'` : "NULL"
          }, ${item.quantity}, ${item.unit_price}, ${item.total_price}, ${
            item.is_available ? 1 : 0
          }, ${
            item.unavailable_reason ? `'${item.unavailable_reason.replace(/'/g, "''")}'` : "NULL"
          }, '${item.created_at}', '${item.updated_at}');`
        );
      }
    }

    const sqlFile = path.join(TEMP_DIR, "seed.sql");
    fs.writeFileSync(sqlFile, sqlStatements.join("\n"));
    console.log(`   SQL generated at ${sqlFile}`);

    // 2. Execute SQL
    console.log("\n💾 Executing SQL against D1 (local)...");
    try {
      execSync(`npx wrangler d1 execute ${DB_NAME} --local --file=${sqlFile}`, {
        stdio: "pipe",
        encoding: "utf-8",
      });
    } catch (e: any) {
      console.error("Wrangler Error Output:");
      console.error(e.stdout);
      console.error(e.stderr);
      throw e;
    }

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
      const processImage = async (
        primaryUrl: string,
        r2Path: string,
        category: string,
        tags: string[] = []
      ) => {
        if (!primaryUrl || !primaryUrl.startsWith("http")) return;

        let size = 0;
        const filename = path.basename(r2Path);
        const id = `img_${path.basename(r2Path, path.extname(r2Path))}`; // Simple ID generation

        // Check if image already exists in R2 (unless overwriting)
        const shouldOverwrite = args.includes("--overwrite") || args.includes("--clear");

        if (!shouldOverwrite) {
          try {
            const checkResult = execSync(
              `npx wrangler r2 object get ${R2_BUCKET}/${r2Path} --local`,
              { stdio: "pipe" }
            );
            if (checkResult) {
              console.log(`   ✓ Image already exists in R2: ${r2Path}, skipping upload...`);
              // Still need to insert into DB if not exists
              // Since we don't have size easily without downloading, we might skip size or set dummy
              // But let's try to get size from checkResult if possible, or just default.
              // For now, let's just insert into DB.
              sqlStatements.push(
                `INSERT OR REPLACE INTO images (id, url, filename, category, tags, size, created_at, updated_at) VALUES ('${id}', 'https://pub-83c559424755490cb53e8df3d93994d8.r2.dev/${r2Path}', '${filename}', '${category}', '${JSON.stringify(
                  tags
                )}', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
              );
              return;
            }
          } catch (error) {
            // Image doesn't exist, continue with upload
          }
        }

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

            // Resize image using sharp
            // We need to import sharp dynamically or use require if it's a CJS script, but this is TSX.
            // Let's try dynamic import first to avoid top-level import issues if sharp is optional (though it's in deps).
            // Actually, we can just use standard import at top, but since I'm editing this block, I'll use dynamic import for safety in this context.
            const sharp = (await import("sharp")).default;

            const buffer = fs.readFileSync(tempPath);
            const originalSize = buffer.length;

            const resizedBuffer = await sharp(buffer)
              .resize(1200, 1200, { fit: "inside", withoutEnlargement: true }) // Max 1200x1200, preserve aspect ratio
              .jpeg({ quality: 80, mozjpeg: true }) // Compress as JPEG
              .toBuffer();

            fs.writeFileSync(tempPath, resizedBuffer);

            // Get file stats
            const stats = fs.statSync(tempPath);
            size = stats.size;

            console.log(
              `      Resized: ${(originalSize / 1024).toFixed(1)}KB -> ${(size / 1024).toFixed(
                1
              )}KB`
            );

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

          // Add to SQL
          sqlStatements.push(
            `INSERT OR REPLACE INTO images (id, url, filename, category, tags, size, created_at, updated_at) VALUES ('${id}', 'https://pub-83c559424755490cb53e8df3d93994d8.r2.dev/${r2Path}', '${filename}', '${category}', '${JSON.stringify(
              tags
            )}', ${size}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
          );

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
          await processImage(cat.image, `images/categories/${cat.slug}.jpg`, "category", [
            "category",
            cat.slug,
          ]);
        }
      }

      // Products
      for (const prod of mockProducts) {
        if (prod.image_url) {
          await processImage(
            prod.image_url,
            `images/products/${prod.category_id}/${prod.slug}.jpg`,
            "product",
            ["product", prod.category_id, prod.slug]
          );
        }
      }

      // News
      for (const post of mockNewsPosts) {
        if (post.image_url) {
          await processImage(post.image_url, `images/news/${post.slug}.jpg`, "news", [
            "news",
            post.slug,
          ]);
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
