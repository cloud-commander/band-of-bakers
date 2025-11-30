DROP INDEX IF EXISTS `idx_testimonials_is_active`;--> statement-breakpoint
ALTER TABLE `testimonials` ADD COLUMN `status` text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_testimonials_status` ON `testimonials` (`status`);--> statement-breakpoint
-- Drop the old is_active flag now that status is present
ALTER TABLE `testimonials` DROP COLUMN `is_active`;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_bake_sales_location_id` ON `bake_sales` (`location_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_order_items_order_id` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_order_items_product_id` ON `order_items` (`product_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_orders_user_created` ON `orders` (`user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_product_variants_product_id` ON `product_variants` (`product_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_products_cat_active` ON `products` (`category_id`,`is_active`);--> statement-breakpoint
