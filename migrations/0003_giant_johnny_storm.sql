CREATE INDEX `idx_images_category` ON `images` (`category`);--> statement-breakpoint
CREATE INDEX `idx_images_uploaded_by` ON `images` (`uploaded_by`);--> statement-breakpoint
CREATE INDEX `idx_news_posts_is_published` ON `news_posts` (`is_published`);--> statement-breakpoint
CREATE INDEX `idx_orders_user_id` ON `orders` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_orders_status` ON `orders` (`status`);--> statement-breakpoint
CREATE INDEX `idx_orders_created_at` ON `orders` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_products_category_id` ON `products` (`category_id`);--> statement-breakpoint
CREATE INDEX `idx_products_is_active` ON `products` (`is_active`);--> statement-breakpoint
CREATE INDEX `idx_users_role` ON `users` (`role`);