CREATE TABLE `faqs` (
	`id` text PRIMARY KEY NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`category` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_faqs_is_active` ON `faqs` (`is_active`);--> statement-breakpoint
CREATE INDEX `idx_faqs_sort_order` ON `faqs` (`sort_order`);--> statement-breakpoint
ALTER TABLE `orders` ADD `order_number` integer;--> statement-breakpoint
ALTER TABLE `vouchers` ADD `notes` text;