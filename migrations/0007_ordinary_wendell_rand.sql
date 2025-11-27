ALTER TABLE `products` ADD `stock_quantity` integer;--> statement-breakpoint
ALTER TABLE `products` ADD `available_from` text;--> statement-breakpoint
ALTER TABLE `testimonials` ADD `user_id` text REFERENCES users(id);