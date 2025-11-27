CREATE TABLE `testimonials` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text,
	`content` text NOT NULL,
	`rating` integer DEFAULT 5 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_testimonials_is_active` ON `testimonials` (`is_active`);