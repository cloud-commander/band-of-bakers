PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`order_number` integer NOT NULL,
	`user_id` text NOT NULL,
	`bake_sale_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`fulfillment_method` text DEFAULT 'collection' NOT NULL,
	`payment_method` text DEFAULT 'payment_on_collection' NOT NULL,
	`payment_status` text DEFAULT 'pending' NOT NULL,
	`payment_intent_id` text,
	`subtotal` real NOT NULL,
	`delivery_fee` real DEFAULT 0 NOT NULL,
	`voucher_discount` real DEFAULT 0 NOT NULL,
	`total` real NOT NULL,
	`shipping_address_line1` text,
	`shipping_address_line2` text,
	`shipping_city` text,
	`shipping_postcode` text,
	`billing_address_line1` text NOT NULL,
	`billing_address_line2` text,
	`billing_city` text NOT NULL,
	`billing_postcode` text NOT NULL,
	`voucher_id` text,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`bake_sale_id`) REFERENCES `bake_sales`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`voucher_id`) REFERENCES `vouchers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_orders`("id", "order_number", "user_id", "bake_sale_id", "status", "fulfillment_method", "payment_method", "payment_status", "payment_intent_id", "subtotal", "delivery_fee", "voucher_discount", "total", "shipping_address_line1", "shipping_address_line2", "shipping_city", "shipping_postcode", "billing_address_line1", "billing_address_line2", "billing_city", "billing_postcode", "voucher_id", "notes", "created_at", "updated_at") SELECT "id", "order_number", "user_id", "bake_sale_id", "status", "fulfillment_method", "payment_method", "payment_status", "payment_intent_id", "subtotal", "delivery_fee", "voucher_discount", "total", "shipping_address_line1", "shipping_address_line2", "shipping_city", "shipping_postcode", "billing_address_line1", "billing_address_line2", "billing_city", "billing_postcode", "voucher_id", "notes", "created_at", "updated_at" FROM `orders`;--> statement-breakpoint
DROP TABLE `orders`;--> statement-breakpoint
ALTER TABLE `__new_orders` RENAME TO `orders`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_orders_order_number` ON `orders` (`order_number`);--> statement-breakpoint
CREATE INDEX `idx_orders_user_id` ON `orders` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_orders_status` ON `orders` (`status`);--> statement-breakpoint
CREATE INDEX `idx_orders_created_at` ON `orders` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_orders_user_created` ON `orders` (`user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_orders_bake_sale_id` ON `orders` (`bake_sale_id`);--> statement-breakpoint
CREATE INDEX `idx_orders_voucher_id` ON `orders` (`voucher_id`);--> statement-breakpoint
CREATE INDEX `idx_order_items_variant_id` ON `order_items` (`product_variant_id`);--> statement-breakpoint
CREATE INDEX `idx_testimonials_user_id` ON `testimonials` (`user_id`);