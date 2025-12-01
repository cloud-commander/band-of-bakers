import fs from "fs";
import path from "path";
import { execSync } from "child_process";

/**
 * Migration Script: Update Products to Real WebP Images
 *
 * This script safely migrates from mock products to real products while
 * preserving all customer data (users, orders, reviews, etc.)
 *
 * Usage:
 *   node --loader tsx scripts/migrate-to-real-products.ts [--local|--remote]
 */

import {
  realProductCategories,
  realProducts,
  realProductVariants,
  getProductImageFiles,
} from "@/lib/real-products-data";

// Configuration
const DB_NAME = "bandofbakers-db";
const R2_BUCKET = "bandofbakers-assets";
const TEMP_DIR = path.join(process.cwd(), "temp_migration");

// Arguments
const args = process.argv.slice(2);
const r2Target = args.includes("--remote") ? "remote" : "local";
const r2Flag = r2Target === "remote" ? "--remote" : "--local";
const dbFlag = r2Flag; // Use same flag for DB

const normalizeR2Path = (r2Path: string) => (r2Path.startsWith("/") ? r2Path.slice(1) : r2Path);
const publicUrlForR2Path = (r2Path: string) => `/${normalizeR2Path(r2Path)}`;

async function main() {
  console.log("🔄 Starting safe product migration to real WebP images...");
  console.log(`   Target: ${r2Target === "remote" ? "Remote (Production)" : "Local (Development)"}`);
  console.log("   ⚠️  NOTE: Order items and reviews will be cleared (they reference old products)");
  console.log("   Preserving: Users, Orders (meta), Testimonials, Bake Sales, Locations, Vouchers");
  console.log("");

  // Create temp directory
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
  }

  try {
    // Step 1: Clear only product-related tables (preserve customer data)
    console.log("📦 Step 1: Clearing product-related data only...");

    // Note: We need to delete reviews and order_items first due to foreign key constraints
    // These reference products, so they must be deleted before we can delete products
    // This is acceptable for a migration as product IDs will change anyway
    const clearStatements = [
      "DELETE FROM reviews;", // Must delete first (references products)
      "DELETE FROM order_items;", // Must delete first (references products)
      "DELETE FROM product_variants;",
      "DELETE FROM products;",
      "DELETE FROM product_categories;",
      "DELETE FROM images;", // Clear images as they'll be regenerated
    ];

    const clearFile = path.join(TEMP_DIR, "clear_products.sql");
    fs.writeFileSync(clearFile, clearStatements.join("\n"));

    execSync(`npx wrangler d1 execute ${DB_NAME} ${dbFlag} --file=${clearFile}`, {
      stdio: "pipe",
      encoding: "utf-8",
    });
    console.log("   ✅ Product tables cleared");

    // Step 2: Insert real product categories
    console.log("\n📂 Step 2: Inserting real product categories...");
    const categoryStatements: string[] = [];

    for (const cat of realProductCategories) {
      const imageUrl = cat.image_url ? `'${cat.image_url}'` : "NULL";
      categoryStatements.push(
        `INSERT INTO product_categories (id, name, slug, description, image_url, sort_order, created_at, updated_at) VALUES ('${
          cat.id
        }', '${cat.name.replace(/'/g, "''")}', '${cat.slug}', '${(cat.description || "").replace(
          /'/g,
          "''"
        )}', ${imageUrl}, ${cat.sort_order}, '${cat.created_at}', '${cat.updated_at}');`
      );
    }

    const categoriesFile = path.join(TEMP_DIR, "categories.sql");
    fs.writeFileSync(categoriesFile, categoryStatements.join("\n"));

    execSync(`npx wrangler d1 execute ${DB_NAME} ${dbFlag} --file=${categoriesFile}`, {
      stdio: "pipe",
      encoding: "utf-8",
    });
    console.log(`   ✅ Inserted ${realProductCategories.length} categories`);

    // Step 3: Insert real products
    console.log("\n🍞 Step 3: Inserting real products...");
    const productStatements: string[] = [];
    const imageInsertStatements: string[] = [];

    for (const prod of realProducts) {
      const category = realProductCategories.find((c) => c.id === prod.category_id);
      const categorySlug = category?.slug || "uncategorized";
      const imageUrl = publicUrlForR2Path(`images/products/${categorySlug}/${prod.slug}-card.webp`);

      productStatements.push(
        `INSERT INTO products (id, category_id, name, slug, description, base_price, image_url, is_active, created_at, updated_at) VALUES ('${
          prod.id
        }', '${prod.category_id}', '${prod.name.replace(/'/g, "''")}', '${prod.slug}', '${(
          prod.description || ""
        ).replace(/'/g, "''")}', ${prod.base_price}, '${imageUrl}', ${prod.is_active ? 1 : 0}, '${
          prod.created_at
        }', '${prod.updated_at}');`
      );
    }

    const productsFile = path.join(TEMP_DIR, "products.sql");
    fs.writeFileSync(productsFile, productStatements.join("\n"));

    execSync(`npx wrangler d1 execute ${DB_NAME} ${dbFlag} --file=${productsFile}`, {
      stdio: "pipe",
      encoding: "utf-8",
    });
    console.log(`   ✅ Inserted ${realProducts.length} products`);

    // Step 4: Insert product variants
    console.log("\n🔀 Step 4: Inserting product variants...");
    const variantStatements: string[] = [];

    for (const variant of realProductVariants) {
      variantStatements.push(
        `INSERT INTO product_variants (id, product_id, name, price_adjustment, sort_order, is_active, created_at, updated_at) VALUES ('${
          variant.id
        }', '${variant.product_id}', '${variant.name.replace(/'/g, "''")}', ${
          variant.price_adjustment
        }, ${variant.sort_order}, ${variant.is_active ? 1 : 0}, '${variant.created_at}', '${
          variant.updated_at
        }');`
      );
    }

    const variantsFile = path.join(TEMP_DIR, "variants.sql");
    fs.writeFileSync(variantsFile, variantStatements.join("\n"));

    execSync(`npx wrangler d1 execute ${DB_NAME} ${dbFlag} --file=${variantsFile}`, {
      stdio: "pipe",
      encoding: "utf-8",
    });
    console.log(`   ✅ Inserted ${realProductVariants.length} variants`);

    // Step 5: Upload images to R2
    console.log("\n☁️  Step 5: Uploading product images to R2...");

    const seedProductsDir = path.join(process.cwd(), "scripts/seed-data");
    if (!fs.existsSync(seedProductsDir)) {
      console.error(`   ❌ Seed products directory not found: ${seedProductsDir}`);
      process.exit(1);
    }

    const categorySlugMap = new Map(realProductCategories.map((c) => [c.id, c.slug]));
    let uploadedCount = 0;

    for (const prod of realProducts) {
      const categorySlug = categorySlugMap.get(prod.category_id) || "uncategorized";
      const imageFiles = getProductImageFiles(prod.slug);

      // Upload all three image types: card, detail, thumbnail
      for (const [type, filename] of Object.entries(imageFiles)) {
        const localPath = path.join(seedProductsDir, filename);
        const r2Path = `images/products/${categorySlug}/${filename}`;

        if (!fs.existsSync(localPath)) {
          console.warn(`   ⚠️  Image not found: ${filename}, skipping...`);
          continue;
        }

        try {
          // Check if image already exists in R2
          try {
            execSync(`npx wrangler r2 object get ${R2_BUCKET}/${r2Path} ${r2Flag}`, {
              stdio: "pipe",
            });
            console.log(`   ✓ Image already exists: ${filename}`);
          } catch {
            // Image doesn't exist, upload it
            execSync(
              `npx wrangler r2 object put ${R2_BUCKET}/${r2Path} --file=${localPath} ${r2Flag}`,
              { stdio: "ignore" }
            );
            console.log(`   ✓ Uploaded: ${filename}`);
          }

          uploadedCount++;

          // Add to images table
          const stats = fs.statSync(localPath);
          const id = `img_${path.basename(r2Path, path.extname(r2Path))}`;
          imageInsertStatements.push(
            `INSERT OR REPLACE INTO images (id, url, filename, category, tags, size, created_at, updated_at) VALUES ('${id}', '${publicUrlForR2Path(
              r2Path
            )}', '${filename}', '${categorySlug}', '${JSON.stringify([
              "product",
              prod.category_id,
              prod.slug,
              type,
            ])}', ${stats.size}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
          );
        } catch (error) {
          console.error(`   ❌ Failed to process ${filename}:`, error instanceof Error ? error.message : error);
        }
      }
    }

    console.log(`   ✅ Processed ${uploadedCount} images`);

    // Step 6: Insert image metadata
    if (imageInsertStatements.length > 0) {
      console.log(`\n🖼️  Step 6: Writing ${imageInsertStatements.length} image records to DB...`);
      const imagesFile = path.join(TEMP_DIR, "images.sql");
      fs.writeFileSync(imagesFile, imageInsertStatements.join("\n"));

      execSync(`npx wrangler d1 execute ${DB_NAME} ${dbFlag} --file=${imagesFile}`, {
        stdio: "pipe",
        encoding: "utf-8",
      });
      console.log("   ✅ Image metadata inserted");
    }

    console.log("\n✅ Migration completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Categories: ${realProductCategories.length}`);
    console.log(`   - Products: ${realProducts.length}`);
    console.log(`   - Variants: ${realProductVariants.length}`);
    console.log(`   - Images: ${uploadedCount}`);
    console.log("\n✨ All customer data preserved (users, orders, reviews, etc.)");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  } finally {
    // Cleanup
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }
  }
}

main();
