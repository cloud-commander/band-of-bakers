CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`user_id` text NOT NULL,
	`rating` integer NOT NULL,
	`title` text,
	`comment` text NOT NULL,
	`verified_purchase` integer DEFAULT false NOT NULL,
	`helpful_count` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_reviews_product_id` ON `reviews` (`product_id`);--> statement-breakpoint
CREATE INDEX `idx_reviews_user_id` ON `reviews` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_reviews_status` ON `reviews` (`status`);