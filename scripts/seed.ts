import fs from "fs";
import path from "path";
import { execSync } from "child_process";

import { hashPassword } from "@/lib/crypto";

// Import mock data
// Note: We need to use dynamic imports or ensure tsx handles these imports correctly
// Since we are running with tsx, direct imports should work if paths are correct.
// However, we are in scripts/ folder, so we need to adjust paths or use tsconfig paths.
// Let's rely on tsx handling tsconfig paths.

import { mockUsers } from "@/lib/seed-data/users";
import { mockProductCategories } from "@/lib/seed-data/products";
import { mockProducts, mockProductVariants } from "@/lib/seed-data/products";
import { mockLocations } from "@/lib/seed-data/locations";
import { mockBakeSales, mockPastBakeSales } from "@/lib/seed-data/bake-sales";
import { mockNewsPosts } from "@/lib/seed-data/news";

import { mockOrders, mockOrderItems } from "@/lib/seed-data/orders";
import { mockVouchers } from "@/lib/seed-data/vouchers";
import { mockTestimonials } from "@/lib/seed-data/testimonials";

// Import real products data (used when --real-products flag is set)
import {
  realProductCategories,
  realProducts,
  realProductVariants,
  getProductImageFiles,
} from "@/lib/real-products-data";

// Import real products mock data (orders, reviews, testimonials)
import {
  realPastBakeSales,
  realFutureBakeSales,
  realOrders,
  realOrderItems,
  realReviews,
  realTestimonials,
} from "@/lib/real-products-mock-data";

import { FAQS } from "@/constants/faq";

// Configuration
const SEED_CONFIG_PATH = path.join(process.cwd(), "scripts", "seed-config.json");
const seedConfig = JSON.parse(fs.readFileSync(SEED_CONFIG_PATH, "utf-8"));

// Arguments
const args = process.argv.slice(2);
const envArg = args.find((arg) => arg.startsWith("--env="))?.split("=")[1];
const env =
  envArg === "production" ? "production" : envArg === "staging" ? "staging" : "development";

const DB_NAME =
  env === "production"
    ? "bandofbakers-db-prod"
    : env === "staging"
      ? "bandofbakers-db-staging"
      : "bandofbakers-db";
const R2_BUCKET = "bandofbakers-assets";
const TEMP_DIR = path.join(process.cwd(), "temp_seed");

const isProdInit = args.includes("--prod-init");
const isAdminOnly = args.includes("--admin-only") || isProdInit;
const skipR2 = args.includes("--skip-r2");
// Use real products if specified in args OR if configured for the environment
const useRealProducts =
  args.includes("--real-products") || isProdInit || seedConfig[env]?.useRealProducts === true;
const imagesOnly = args.includes("--images-only"); // Full reset mode with only images focus
const r2Target = args.includes("--r2-remote") || env !== "development" ? "remote" : "local";
const r2Flag = r2Target === "remote" ? "--remote" : "--local";
const wranglerEnv = env === "staging" ? "preview" : env;
const dbFlag = env !== "development" ? `--remote` : "--local"; // Use remote for staging/prod
const envFlag = env !== "development" ? `--env ${wranglerEnv}` : "";

const normalizeR2Path = (r2Path: string) => (r2Path.startsWith("/") ? r2Path.slice(1) : r2Path);
const publicUrlForR2Path = (r2Path: string) => `/${normalizeR2Path(r2Path)}`;
// const forceR2 = args.includes("--force-r2"); // Unused for now

