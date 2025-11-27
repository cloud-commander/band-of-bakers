CREATE TABLE `images` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`filename` text NOT NULL,
	`category` text,
	`tags` text,
	`size` integer,
	`uploaded_by` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `images_url_unique` ON `images` (`url`);