async function main() {
  console.log("🌱 Starting seed process...");
  console.log(`   Environment: ${env}`);
  console.log(`   Database: ${DB_NAME} (${dbFlag})`);
  console.log(
    `   Mode: ${imagesOnly ? "Images Only (Full Reset)" : isAdminOnly ? "Admin Only" : "Full Seed"}`
  );
  console.log(`   Products: ${useRealProducts ? "Real Products" : "Mock Products"}`);
  console.log(
    `   R2: ${skipR2 ? "Skipping" : r2Target === "remote" ? "Enabled (remote)" : "Enabled (local)"}`
  );

  // Create temp directory
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
  }

  try {
    // 0a. Schema guardrails for older local DBs (add columns used by current app code)
    // 0a. Schema guardrails for older local DBs (add columns used by current app code)
    if (env === "development") {
      const schemaFixes = [
        "ALTER TABLE testimonials ADD COLUMN status text DEFAULT 'pending' NOT NULL;",
        "CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);",
      ];
      for (const statement of schemaFixes) {
        try {
          execSync(`pnpm exec wrangler d1 execute ${DB_NAME} --local --command="${statement}"`, {
            stdio: "pipe",
            encoding: "utf-8",
          });
        } catch {
          // Ignore if column/index already exists
        }
      }
    }

    // 0. Clear R2 if requested
    if (args.includes("--clear")) {
      console.log("\n🧹 Clearing R2 bucket...");
      try {
        const listOutput = execSync(
          `pnpm exec wrangler r2 object list ${R2_BUCKET} ${r2Flag} ${env !== "development" ? `--env ${wranglerEnv}` : ""}`,
          {
            encoding: "utf-8",
            stdio: ["ignore", "pipe", "ignore"], // Suppress stderr
          }
        );

        const objects = JSON.parse(listOutput);
        if (Array.isArray(objects) && objects.length > 0) {
          console.log(`   Found ${objects.length} objects to delete.`);
          for (const obj of objects) {
            try {
              execSync(
                `pnpm exec wrangler r2 object delete ${R2_BUCKET}/${obj.key} ${r2Flag} ${env !== "development" ? `--env ${wranglerEnv}` : ""}`,
                {
                  stdio: "ignore",
                }
              );
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
    const imageInsertStatements: string[] = [];

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
    sqlStatements.push("DELETE FROM email_templates;");
    sqlStatements.push("DELETE FROM faqs;");

    // Email Templates
    const defaultTemplates = [
      {
        id: "tmpl_order_ready",
        name: "order_ready_for_collection",
        subject: "Your Order is Ready for Collection! 🥖",
        content: `
          <h1>Your Order is Ready!</h1>
          <p>Hi {{customer_name}},</p>
          <p>Great news! Your order #{{order_id}} is now ready for collection.</p>
          <p><strong>Collection Details:</strong></p>
          <ul>
            <li>Location: {{location_name}}</li>
            <li>Address: {{location_address}}</li>
            <li>Time: {{collection_time}}</li>
          </ul>
          <p>Please bring your order number with you.</p>
          <p>See you soon!</p>
          <p>Band of Bakers</p>
        `,
        variables: [
          "customer_name",
          "order_id",
          "location_name",
          "location_address",
          "collection_time",
        ],
      },
      {
        id: "tmpl_order_completed",
        name: "order_completed",
        subject: "Thank you for your order! 🌟",
        content: `
          <h1>Thank You!</h1>
          <p>Hi {{customer_name}},</p>
          <p>Thanks for collecting your order #{{order_id}}. We hope you enjoy your bakes!</p>
          <p>If you have a moment, we'd love to hear your feedback.</p>
          <p>Best regards,</p>
          <p>Band of Bakers</p>
        `,
        variables: ["customer_name", "order_id"],
      },
      {
        id: "tmpl_bake_sale_cancelled",
        name: "bake_sale_cancelled",
        subject: "Important: Bake Sale Cancelled ⚠️",
        content: `
          <h1>Bake Sale Update</h1>
          <p>Hi {{customer_name}},</p>
          <p>We regret to inform you that the bake sale scheduled for {{date}} at {{location_name}} has been cancelled.</p>
          <p><strong>Reason:</strong> {{reason}}</p>
          <p>Your order #{{order_id}} has been cancelled and a full refund has been processed.</p>
          <p>We apologize for any inconvenience caused.</p>
          <p>Band of Bakers</p>
        `,
        variables: ["customer_name", "date", "location_name", "reason", "order_id"],
      },
      {
        id: "tmpl_bake_sale_rescheduled",
        name: "bake_sale_rescheduled",
        subject: "Action Required: Bake Sale Rescheduled 📅",
        content: `
          <h1>Bake Sale Rescheduled</h1>
          <p>Hi {{customer_name}},</p>
          <p>The bake sale scheduled for {{old_date}} has been moved to <strong>{{new_date}}</strong>.</p>
          <p><strong>Reason:</strong> {{reason}}</p>
          <p>We have updated your order #{{order_id}} to the new date. If this doesn't work for you, please contact us to cancel for a full refund.</p>
          <p>Band of Bakers</p>
        `,
        variables: ["customer_name", "old_date", "new_date", "reason", "order_id"],
      },
      {
        id: "tmpl_action_required",
        name: "action_required",
        subject: "Action Required: Update on your Order ⚠️",
        content: `
          <h1>Action Required</h1>
          <p>Hi {{customer_name}},</p>
          <p>There has been a change to the bake sale scheduled for {{date}}.</p>
          <p><strong>Please review your options:</strong></p>
          <p><a href="{{resolution_link}}">Click here to view options</a></p>
          <p>You can choose to transfer your order to another date or cancel for a full refund.</p>
          <p>Band of Bakers</p>
        `,
        variables: ["customer_name", "date", "resolution_link"],
      },
      {
        id: "tmpl_order_update_bakery",
        name: "order_update_bakery",
        subject: "Important Update to Your Order #{{order_id}} ⚠️",
        content: `
          <h1>Order Update Required</h1>
          <p>Hi {{customer_name}},</p>
          <p>We need to inform you of some changes to your order #{{order_id}}.</p>
          <p><strong>Changes:</strong></p>
          {{change_details}}
          <p><strong>Updated Total:</strong> £{{new_total}}</p>
          <p>We apologize for any inconvenience this may cause. If you have any questions or concerns, please don't hesitate to contact us.</p>
          <p>Best regards,<br>Band of Bakers</p>
        `,
        variables: ["customer_name", "order_id", "change_details", "new_total"],
      },
      {
        id: "tmpl_order_update_customer",
        name: "order_update_customer",
        subject: "Confirmation: Your Order Changes #{{order_id}} ✓",
        content: `
          <h1>Order Changes Confirmed</h1>
          <p>Hi {{customer_name}},</p>
          <p>As requested, we've made the following changes to your order #{{order_id}}:</p>
          <p><strong>Changes:</strong></p>
          {{change_details}}
          <p><strong>Updated Total:</strong> £{{new_total}}</p>
          <p>Thank you for letting us know. If you need any further changes, please contact us.</p>
          <p>Best regards,<br>Band of Bakers</p>
        `,
        variables: ["customer_name", "order_id", "change_details", "new_total"],
      },
    ];

    for (const tmpl of defaultTemplates) {
      sqlStatements.push(
        `INSERT OR REPLACE INTO email_templates (id, name, subject, content, variables, updated_at) VALUES ('${
          tmpl.id
        }', '${tmpl.name}', '${tmpl.subject.replace(/'/g, "''")}', '${tmpl.content
          .replace(/'/g, "''")
          .replace(/\n/g, "")}', '${JSON.stringify(tmpl.variables)}', CURRENT_TIMESTAMP);`
      );
    }

    // FAQs
    for (const faq of FAQS) {
      sqlStatements.push(
        `INSERT OR REPLACE INTO faqs (id, question, answer, category, sort_order, is_active, created_at, updated_at) VALUES ('${
          faq.id
        }', '${faq.question.replace(/'/g, "''")}', '${faq.answer.replace(/'/g, "''")}', '${
          faq.category
        }', ${faq.sort_order}, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
      );
    }

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

    if (!isAdminOnly || isProdInit) {
      // Select which product data to use
      const productCategories = useRealProducts ? realProductCategories : mockProductCategories;
      const products = useRealProducts ? realProducts : mockProducts;
      const productVariants = useRealProducts ? realProductVariants : mockProductVariants;

      // Categories - use category image if available, otherwise fallback to first product
      for (const cat of productCategories) {
        let categoryImageUrl = "NULL";

        // Check if category has its own image_url (real products data)
        if (!skipR2 && "image_url" in cat && cat.image_url) {
          categoryImageUrl = publicUrlForR2Path(cat.image_url.replace(/^\//, ""));
        }
        // Check if category has its own image (mock data has .image property)
        // We uploaded these to images/categories/{slug}.jpg in the R2 step
        else if (!skipR2 && "image" in cat && cat.image) {
          categoryImageUrl = publicUrlForR2Path(`images/categories/${cat.slug}.jpg`);
        }
        // Fallback to first product image if no category image
        else {
          const firstProduct = products.find((p) => p.category_id === cat.id);
          if (!skipR2 && firstProduct?.image_url) {
            if (useRealProducts) {
              categoryImageUrl = publicUrlForR2Path(
                `images/products/${cat.slug}/${firstProduct.slug}-card.webp`
              );
            } else {
              // Fix: Include category_id in path to match R2 upload structure
              categoryImageUrl = publicUrlForR2Path(
                `images/products/${firstProduct.category_id}/${firstProduct.slug}.jpg`
              );
            }
          }
        }

        const imageVal = categoryImageUrl === "NULL" ? "NULL" : `'${categoryImageUrl}'`;

        sqlStatements.push(
          `INSERT OR REPLACE INTO product_categories (id, name, slug, description, image_url, sort_order, created_at, updated_at) VALUES ('${
            cat.id
          }', '${cat.name.replace(/'/g, "''")}', '${cat.slug}', '${(cat.description || "").replace(
            /'/g,
            "''"
          )}', ${imageVal}, ${cat.sort_order}, '${cat.created_at}', '${cat.updated_at}');`
        );
      }

      // Products
      for (const prod of products) {
        let imageUrl = "NULL";

        if (!skipR2 && prod.image_url) {
          if (useRealProducts) {
            // For real products, use category subdirectory structure
            const category = productCategories.find((c) => c.id === prod.category_id);
            const categorySlug = category?.slug || "uncategorized";
            // Use R2 URL if not skipping R2
            imageUrl = publicUrlForR2Path(`images/products/${categorySlug}/${prod.slug}-card.webp`);
          } else {
            // For mock products, use old structure
            // Use R2 URL if not skipping R2
            imageUrl = publicUrlForR2Path(`images/products/${prod.category_id}/${prod.slug}.jpg`);
          }
        } else if (skipR2) {
          imageUrl = prod.image_url || "NULL";
        }

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
      const validProductIds = new Set(products.map((p) => p.id));
      const validVariants = productVariants.filter((v) => validProductIds.has(v.product_id));

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

      // Bake Sales - use real or mock data based on flag
      // For prod-init, we skip bake sales unless there are real future ones
      const bakeSalesToSeed = isProdInit
        ? []
        : useRealProducts
          ? [...realPastBakeSales, ...realFutureBakeSales]
          : [...mockBakeSales, ...mockPastBakeSales];

      for (const sale of bakeSalesToSeed) {
        // Calculate cutoff datetime: Noon the day before the bake sale
        const saleDate = new Date(sale.date);
        const cutoffDate = new Date(saleDate);
        cutoffDate.setDate(saleDate.getDate() - 1);
        cutoffDate.setHours(12, 0, 0, 0);
        const cutoffDatetime = cutoffDate.toISOString();

        sqlStatements.push(
          `INSERT OR REPLACE INTO bake_sales (id, date, location_id, cutoff_datetime, is_active, created_at, updated_at) VALUES ('${
            sale.id
          }', '${sale.date}', '${sale.location_id}', '${cutoffDatetime}', ${
            sale.is_active ? 1 : 0
          }, '${sale.created_at}', '${sale.updated_at}');`
        );
      }

      // News Posts (always use mock news posts)
      // Skip for prod-init
      const newsPostsToSeed = isProdInit ? [] : mockNewsPosts;
      for (const post of newsPostsToSeed) {
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

      // Vouchers (always use mock vouchers)
      // Skip for prod-init
      const vouchersToSeed = isProdInit ? [] : mockVouchers;
      for (const voucher of vouchersToSeed) {
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

      // Orders - use real or mock data based on flag
      // Skip for prod-init
      const ordersToSeed = isProdInit ? [] : useRealProducts ? realOrders : mockOrders;
      const orderItemsToSeed = isProdInit ? [] : useRealProducts ? realOrderItems : mockOrderItems;

      let orderNumberCounter = 1;
      for (const order of ordersToSeed) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const orderNumber = (order as any).order_number ?? orderNumberCounter++;
        sqlStatements.push(
          `INSERT OR REPLACE INTO orders (id, order_number, user_id, bake_sale_id, status, fulfillment_method, payment_method, payment_status, payment_intent_id, subtotal, delivery_fee, voucher_discount, total, shipping_address_line1, shipping_address_line2, shipping_city, shipping_postcode, billing_address_line1, billing_address_line2, billing_city, billing_postcode, voucher_id, notes, created_at, updated_at) VALUES ('${
            order.id
          }', ${orderNumber}, '${order.user_id}', '${order.bake_sale_id}', '${order.status}', '${
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
      for (const item of orderItemsToSeed) {
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

      // Reviews - use real or empty based on flag (mock reviews don't exist)
      // Reviews - use real or empty based on flag (mock reviews don't exist)
      // Skip for prod-init
      if (useRealProducts && !isProdInit) {
        for (const review of realReviews) {
          sqlStatements.push(
            `INSERT OR REPLACE INTO reviews (id, product_id, user_id, rating, title, comment, verified_purchase, helpful_count, status, created_at, updated_at) VALUES ('${
              review.id
            }', '${review.product_id}', '${review.user_id}', ${review.rating}, ${
              review.title ? `'${review.title.replace(/'/g, "''")}'` : "NULL"
            }, '${review.comment.replace(/'/g, "''")}', ${review.verified_purchase ? 1 : 0}, ${
              review.helpful_count
            }, '${review.status}', '${review.created_at}', '${review.updated_at}');`
          );
        }
      }

      // Testimonials - use real or mock based on flag
      // Skip for prod-init
      const testimonialsToSeed = isProdInit
        ? []
        : useRealProducts
          ? realTestimonials
          : mockTestimonials;
      for (const testimonial of testimonialsToSeed) {
        sqlStatements.push(
          `INSERT OR REPLACE INTO testimonials (id, name, role, content, rating, avatar_url, user_id, status, created_at, updated_at) VALUES ('${
            testimonial.id
          }', '${testimonial.name?.replace(/'/g, "''")}', ${
            testimonial.role ? `'${testimonial.role.replace(/'/g, "''")}'` : "NULL"
          }, '${testimonial.content?.replace(/'/g, "''")}', ${testimonial.rating}, ${
            testimonial.avatar_url ? `'${testimonial.avatar_url}'` : "NULL"
          }, ${testimonial.user_id ? `'${testimonial.user_id}'` : "NULL"}, '${
            testimonial.status
          }', '${testimonial.created_at}', '${testimonial.updated_at}');`
        );
      }
    }

    // Split SQL into 3 phases to avoid FK constraint issues with large files
    console.log("\n💾 Executing SQL in 3 phases...");

    // Phase 1: Base data (Users, Locations, Vouchers, Images, News)
    const phase1Statements: string[] = [];
    phase1Statements.push("DELETE FROM order_items;");
    phase1Statements.push("DELETE FROM orders;");
    phase1Statements.push("DELETE FROM reviews;");
    phase1Statements.push("DELETE FROM testimonials;");
    phase1Statements.push("DELETE FROM news_posts;");
    phase1Statements.push("DELETE FROM product_variants;");
    phase1Statements.push("DELETE FROM products;");
    phase1Statements.push("DELETE FROM product_categories;");
    phase1Statements.push("DELETE FROM bake_sales;");
    phase1Statements.push("DELETE FROM locations;");
    phase1Statements.push("DELETE FROM vouchers;");
    phase1Statements.push("DELETE FROM users;");
    phase1Statements.push("DELETE FROM images;");
    phase1Statements.push("DELETE FROM email_templates;");
    phase1Statements.push("DELETE FROM faqs;");

    // Add users, locations, vouchers, news, images, email_templates
    phase1Statements.push(
      ...sqlStatements.filter((s) => s.includes("INSERT OR REPLACE INTO users"))
    );
    phase1Statements.push(
      ...sqlStatements.filter((s) => s.includes("INSERT OR REPLACE INTO locations"))
    );
    phase1Statements.push(
      ...sqlStatements.filter((s) => s.includes("INSERT OR REPLACE INTO vouchers"))
    );
    phase1Statements.push(
      ...sqlStatements.filter((s) => s.includes("INSERT OR REPLACE INTO news_posts"))
    );
    phase1Statements.push(
      ...sqlStatements.filter((s) => s.includes("INSERT OR REPLACE INTO images"))
    );
    phase1Statements.push(
      ...sqlStatements.filter((s) => s.includes("INSERT OR REPLACE INTO email_templates"))
    );
    phase1Statements.push(
      ...sqlStatements.filter((s) => s.includes("INSERT OR REPLACE INTO faqs"))
    );

    const phase1File = path.join(TEMP_DIR, "seed_phase1.sql");
    fs.writeFileSync(phase1File, phase1Statements.join("\n"));
    console.log("   Phase 1: Base data (users, locations, vouchers, news)");

    if (phase1Statements.length > 0) {
      try {
        execSync(
          `pnpm exec wrangler d1 execute ${DB_NAME} ${dbFlag} ${envFlag} --file=${phase1File}`,
          {
            stdio: "pipe",
            encoding: "utf-8",
          }
        );
        console.log("   ✅ Phase 1 complete");
      } catch (e: unknown) {
        console.error("\n❌ Phase 1 failed:");
        if (e && typeof e === "object" && "stdout" in e && "stderr" in e) {
          console.error(e.stdout);
          console.error(e.stderr);
        }
        throw e;
      }
    } else {
      console.log("   ℹ️  Phase 1 skipped (no data)");
    }

    // Phase 2: Products (Categories, Products, Variants)
    const phase2Statements: string[] = [];
    phase2Statements.push(
      ...sqlStatements.filter((s) => s.includes("INSERT OR REPLACE INTO product_categories"))
    );
    phase2Statements.push(
      ...sqlStatements.filter((s) => s.includes("INSERT OR REPLACE INTO products ("))
    );
    phase2Statements.push(
      ...sqlStatements.filter((s) => s.includes("INSERT OR REPLACE INTO product_variants"))
    );

    const phase2File = path.join(TEMP_DIR, "seed_phase2.sql");
    fs.writeFileSync(phase2File, phase2Statements.join("\n"));
    console.log("   Phase 2: Products (categories, products, variants)");

    if (phase2Statements.length > 0) {
      try {
        execSync(
          `pnpm exec wrangler d1 execute ${DB_NAME} ${dbFlag} ${envFlag} --file=${phase2File}`,
          {
            stdio: "pipe",
            encoding: "utf-8",
          }
        );
        console.log("   ✅ Phase 2 complete");
      } catch (e: unknown) {
        console.error("\n❌ Phase 2 failed:");
        if (e && typeof e === "object" && "stdout" in e && "stderr" in e) {
          console.error(e.stdout);
          console.error(e.stderr);
        }
        throw e;
      }
    } else {
      console.log("   ℹ️  Phase 2 skipped (no data)");
    }

    // Phase 3a: Bake Sales
    const phase3aStatements: string[] = [];
    phase3aStatements.push(
      ...sqlStatements.filter((s) => s.includes("INSERT OR REPLACE INTO bake_sales"))
    );

    const phase3aFile = path.join(TEMP_DIR, "seed_phase3a.sql");
    fs.writeFileSync(phase3aFile, phase3aStatements.join("\n"));
    console.log("   Phase 3a: Bake sales");

    if (phase3aStatements.length > 0) {
      try {
        execSync(
          `pnpm exec wrangler d1 execute ${DB_NAME} ${dbFlag} ${envFlag} --file=${phase3aFile}`,
          {
            stdio: "pipe",
            encoding: "utf-8",
          }
        );
        console.log("   ✅ Phase 3a complete");
      } catch (e: unknown) {
        console.error("\n❌ Phase 3a failed:");
        if (e && typeof e === "object" && "stdout" in e && "stderr" in e) {
          console.error(e.stdout);
          console.error(e.stderr);
        }
        throw e;
      }
    } else {
      console.log("   ℹ️  Phase 3a skipped (no data)");
    }

    // Phase 3b: Orders (split into batches to avoid FK constraints)
    const allOrderStatements = sqlStatements.filter((s) =>
      s.includes("INSERT OR REPLACE INTO orders (")
    );
    const BATCH_SIZE = 30;
    const orderBatches = [];

    for (let i = 0; i < allOrderStatements.length; i += BATCH_SIZE) {
      orderBatches.push(allOrderStatements.slice(i, i + BATCH_SIZE));
    }

    console.log(`   Phase 3b: Orders (${orderBatches.length} batches of ~${BATCH_SIZE})`);

    for (let batchIndex = 0; batchIndex < orderBatches.length; batchIndex++) {
      const batchFile = path.join(TEMP_DIR, `seed_phase3b_batch${batchIndex}.sql`);
      fs.writeFileSync(batchFile, orderBatches[batchIndex].join("\n"));

      try {
        execSync(
          `pnpm exec wrangler d1 execute ${DB_NAME} ${dbFlag} ${envFlag} --file=${batchFile}`,
          {
            stdio: "pipe",
            encoding: "utf-8",
          }
        );
        process.stdout.write(".");
      } catch (e: unknown) {
        console.error(`\n❌ Phase 3b batch ${batchIndex + 1} failed:`);
        if (e && typeof e === "object" && "stdout" in e && "stderr" in e) {
          console.error(e.stdout);
          console.error(e.stderr);
        }
        throw e;
      }
    }
    console.log(" ✅ Phase 3b complete");

    // Phase 3c: Order Items
    const phase3cStatements: string[] = [];
    phase3cStatements.push(
      ...sqlStatements.filter((s) => s.includes("INSERT OR REPLACE INTO order_items"))
    );

    const phase3cFile = path.join(TEMP_DIR, "seed_phase3c.sql");
    fs.writeFileSync(phase3cFile, phase3cStatements.join("\n"));
    console.log("   Phase 3c: Order items");

    if (phase3cStatements.length > 0) {
      try {
        execSync(
          `pnpm exec wrangler d1 execute ${DB_NAME} ${dbFlag} ${envFlag} --file=${phase3cFile}`,
          {
            stdio: "pipe",
            encoding: "utf-8",
          }
        );
        console.log("   ✅ Phase 3c complete");
      } catch (e: unknown) {
        console.error("\n❌ Phase 3c failed:");
        if (e && typeof e === "object" && "stdout" in e && "stderr" in e) {
          console.error(e.stdout);
          console.error(e.stderr);
        }
        throw e;
      }
    } else {
      console.log("   ℹ️  Phase 3c skipped (no data)");
    }

    // Phase 3d: Reviews and Testimonials
    const phase3dStatements: string[] = [];
    phase3dStatements.push(
      ...sqlStatements.filter((s) => s.includes("INSERT OR REPLACE INTO reviews"))
    );
    phase3dStatements.push(
      ...sqlStatements.filter((s) => s.includes("INSERT OR REPLACE INTO testimonials"))
    );

    const phase3dFile = path.join(TEMP_DIR, "seed_phase3d.sql");
    fs.writeFileSync(phase3dFile, phase3dStatements.join("\n"));
    console.log("   Phase 3d: Reviews and testimonials");

    if (phase3dStatements.length > 0) {
      try {
        execSync(
          `pnpm exec wrangler d1 execute ${DB_NAME} ${dbFlag} ${envFlag} --file=${phase3dFile}`,
          {
            stdio: "pipe",
            encoding: "utf-8",
          }
        );
        console.log("   ✅ Phase 3d complete");
      } catch (e: unknown) {
        console.error("\n❌ Phase 3d failed:");
        if (e && typeof e === "object" && "stdout" in e && "stderr" in e) {
          console.error(e.stdout);
          console.error(e.stderr);
        }
        throw e;
      }
    } else {
      console.log("   ℹ️  Phase 3d skipped (no data)");
    }
    console.log("\n✅ All phases executed successfully!");

    // 3. R2 Population
    if (!skipR2 && !isAdminOnly) {
      console.log("\n☁️  Populating R2 Storage...");

      // Helper to process local images from seed-products/ directory
      const processLocalImage = async (
        localFilePath: string,
        r2Path: string,
        category: string,
        tags: string[] = []
      ) => {
        const seedProductsDir = path.join(process.cwd(), "scripts/seed-data");
        const fullLocalPath = path.join(seedProductsDir, localFilePath);

        if (!fs.existsSync(seedProductsDir)) {
          console.warn(`   ⚠️  Seed products directory not found: ${seedProductsDir}`);
          return;
        }

        if (!fs.existsSync(fullLocalPath)) {
          console.warn(`   ⚠️  Local image not found: ${localFilePath}`);
          return;
        }

        const filename = path.basename(r2Path);
        const id = `img_${path.basename(r2Path, path.extname(r2Path))}`;
        const stats = fs.statSync(fullLocalPath);
        const size = stats.size;

        // Check if image already exists in R2 (unless overwriting)
        const shouldOverwrite = args.includes("--overwrite") || args.includes("--clear");

        if (!shouldOverwrite) {
          try {
            const checkResult = execSync(
              `pnpm exec wrangler r2 object get ${R2_BUCKET}/${r2Path} ${r2Flag} ${env !== "development" ? `--env ${wranglerEnv}` : ""}`,
              {
                stdio: "pipe",
              }
            );
            if (checkResult) {
              console.log(`   ✓ Image already exists in R2: ${r2Path}, skipping upload...`);
              imageInsertStatements.push(
                `INSERT OR REPLACE INTO images (id, url, filename, category, tags, size, created_at, updated_at) VALUES ('${id}', '${publicUrlForR2Path(
                  r2Path
                )}', '${filename}', '${category}', '${JSON.stringify(
                  tags
                )}', ${size}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
              );
              return;
            }
          } catch {
            // Image doesn't exist, continue with upload
          }
        }

        try {
          console.log(`   Processing local image: ${localFilePath}...`);

          // Upload to R2 directly from source (skipping optimization as requested)
          console.log(`   Uploading to ${r2Path}...`);
          execSync(
            `pnpm exec wrangler r2 object put ${R2_BUCKET}/${r2Path} --file=${fullLocalPath} ${r2Flag} ${env !== "development" ? `--env ${wranglerEnv}` : ""}`,
            {
              stdio: "ignore",
            }
          );

          // Add to SQL for images table
          imageInsertStatements.push(
            `INSERT OR REPLACE INTO images (id, url, filename, category, tags, size, created_at, updated_at) VALUES ('${id}', '${publicUrlForR2Path(
              r2Path
            )}', '${filename}', '${category}', '${JSON.stringify(tags)}', ${size}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
          );
        } catch (uploadError) {
          console.error(`   ❌ Failed to process/upload local image:`, uploadError);
        }
      };

      // Categories (only process for mock products, real products don't have category images yet)
      // Categories (only process for mock products, real products don't have category images yet)
      // Skipped for now as we don't have local images for mock categories
      if (!useRealProducts) {
        // for (const cat of mockProductCategories) {
        //   if (cat.image) {
        //     await processImage(cat.image, `images/categories/${cat.slug}.jpg`, "category", [
        //       "category",
        //       cat.slug,
        //     ]);
        //   }
        // }
      }

      // Products
      if (useRealProducts) {
        // Use local images from seed-products/ directory
        const categorySlugMap = new Map(realProductCategories.map((c) => [c.id, c.slug]));

        for (const prod of realProducts) {
          const categorySlug = categorySlugMap.get(prod.category_id) || "uncategorized";
          const imageFiles = getProductImageFiles(prod.slug);

          // Process all three image types: card, detail, thumbnail
          await processLocalImage(
            imageFiles.card,
            `images/products/${categorySlug}/${imageFiles.card}`,
            categorySlug,
            ["product", prod.category_id, prod.slug, "card"]
          );

          await processLocalImage(
            imageFiles.detail,
            `images/products/${categorySlug}/${imageFiles.detail}`,
            categorySlug,
            ["product", prod.category_id, prod.slug, "detail"]
          );

          await processLocalImage(
            imageFiles.thumbnail,
            `images/products/${categorySlug}/${imageFiles.thumbnail}`,
            categorySlug,
            ["product", prod.category_id, prod.slug, "thumbnail"]
          );
        }
      } else {
        // Use mock products with URL downloads - DISABLED
        // We only support local image seeding now
        console.log("   ⚠️  Skipping image upload for mock products (no local images available)");
      }

      // Site/brand assets (hero, logos, team, categories)
      const siteImages: Array<{
        local: string;
        r2Path: string;
        category: string;
        tags?: string[];
      }> = [
        // Hero / marketing
        { local: "site/hero/workspace-hero.webp", r2Path: "images/hero/workspace-hero.webp", category: "hero", tags: ["hero"] },
        { local: "site/hero/bakery-workspace.webp", r2Path: "images/hero/bakery-workspace.webp", category: "hero", tags: ["hero"] },
        { local: "site/hero/about-hero-v2.webp", r2Path: "images/hero/about-hero-v2.webp", category: "hero", tags: ["hero"] },
        { local: "site/hero/artisan-bread.webp", r2Path: "images/hero/artisan-bread.webp", category: "hero", tags: ["hero"] },
        // Logos
        {
          local: "site/logos/logo-transparent-256.png",
          r2Path: "images/logos/logo-transparent-256.png",
          category: "logo",
          tags: ["logo", "transparent", "256"],
        },
        {
          local: "site/logos/bandofbakers-256.png",
          r2Path: "images/logos/bandofbakers-256.png",
          category: "logo",
          tags: ["logo", "256"],
        },
        {
          local: "site/logos/logo-transparent-512.png",
          r2Path: "images/logos/logo-transparent-512.png",
          category: "logo",
          tags: ["logo", "transparent", "512"],
        },
        {
          local: "site/logos/logo-transparent-1200.png",
          r2Path: "images/logos/logo-transparent-1200.png",
          category: "logo",
          tags: ["logo", "transparent", "1200"],
        },
        // Team
        { local: "site/team/jon.webp", r2Path: "images/team/jon.webp", category: "team", tags: ["team", "jon"] },
        { local: "site/team/mike.webp", r2Path: "images/team/mike.webp", category: "team", tags: ["team", "mike"] },
        // Category hero images (share product assets but exposed under categories/)
        { local: "foccacia-detail.webp", r2Path: "images/categories/foccacia-detail.webp", category: "category", tags: ["category", "breads-loaves"] },
        {
          local: "cinnamon_knots-detail.webp",
          r2Path: "images/categories/cinnamon_knots-detail.webp",
          category: "category",
          tags: ["category", "pastries"],
        },
        {
          local: "large_apple_pie-detail.webp",
          r2Path: "images/categories/large_apple_pie-detail.webp",
          category: "category",
          tags: ["category", "pies-tarts"],
        },
        {
          local: "frangipane_slice-detail.webp",
          r2Path: "images/categories/frangipane_slice-detail.webp",
          category: "category",
          tags: ["category", "cakes-slices"],
        },
        {
          local: "pesto_swirl-detail.webp",
          r2Path: "images/categories/pesto_swirl-detail.webp",
          category: "category",
          tags: ["category", "savory"],
        },
        {
          local: "tiffin_cake_slice-detail.webp",
          r2Path: "images/categories/tiffin_cake_slice-detail.webp",
          category: "category",
          tags: ["category", "biscuits-bars"],
        },
        {
          local: "small_appleblackberry_pies-detail.webp",
          r2Path: "images/categories/small_appleblackberry_pies-detail.webp",
          category: "category",
          tags: ["category", "pies-tarts"],
        },
      ];

      for (const img of siteImages) {
        await processLocalImage(img.local, img.r2Path, img.category, img.tags || []);
      }

      // News (always use mock news posts)
      // News (always use mock news posts)
      // Skipped for now as we don't have local images for mock news
      // for (const post of mockNewsPosts) {
      //   if (post.image_url) {
      //     await processImage(post.image_url, `images/news/${post.slug}.jpg`, "news", [
      //       "news",
      //       post.slug,
      //     ]);
      //   }
      // }
    }

    // 4. Persist image metadata after uploads
    if (imageInsertStatements.length > 0) {
      console.log(`\n🖼️  Writing ${imageInsertStatements.length} image records to DB...`);
      const imagesFile = path.join(TEMP_DIR, "seed_images.sql");
      fs.writeFileSync(imagesFile, imageInsertStatements.join("\n"));

      try {
        execSync(
          `pnpm exec wrangler d1 execute ${DB_NAME} ${dbFlag} ${envFlag} --file=${imagesFile}`,
          {
            stdio: "pipe",
            encoding: "utf-8",
          }
        );
        console.log("   ✅ Image metadata inserted");
      } catch (e: unknown) {
        console.error("\n❌ Failed to insert image metadata:");
        if (e && typeof e === "object" && "stdout" in e && "stderr" in e) {
          console.error((e as { stdout?: string }).stdout);
          console.error((e as { stderr?: string }).stderr);
        }
        throw e;
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
