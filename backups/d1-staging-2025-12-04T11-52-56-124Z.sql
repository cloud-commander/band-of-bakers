PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE d1_migrations(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT INTO "d1_migrations" VALUES(1,'0000_icy_madripoor.sql','2025-12-02 10:22:47');
INSERT INTO "d1_migrations" VALUES(2,'0001_curly_earthquake.sql','2025-12-02 10:22:47');
INSERT INTO "d1_migrations" VALUES(3,'0002_sloppy_diamondback.sql','2025-12-02 10:22:47');
INSERT INTO "d1_migrations" VALUES(4,'0003_giant_johnny_storm.sql','2025-12-02 10:22:47');
INSERT INTO "d1_migrations" VALUES(5,'0004_hot_shadowcat.sql','2025-12-02 10:22:47');
INSERT INTO "d1_migrations" VALUES(6,'0005_sparkling_gambit.sql','2025-12-02 10:22:48');
INSERT INTO "d1_migrations" VALUES(7,'0006_smart_midnight.sql','2025-12-02 10:22:48');
INSERT INTO "d1_migrations" VALUES(8,'0007_ordinary_wendell_rand.sql','2025-12-02 10:22:48');
INSERT INTO "d1_migrations" VALUES(9,'0008_add_category_images.sql','2025-12-02 10:22:48');
INSERT INTO "d1_migrations" VALUES(10,'0009_fantastic_betty_brant.sql','2025-12-02 10:22:48');
INSERT INTO "d1_migrations" VALUES(11,'0010_overconfident_callisto.sql','2025-12-02 10:22:49');
INSERT INTO "d1_migrations" VALUES(12,'0011_hot_doorman.sql','2025-12-02 10:22:49');
INSERT INTO "d1_migrations" VALUES(13,'0011_add_voucher_notes.sql','2025-12-02 10:22:49');
INSERT INTO "d1_migrations" VALUES(14,'0012_add_order_number.sql','2025-12-02 10:22:49');
INSERT INTO "d1_migrations" VALUES(15,'0012_tidy_screwball.sql','2025-12-02 10:22:49');
INSERT INTO "d1_migrations" VALUES(16,'0013_dazzling_ma_gnuci.sql','2025-12-02 10:22:49');
INSERT INTO "d1_migrations" VALUES(17,'0013_make_order_number_not_null.sql','2025-12-02 10:22:50');
INSERT INTO "d1_migrations" VALUES(18,'0014_add_index_bake_sales_date.sql','2025-12-02 10:22:50');
INSERT INTO "d1_migrations" VALUES(19,'0015_product_bake_sale_availability.sql','2025-12-02 10:22:50');
INSERT INTO "d1_migrations" VALUES(20,'0014_create_faqs_table.sql','2025-12-02 10:37:23');
CREATE TABLE `bake_sales` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`location_id` text NOT NULL,
	`cutoff_datetime` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO "bake_sales" VALUES('rbs-past-1','2024-06-02','loc-1','2024-06-01T11:00:00.000Z',0,'2024-05-01T00:00:00.000Z','2024-06-02T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-2','2024-06-09','loc-2','2024-06-08T11:00:00.000Z',0,'2024-05-01T00:00:00.000Z','2024-06-09T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-3','2024-06-16','loc-3','2024-06-15T11:00:00.000Z',0,'2024-05-01T00:00:00.000Z','2024-06-16T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-4','2024-06-23','loc-1','2024-06-22T11:00:00.000Z',0,'2024-05-01T00:00:00.000Z','2024-06-23T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-5','2024-06-30','loc-2','2024-06-29T11:00:00.000Z',0,'2024-05-01T00:00:00.000Z','2024-06-30T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-6','2024-07-07','loc-3','2024-07-06T11:00:00.000Z',0,'2024-06-01T00:00:00.000Z','2024-07-07T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-7','2024-07-14','loc-1','2024-07-13T11:00:00.000Z',0,'2024-06-01T00:00:00.000Z','2024-07-14T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-8','2024-07-21','loc-2','2024-07-20T11:00:00.000Z',0,'2024-06-01T00:00:00.000Z','2024-07-21T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-9','2024-07-28','loc-3','2024-07-27T11:00:00.000Z',0,'2024-06-01T00:00:00.000Z','2024-07-28T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-10','2024-08-04','loc-1','2024-08-03T11:00:00.000Z',0,'2024-07-01T00:00:00.000Z','2024-08-04T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-11','2024-08-11','loc-2','2024-08-10T11:00:00.000Z',0,'2024-07-01T00:00:00.000Z','2024-08-11T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-12','2024-08-18','loc-3','2024-08-17T11:00:00.000Z',0,'2024-07-01T00:00:00.000Z','2024-08-18T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-13','2024-08-25','loc-1','2024-08-24T11:00:00.000Z',0,'2024-07-01T00:00:00.000Z','2024-08-25T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-14','2024-09-01','loc-2','2024-08-31T11:00:00.000Z',0,'2024-08-01T00:00:00.000Z','2024-09-01T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-15','2024-09-08','loc-3','2024-09-07T11:00:00.000Z',0,'2024-08-01T00:00:00.000Z','2024-09-08T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-16','2024-09-15','loc-1','2024-09-14T11:00:00.000Z',0,'2024-08-01T00:00:00.000Z','2024-09-15T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-17','2024-09-22','loc-2','2024-09-21T11:00:00.000Z',0,'2024-08-01T00:00:00.000Z','2024-09-22T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-18','2024-09-29','loc-3','2024-09-28T11:00:00.000Z',0,'2024-08-01T00:00:00.000Z','2024-09-29T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-19','2024-10-06','loc-1','2024-10-05T11:00:00.000Z',0,'2024-09-01T00:00:00.000Z','2024-10-06T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-20','2024-10-13','loc-2','2024-10-12T11:00:00.000Z',0,'2024-09-01T00:00:00.000Z','2024-10-13T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-21','2024-10-20','loc-3','2024-10-19T11:00:00.000Z',0,'2024-09-01T00:00:00.000Z','2024-10-20T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-22','2024-10-27','loc-1','2024-10-26T11:00:00.000Z',0,'2024-09-01T00:00:00.000Z','2024-10-27T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-23','2024-11-03','loc-2','2024-11-02T12:00:00.000Z',0,'2024-10-01T00:00:00.000Z','2024-11-03T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-24','2024-11-10','loc-3','2024-11-09T12:00:00.000Z',0,'2024-10-01T00:00:00.000Z','2024-11-10T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-25','2024-11-17','loc-1','2024-11-16T12:00:00.000Z',0,'2024-10-01T00:00:00.000Z','2024-11-17T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-past-26','2024-11-24','loc-2','2024-11-23T12:00:00.000Z',0,'2024-10-01T00:00:00.000Z','2024-11-24T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-future-1','2025-12-13','loc-1','2025-12-12T12:00:00.000Z',1,'2025-11-01T00:00:00.000Z','2025-11-01T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-future-2','2025-12-21','loc-2','2025-12-20T12:00:00.000Z',1,'2025-11-01T00:00:00.000Z','2025-11-01T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-future-3','2026-01-10','loc-3','2026-01-09T12:00:00.000Z',1,'2025-11-01T00:00:00.000Z','2025-11-01T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-future-4','2026-02-07','loc-1','2026-02-06T12:00:00.000Z',1,'2025-11-01T00:00:00.000Z','2025-11-01T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-future-5','2026-03-07','loc-2','2026-03-06T12:00:00.000Z',1,'2025-11-01T00:00:00.000Z','2025-11-01T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-future-6','2026-04-04','loc-3','2026-04-03T11:00:00.000Z',1,'2025-11-01T00:00:00.000Z','2025-11-01T00:00:00.000Z');
INSERT INTO "bake_sales" VALUES('rbs-future-7','2026-05-02','loc-1','2026-05-01T11:00:00.000Z',1,'2025-11-01T00:00:00.000Z','2025-11-01T00:00:00.000Z');
CREATE TABLE `locations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`address_line1` text NOT NULL,
	`address_line2` text,
	`city` text NOT NULL,
	`postcode` text NOT NULL,
	`collection_hours` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT INTO "locations" VALUES('loc-1','Station Road, Cressage','Station Road',NULL,'Cressage','SY5 6EP','10:00-16:00',1,'2024-01-01T00:00:00.000Z','2024-01-01T00:00:00.000Z');
INSERT INTO "locations" VALUES('loc-2','Shrewsbury Town Hall','The Square',NULL,'Shrewsbury','SY1 1LH','09:00-17:00',1,'2024-01-15T00:00:00.000Z','2024-01-15T00:00:00.000Z');
INSERT INTO "locations" VALUES('loc-3','Telford Shopping Centre','Telford Town Centre','New Street','Telford','TF3 4BX','11:00-19:00',1,'2024-02-01T00:00:00.000Z','2024-02-01T00:00:00.000Z');
CREATE TABLE `news_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`content` text NOT NULL,
	`excerpt` text,
	`image_url` text,
	`author_id` text NOT NULL,
	`is_published` integer DEFAULT false NOT NULL,
	`published_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO "news_posts" VALUES('news-1','Introducing Our New Sourdough Varieties','introducing-new-sourdough-varieties','<p>We''re excited to announce three new sourdough varieties joining our lineup! After months of testing and perfecting our recipes, we''re proud to introduce Seeded Rye, Olive & Rosemary, and Sun-Dried Tomato & Basil sourdough loaves.</p><p>Each loaf is made with our signature 24-hour fermentation process and local ingredients...</p>','Three new artisan sourdough varieties are joining our regular lineup, including Seeded Rye, Olive & Rosemary, and Sun-Dried Tomato & Basil.',NULL,'user-owner',1,'2024-11-20T10:00:00.000Z','2024-11-15T00:00:00.000Z','2024-11-20T10:00:00.000Z');
INSERT INTO "news_posts" VALUES('news-2','Christmas Bake Sale Dates Announced','christmas-bake-sale-dates-announced','<p>The festive season is approaching, and we''re thrilled to announce our special Christmas bake sale schedule! We''ll be offering limited-edition seasonal treats including Stollen, Mince Pies, and Christmas Pudding.</p><p>Pre-orders open December 1st with collection dates on December 21st and 22nd...</p>','Mark your calendars! Our Christmas bake sale featuring Stollen, Mince Pies, and festive treats runs December 21-22. Pre-orders open December 1st.',NULL,'user-manager',1,'2024-11-15T10:00:00.000Z','2024-11-10T00:00:00.000Z','2024-11-15T10:00:00.000Z');
INSERT INTO "news_posts" VALUES('news-3','Behind the Scenes: A Day in Our Bakery','behind-the-scenes-bakery-day','<p>Ever wondered what goes into making your favourite artisan bread? Join us for a behind-the-scenes look at a typical baking day at Band of Bakers.</p><p>We start at 4 AM, shaping the dough that''s been fermenting overnight...</p>','Go behind the scenes and discover what it takes to create your favourite artisan bread. From 4 AM starts to the final bake.',NULL,'user-owner',1,'2024-11-10T10:00:00.000Z','2024-11-05T00:00:00.000Z','2024-11-10T10:00:00.000Z');
INSERT INTO "news_posts" VALUES('news-4','Supporting Local Flour Mills','supporting-local-flour-mills','<p>At Band of Bakers, we''re committed to using locally sourced ingredients. This month, we''re highlighting our partnership with Shipton Mill...</p>','Learn about our commitment to local sourcing and our partnership with Shipton Mill for premium British flour.',NULL,'user-manager',1,'2024-11-20T09:00:00.000Z','2024-11-20T00:00:00.000Z','2024-11-20T00:00:00.000Z');
INSERT INTO "news_posts" VALUES('news-5','Welcoming Our New Head Pastry Chef','welcoming-our-new-head-pastry-chef','<p>We are delighted to welcome Elena Rossi to the Band of Bakers family as our new Head Pastry Chef. Elena brings over 15 years of experience from bakeries in Paris and Rome.</p><p>Her signature croissants and danishes are already flying off the shelves. Come by this weekend to taste her creations!</p>','Meet Elena Rossi, our new Head Pastry Chef bringing 15 years of European baking experience to Shrewsbury.',NULL,'user-owner',1,'2024-10-15T09:00:00.000Z','2024-10-10T00:00:00.000Z','2024-10-15T00:00:00.000Z');
INSERT INTO "news_posts" VALUES('news-6','Community Sourdough Workshop','community-sourdough-workshop','<p>Due to popular demand, we''re hosting our first-ever Community Sourdough Workshop! Join us for a hands-on afternoon where you''ll learn the art of maintaining a starter, mixing, folding, and baking your own loaf.</p><p>Tickets are limited to 10 participants per session to ensure personal attention.</p>','Join us for a hands-on sourdough workshop. Learn to bake your own artisan bread from our expert bakers.',NULL,'user-manager',1,'2024-10-01T09:00:00.000Z','2024-09-25T00:00:00.000Z','2024-10-01T00:00:00.000Z');
INSERT INTO "news_posts" VALUES('news-7','Finalist in National Bakery Awards','finalist-in-national-bakery-awards','<p>We are incredibly honoured to be named a finalist in the ''Best Regional Bakery'' category at this year''s National Bakery Awards! This recognition means the world to our small team.</p><p>Thank you to all our wonderful customers for your continued support and for nominating us.</p>','Band of Bakers has been named a finalist for ''Best Regional Bakery'' in the National Bakery Awards!',NULL,'user-owner',1,'2024-09-10T09:00:00.000Z','2024-09-05T00:00:00.000Z','2024-09-10T00:00:00.000Z');
INSERT INTO "news_posts" VALUES('news-8','Summer Menu Launch Party','summer-menu-launch-party','<p>Summer is here, and so is our new menu! Think strawberry tarts, lemon drizzle cake, and focaccia with fresh garden herbs.</p><p>Join us this Saturday for our launch party with free tastings and live music from local artists.</p>','Celebrate the start of summer with our new seasonal menu launch party. Free tastings and live music!',NULL,'user-manager',1,'2024-06-01T09:00:00.000Z','2024-05-25T00:00:00.000Z','2024-06-01T00:00:00.000Z');
INSERT INTO "news_posts" VALUES('news-9','Charity Bake Sale Success','charity-bake-sale-success','<p>A huge thank you to everyone who came out to our charity bake sale last weekend. Together, we raised over £1,500 for the Shrewsbury Food Bank!</p><p>It was heartwarming to see the community come together for such a great cause.</p>','We raised over £1,500 for the Shrewsbury Food Bank! Thank you to everyone who supported our charity bake sale.',NULL,'user-owner',1,'2024-05-15T09:00:00.000Z','2024-05-10T00:00:00.000Z','2024-05-15T00:00:00.000Z');
INSERT INTO "news_posts" VALUES('news-10','Why We Use Organic Butter','why-we-use-organic-butter','<p>Butter is the soul of baking. That''s why we''ve made the switch to 100% organic butter from local dairy farms.</p><p>Not only does it taste richer and creamier, but it also supports sustainable farming practices. Taste the difference in our croissants!</p>','We''ve switched to 100% organic local butter. Discover why it makes our pastries taste even better.',NULL,'user-manager',1,'2024-04-20T09:00:00.000Z','2024-04-15T00:00:00.000Z','2024-04-20T00:00:00.000Z');
INSERT INTO "news_posts" VALUES('news-11','Partnering with Bean & Brew','partnering-with-bean-and-brew','<p>Great coffee deserves great pastries. We''re excited to announce our partnership with Bean & Brew Coffee House.</p><p>You can now find a selection of our fresh pastries and cakes at their High Street location every morning.</p>','Find our fresh pastries at Bean & Brew Coffee House! We''re partnering with local coffee experts to bring you the perfect breakfast.',NULL,'user-owner',1,'2024-03-10T09:00:00.000Z','2024-03-05T00:00:00.000Z','2024-03-10T00:00:00.000Z');
INSERT INTO "news_posts" VALUES('news-12','Expanding Our Shrewsbury Bakery','expanding-our-shrewsbury-bakery','<p>We''re growing! Thanks to your support, we''re expanding our bakery to include a small seating area.</p><p>Soon you''ll be able to enjoy your coffee and cake right here with us. Renovations start next month!</p>','Big news! We''re expanding our bakery to include a seating area. Soon you can enjoy your treats in-store.',NULL,'user-manager',1,'2024-02-15T09:00:00.000Z','2024-02-10T00:00:00.000Z','2024-02-15T00:00:00.000Z');
CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`product_id` text NOT NULL,
	`product_variant_id` text,
	`quantity` integer NOT NULL,
	`unit_price` real NOT NULL,
	`total_price` real NOT NULL,
	`is_available` integer DEFAULT true NOT NULL,
	`unavailable_reason` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO "order_items" VALUES('rorder-item-1','rorder-1','prod_savoury_croissants',NULL,1,3.5,3.5,1,NULL,'2024-05-30T00:00:00.000Z','2024-05-30T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-2','rorder-1','prod_whole_cake',NULL,1,20,20,1,NULL,'2024-05-30T00:00:00.000Z','2024-05-30T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-3','rorder-1','prod_foccacia',NULL,1,4,4,1,NULL,'2024-05-30T00:00:00.000Z','2024-05-30T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-4','rorder-2','prod_peach_pastry',NULL,2,1.5,3,1,NULL,'2024-05-27T00:00:00.000Z','2024-05-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-5','rorder-2','prod_dundee_cakes',NULL,2,20,40,1,NULL,'2024-05-27T00:00:00.000Z','2024-05-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-6','rorder-2','prod_millionaire_shortbread',NULL,2,2,4,1,NULL,'2024-05-27T00:00:00.000Z','2024-05-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-7','rorder-2','prod_cinnamon_knots',NULL,1,2.5,2.5,1,NULL,'2024-05-27T00:00:00.000Z','2024-05-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-8','rorder-2','prod_pistacio_pastry',NULL,2,1.5,3,1,NULL,'2024-05-27T00:00:00.000Z','2024-05-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-9','rorder-3','prod_apple_pies','var_apple_pie_xl',2,15,30,1,NULL,'2024-05-30T00:00:00.000Z','2024-05-30T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-10','rorder-3','prod_croissants',NULL,1,2,2,1,NULL,'2024-05-30T00:00:00.000Z','2024-05-30T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-11','rorder-3','prod_foccacia',NULL,2,4,8,1,NULL,'2024-05-30T00:00:00.000Z','2024-05-30T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-12','rorder-3','prod_tarte_au_citron',NULL,2,12,24,1,NULL,'2024-05-30T00:00:00.000Z','2024-05-30T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-13','rorder-3','prod_kimchi',NULL,1,7,7,1,NULL,'2024-05-30T00:00:00.000Z','2024-05-30T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-14','rorder-3','prod_apple_cinnamon_loaf',NULL,3,7,21,1,NULL,'2024-05-30T00:00:00.000Z','2024-05-30T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-15','rorder-4','prod_tiffin_slice',NULL,1,2.5,2.5,1,NULL,'2024-05-30T00:00:00.000Z','2024-05-30T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-16','rorder-4','prod_savoury_croissants',NULL,1,3.5,3.5,1,NULL,'2024-05-30T00:00:00.000Z','2024-05-30T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-17','rorder-5','prod_foccacia',NULL,2,4,8,1,NULL,'2024-06-07T00:00:00.000Z','2024-06-07T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-18','rorder-5','prod_peach_pastry',NULL,3,1.5,4.5,1,NULL,'2024-06-07T00:00:00.000Z','2024-06-07T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-19','rorder-5','prod_whole_cake',NULL,3,20,60,1,NULL,'2024-06-07T00:00:00.000Z','2024-06-07T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-20','rorder-5','prod_pistacio_pastry',NULL,2,1.5,3,1,NULL,'2024-06-07T00:00:00.000Z','2024-06-07T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-21','rorder-5','prod_curried_beef_pasties',NULL,1,3.5,3.5,1,NULL,'2024-06-07T00:00:00.000Z','2024-06-07T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-22','rorder-5','prod_apple_cinnamon_loaf',NULL,2,7,14,1,NULL,'2024-06-07T00:00:00.000Z','2024-06-07T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-23','rorder-6','prod_frangipane','var_frangipane_whole',2,20,40,1,NULL,'2024-06-06T00:00:00.000Z','2024-06-06T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-24','rorder-6','prod_flapjacks',NULL,2,2.5,5,1,NULL,'2024-06-06T00:00:00.000Z','2024-06-06T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-25','rorder-7','prod_apple_blackberry_pies',NULL,1,4.5,4.5,1,NULL,'2024-06-05T00:00:00.000Z','2024-06-05T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-26','rorder-7','prod_pistacio_pastry',NULL,2,1.5,3,1,NULL,'2024-06-05T00:00:00.000Z','2024-06-05T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-27','rorder-7','prod_cake_slice',NULL,1,2.5,2.5,1,NULL,'2024-06-05T00:00:00.000Z','2024-06-05T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-28','rorder-7','prod_flapjacks',NULL,1,2.5,2.5,1,NULL,'2024-06-05T00:00:00.000Z','2024-06-05T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-29','rorder-8','prod_tarte_au_citron',NULL,2,12,24,1,NULL,'2024-06-03T00:00:00.000Z','2024-06-03T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-30','rorder-8','prod_apple_cinnamon_loaf',NULL,1,7,7,1,NULL,'2024-06-03T00:00:00.000Z','2024-06-03T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-31','rorder-8','prod_cheese_pesto_swirls',NULL,1,2,2,1,NULL,'2024-06-03T00:00:00.000Z','2024-06-03T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-32','rorder-8','prod_dundee_cakes',NULL,3,20,60,1,NULL,'2024-06-03T00:00:00.000Z','2024-06-03T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-33','rorder-9','prod_apple_pies','var_apple_pie_small',1,4.5,4.5,1,NULL,'2024-06-13T00:00:00.000Z','2024-06-13T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-34','rorder-9','prod_foccacia',NULL,1,4,4,1,NULL,'2024-06-13T00:00:00.000Z','2024-06-13T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-35','rorder-10','prod_frangipane','var_frangipane_whole',3,20,60,1,NULL,'2024-06-11T00:00:00.000Z','2024-06-11T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-36','rorder-10','prod_savoury_croissants',NULL,2,3.5,7,1,NULL,'2024-06-11T00:00:00.000Z','2024-06-11T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-37','rorder-10','prod_malt_loaf',NULL,3,7,21,1,NULL,'2024-06-11T00:00:00.000Z','2024-06-11T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-38','rorder-10','prod_lemon_drizzle_cake',NULL,3,7,21,1,NULL,'2024-06-11T00:00:00.000Z','2024-06-11T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-39','rorder-11','prod_apple_cinnamon_loaf',NULL,3,7,21,1,NULL,'2024-06-11T00:00:00.000Z','2024-06-11T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-40','rorder-11','prod_croissants',NULL,3,2,6,1,NULL,'2024-06-11T00:00:00.000Z','2024-06-11T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-41','rorder-11','prod_cinnamon_knots',NULL,3,2.5,7.5,1,NULL,'2024-06-11T00:00:00.000Z','2024-06-11T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-42','rorder-12','prod_sourdough',NULL,2,4,8,1,NULL,'2024-06-18T00:00:00.000Z','2024-06-18T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-43','rorder-12','prod_lemon_meringue_pie',NULL,1,10,10,1,NULL,'2024-06-18T00:00:00.000Z','2024-06-18T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-44','rorder-12','prod_flapjacks',NULL,1,2.5,2.5,1,NULL,'2024-06-18T00:00:00.000Z','2024-06-18T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-45','rorder-12','prod_millionaire_shortbread',NULL,3,2,6,1,NULL,'2024-06-18T00:00:00.000Z','2024-06-18T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-46','rorder-12','prod_kimchi',NULL,3,7,21,1,NULL,'2024-06-18T00:00:00.000Z','2024-06-18T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-47','rorder-12','prod_cake_slice',NULL,2,2.5,5,1,NULL,'2024-06-18T00:00:00.000Z','2024-06-18T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-48','rorder-13','prod_apple_blackberry_pies',NULL,3,4.5,13.5,1,NULL,'2024-06-17T00:00:00.000Z','2024-06-17T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-49','rorder-13','prod_large_apple_pie',NULL,3,9,27,1,NULL,'2024-06-17T00:00:00.000Z','2024-06-17T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-50','rorder-13','prod_malt_loaf',NULL,2,7,14,1,NULL,'2024-06-17T00:00:00.000Z','2024-06-17T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-51','rorder-13','prod_lemon_drizzle_cake',NULL,1,7,7,1,NULL,'2024-06-17T00:00:00.000Z','2024-06-17T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-52','rorder-14','prod_flapjacks',NULL,1,2.5,2.5,1,NULL,'2024-06-20T00:00:00.000Z','2024-06-20T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-53','rorder-14','prod_sourdough',NULL,1,4,4,1,NULL,'2024-06-20T00:00:00.000Z','2024-06-20T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-54','rorder-15','prod_croissants',NULL,2,2,4,1,NULL,'2024-06-20T00:00:00.000Z','2024-06-20T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-55','rorder-15','prod_foccacia',NULL,1,4,4,1,NULL,'2024-06-20T00:00:00.000Z','2024-06-20T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-56','rorder-15','prod_savoury_croissants',NULL,3,3.5,10.5,1,NULL,'2024-06-20T00:00:00.000Z','2024-06-20T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-57','rorder-16','prod_sourdough',NULL,1,4,4,1,NULL,'2024-06-27T00:00:00.000Z','2024-06-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-58','rorder-16','prod_wholemeal_loaf',NULL,3,3.5,10.5,1,NULL,'2024-06-27T00:00:00.000Z','2024-06-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-59','rorder-16','prod_lemon_drizzle_cake',NULL,3,7,21,1,NULL,'2024-06-27T00:00:00.000Z','2024-06-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-60','rorder-16','prod_apple_blackberry_pies',NULL,2,4.5,9,1,NULL,'2024-06-27T00:00:00.000Z','2024-06-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-61','rorder-17','prod_lemon_meringue_pie',NULL,3,10,30,1,NULL,'2024-06-26T00:00:00.000Z','2024-06-26T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-62','rorder-17','prod_portuguese_custard_tarts',NULL,2,1,2,1,NULL,'2024-06-26T00:00:00.000Z','2024-06-26T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-63','rorder-17','prod_whole_cake',NULL,2,20,40,1,NULL,'2024-06-26T00:00:00.000Z','2024-06-26T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-64','rorder-18','prod_foccacia',NULL,2,4,8,1,NULL,'2024-06-25T00:00:00.000Z','2024-06-25T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-65','rorder-18','prod_malt_loaf',NULL,1,7,7,1,NULL,'2024-06-25T00:00:00.000Z','2024-06-25T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-66','rorder-18','prod_lemon_drizzle_cake',NULL,2,7,14,1,NULL,'2024-06-25T00:00:00.000Z','2024-06-25T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-67','rorder-19','prod_tarte_au_citron',NULL,1,12,12,1,NULL,'2024-06-24T00:00:00.000Z','2024-06-24T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-68','rorder-19','prod_cake_slice',NULL,3,2.5,7.5,1,NULL,'2024-06-24T00:00:00.000Z','2024-06-24T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-69','rorder-19','prod_millionaire_shortbread',NULL,2,2,4,1,NULL,'2024-06-24T00:00:00.000Z','2024-06-24T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-70','rorder-19','prod_lemon_meringue_pie',NULL,2,10,20,1,NULL,'2024-06-24T00:00:00.000Z','2024-06-24T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-71','rorder-19','prod_wholemeal_loaf',NULL,3,3.5,10.5,1,NULL,'2024-06-24T00:00:00.000Z','2024-06-24T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-72','rorder-19','prod_lemon_drizzle_cake',NULL,1,7,7,1,NULL,'2024-06-24T00:00:00.000Z','2024-06-24T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-73','rorder-20','prod_foccacia',NULL,2,4,8,1,NULL,'2024-06-28T00:00:00.000Z','2024-06-28T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-74','rorder-20','prod_dundee_cakes',NULL,3,20,60,1,NULL,'2024-06-28T00:00:00.000Z','2024-06-28T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-75','rorder-20','prod_pistacio_pastry',NULL,1,1.5,1.5,1,NULL,'2024-06-28T00:00:00.000Z','2024-06-28T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-76','rorder-20','prod_cinnamon_knots',NULL,2,2.5,5,1,NULL,'2024-06-28T00:00:00.000Z','2024-06-28T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-77','rorder-20','prod_lemon_drizzle_cake',NULL,2,7,14,1,NULL,'2024-06-28T00:00:00.000Z','2024-06-28T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-78','rorder-21','prod_apple_cinnamon_loaf',NULL,1,7,7,1,NULL,'2024-07-02T00:00:00.000Z','2024-07-02T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-79','rorder-21','prod_eccles_cakes',NULL,2,1.5,3,1,NULL,'2024-07-02T00:00:00.000Z','2024-07-02T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-80','rorder-21','prod_pistacio_pastry',NULL,2,1.5,3,1,NULL,'2024-07-02T00:00:00.000Z','2024-07-02T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-81','rorder-22','prod_frangipane','var_frangipane_whole',1,20,20,1,NULL,'2024-07-03T00:00:00.000Z','2024-07-03T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-82','rorder-22','prod_tiffin_slice',NULL,2,2.5,5,1,NULL,'2024-07-03T00:00:00.000Z','2024-07-03T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-83','rorder-22','prod_lemon_meringue_pie',NULL,1,10,10,1,NULL,'2024-07-03T00:00:00.000Z','2024-07-03T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-84','rorder-22','prod_millionaire_shortbread',NULL,2,2,4,1,NULL,'2024-07-03T00:00:00.000Z','2024-07-03T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-85','rorder-22','prod_croissants',NULL,3,2,6,1,NULL,'2024-07-03T00:00:00.000Z','2024-07-03T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-86','rorder-22','prod_apple_blackberry_pies',NULL,2,4.5,9,1,NULL,'2024-07-03T00:00:00.000Z','2024-07-03T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-87','rorder-23','prod_lemon_drizzle_cake',NULL,1,7,7,1,NULL,'2024-07-02T00:00:00.000Z','2024-07-02T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-88','rorder-23','prod_peach_pastry',NULL,2,1.5,3,1,NULL,'2024-07-02T00:00:00.000Z','2024-07-02T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-89','rorder-23','prod_foccacia',NULL,2,4,8,1,NULL,'2024-07-02T00:00:00.000Z','2024-07-02T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-90','rorder-23','prod_tarte_au_citron',NULL,3,12,36,1,NULL,'2024-07-02T00:00:00.000Z','2024-07-02T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-91','rorder-23','prod_lemon_meringue_pie',NULL,1,10,10,1,NULL,'2024-07-02T00:00:00.000Z','2024-07-02T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-92','rorder-24','prod_tarte_au_citron',NULL,2,12,24,1,NULL,'2024-07-05T00:00:00.000Z','2024-07-05T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-93','rorder-24','prod_sourdough',NULL,3,4,12,1,NULL,'2024-07-05T00:00:00.000Z','2024-07-05T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-94','rorder-24','prod_apple_pies','var_apple_pie_xl',2,15,30,1,NULL,'2024-07-05T00:00:00.000Z','2024-07-05T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-95','rorder-24','prod_cinnamon_knots',NULL,2,2.5,5,1,NULL,'2024-07-05T00:00:00.000Z','2024-07-05T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-96','rorder-25','prod_cinnamon_knots',NULL,2,2.5,5,1,NULL,'2024-07-01T00:00:00.000Z','2024-07-01T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-97','rorder-25','prod_eccles_cakes',NULL,2,1.5,3,1,NULL,'2024-07-01T00:00:00.000Z','2024-07-01T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-98','rorder-25','prod_croissants',NULL,1,2,2,1,NULL,'2024-07-01T00:00:00.000Z','2024-07-01T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-99','rorder-26','prod_tarte_au_citron',NULL,3,12,36,1,NULL,'2024-07-08T00:00:00.000Z','2024-07-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-100','rorder-26','prod_portuguese_custard_tarts',NULL,1,1,1,1,NULL,'2024-07-08T00:00:00.000Z','2024-07-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-101','rorder-26','prod_lemon_drizzle_cake',NULL,3,7,21,1,NULL,'2024-07-08T00:00:00.000Z','2024-07-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-102','rorder-26','prod_peach_pastry',NULL,2,1.5,3,1,NULL,'2024-07-08T00:00:00.000Z','2024-07-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-103','rorder-27','prod_tiffin_slice',NULL,3,2.5,7.5,1,NULL,'2024-07-08T00:00:00.000Z','2024-07-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-104','rorder-27','prod_malt_loaf',NULL,2,7,14,1,NULL,'2024-07-08T00:00:00.000Z','2024-07-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-105','rorder-27','prod_flapjacks',NULL,1,2.5,2.5,1,NULL,'2024-07-08T00:00:00.000Z','2024-07-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-106','rorder-27','prod_croissants',NULL,1,2,2,1,NULL,'2024-07-08T00:00:00.000Z','2024-07-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-107','rorder-28','prod_cinnamon_knots',NULL,2,2.5,5,1,NULL,'2024-07-12T00:00:00.000Z','2024-07-12T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-108','rorder-28','prod_cheese_pesto_swirls',NULL,3,2,6,1,NULL,'2024-07-12T00:00:00.000Z','2024-07-12T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-109','rorder-29','prod_malt_loaf',NULL,1,7,7,1,NULL,'2024-07-08T00:00:00.000Z','2024-07-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-110','rorder-29','prod_lemon_meringue_pie',NULL,2,10,20,1,NULL,'2024-07-08T00:00:00.000Z','2024-07-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-111','rorder-29','prod_dundee_cakes',NULL,1,20,20,1,NULL,'2024-07-08T00:00:00.000Z','2024-07-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-112','rorder-30','prod_foccacia',NULL,2,4,8,1,NULL,'2024-07-08T00:00:00.000Z','2024-07-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-113','rorder-30','prod_peach_pastry',NULL,3,1.5,4.5,1,NULL,'2024-07-08T00:00:00.000Z','2024-07-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-114','rorder-30','prod_tarte_au_citron',NULL,2,12,24,1,NULL,'2024-07-08T00:00:00.000Z','2024-07-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-115','rorder-30','prod_kimchi',NULL,3,7,21,1,NULL,'2024-07-08T00:00:00.000Z','2024-07-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-116','rorder-31','prod_lemon_meringue_pie',NULL,2,10,20,1,NULL,'2024-07-16T00:00:00.000Z','2024-07-16T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-117','rorder-31','prod_cinnamon_knots',NULL,3,2.5,7.5,1,NULL,'2024-07-16T00:00:00.000Z','2024-07-16T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-118','rorder-31','prod_apple_cinnamon_loaf',NULL,2,7,14,1,NULL,'2024-07-16T00:00:00.000Z','2024-07-16T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-119','rorder-31','prod_tiffin_slice',NULL,2,2.5,5,1,NULL,'2024-07-16T00:00:00.000Z','2024-07-16T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-120','rorder-31','prod_wholemeal_loaf',NULL,1,3.5,3.5,1,NULL,'2024-07-16T00:00:00.000Z','2024-07-16T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-121','rorder-32','prod_pistacio_pastry',NULL,1,1.5,1.5,1,NULL,'2024-07-17T00:00:00.000Z','2024-07-17T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-122','rorder-32','prod_tarte_au_citron',NULL,1,12,12,1,NULL,'2024-07-17T00:00:00.000Z','2024-07-17T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-123','rorder-32','prod_savoury_croissants',NULL,2,3.5,7,1,NULL,'2024-07-17T00:00:00.000Z','2024-07-17T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-124','rorder-32','prod_millionaire_shortbread',NULL,1,2,2,1,NULL,'2024-07-17T00:00:00.000Z','2024-07-17T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-125','rorder-32','prod_wholemeal_loaf',NULL,3,3.5,10.5,1,NULL,'2024-07-17T00:00:00.000Z','2024-07-17T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-126','rorder-32','prod_peach_pastry',NULL,3,1.5,4.5,1,NULL,'2024-07-17T00:00:00.000Z','2024-07-17T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-127','rorder-33','prod_apple_blackberry_pies',NULL,1,4.5,4.5,1,NULL,'2024-07-16T00:00:00.000Z','2024-07-16T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-128','rorder-33','prod_sourdough',NULL,2,4,8,1,NULL,'2024-07-16T00:00:00.000Z','2024-07-16T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-129','rorder-33','prod_curried_beef_pasties',NULL,1,3.5,3.5,1,NULL,'2024-07-16T00:00:00.000Z','2024-07-16T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-130','rorder-34','prod_large_apple_pie',NULL,1,9,9,1,NULL,'2024-07-15T00:00:00.000Z','2024-07-15T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-131','rorder-34','prod_dundee_cakes',NULL,1,20,20,1,NULL,'2024-07-15T00:00:00.000Z','2024-07-15T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-132','rorder-34','prod_tarte_au_citron',NULL,3,12,36,1,NULL,'2024-07-15T00:00:00.000Z','2024-07-15T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-133','rorder-34','prod_flapjacks',NULL,1,2.5,2.5,1,NULL,'2024-07-15T00:00:00.000Z','2024-07-15T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-134','rorder-35','prod_tiffin_slice',NULL,2,2.5,5,1,NULL,'2024-07-23T00:00:00.000Z','2024-07-23T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-135','rorder-35','prod_whole_cake',NULL,2,20,40,1,NULL,'2024-07-23T00:00:00.000Z','2024-07-23T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-136','rorder-35','prod_croissants',NULL,1,2,2,1,NULL,'2024-07-23T00:00:00.000Z','2024-07-23T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-137','rorder-36','prod_pistacio_pastry',NULL,1,1.5,1.5,1,NULL,'2024-07-24T00:00:00.000Z','2024-07-24T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-138','rorder-36','prod_eccles_cakes',NULL,2,1.5,3,1,NULL,'2024-07-24T00:00:00.000Z','2024-07-24T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-139','rorder-36','prod_millionaire_shortbread',NULL,2,2,4,1,NULL,'2024-07-24T00:00:00.000Z','2024-07-24T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-140','rorder-36','prod_cheese_pesto_swirls',NULL,2,2,4,1,NULL,'2024-07-24T00:00:00.000Z','2024-07-24T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-141','rorder-36','prod_dundee_cakes',NULL,3,20,60,1,NULL,'2024-07-24T00:00:00.000Z','2024-07-24T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-142','rorder-37','prod_cake_slice',NULL,3,2.5,7.5,1,NULL,'2024-07-30T00:00:00.000Z','2024-07-30T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-143','rorder-37','prod_savoury_croissants',NULL,1,3.5,3.5,1,NULL,'2024-07-30T00:00:00.000Z','2024-07-30T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-144','rorder-37','prod_large_apple_pie',NULL,2,9,18,1,NULL,'2024-07-30T00:00:00.000Z','2024-07-30T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-145','rorder-38','prod_apple_cinnamon_loaf',NULL,3,7,21,1,NULL,'2024-08-02T00:00:00.000Z','2024-08-02T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-146','rorder-38','prod_apple_blackberry_pies',NULL,2,4.5,9,1,NULL,'2024-08-02T00:00:00.000Z','2024-08-02T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-147','rorder-39','prod_sourdough',NULL,3,4,12,1,NULL,'2024-08-02T00:00:00.000Z','2024-08-02T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-148','rorder-39','prod_dundee_cakes',NULL,2,20,40,1,NULL,'2024-08-02T00:00:00.000Z','2024-08-02T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-149','rorder-40','prod_cheese_pesto_swirls',NULL,2,2,4,1,NULL,'2024-08-07T00:00:00.000Z','2024-08-07T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-150','rorder-40','prod_lemon_drizzle_cake',NULL,3,7,21,1,NULL,'2024-08-07T00:00:00.000Z','2024-08-07T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-151','rorder-40','prod_foccacia',NULL,2,4,8,1,NULL,'2024-08-07T00:00:00.000Z','2024-08-07T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-152','rorder-40','prod_apple_blackberry_pies',NULL,2,4.5,9,1,NULL,'2024-08-07T00:00:00.000Z','2024-08-07T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-153','rorder-40','prod_apple_cinnamon_loaf',NULL,3,7,21,1,NULL,'2024-08-07T00:00:00.000Z','2024-08-07T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-154','rorder-41','prod_apple_pies','var_apple_pie_small',2,4.5,9,1,NULL,'2024-08-08T00:00:00.000Z','2024-08-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-155','rorder-41','prod_malt_loaf',NULL,2,7,14,1,NULL,'2024-08-08T00:00:00.000Z','2024-08-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-156','rorder-42','prod_apple_blackberry_pies',NULL,1,4.5,4.5,1,NULL,'2024-08-07T00:00:00.000Z','2024-08-07T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-157','rorder-42','prod_eccles_cakes',NULL,2,1.5,3,1,NULL,'2024-08-07T00:00:00.000Z','2024-08-07T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-158','rorder-42','prod_malt_loaf',NULL,2,7,14,1,NULL,'2024-08-07T00:00:00.000Z','2024-08-07T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-159','rorder-43','prod_apple_blackberry_pies',NULL,1,4.5,4.5,1,NULL,'2024-08-06T00:00:00.000Z','2024-08-06T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-160','rorder-43','prod_tarte_au_citron',NULL,2,12,24,1,NULL,'2024-08-06T00:00:00.000Z','2024-08-06T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-161','rorder-43','prod_peach_pastry',NULL,1,1.5,1.5,1,NULL,'2024-08-06T00:00:00.000Z','2024-08-06T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-162','rorder-43','prod_flapjacks',NULL,3,2.5,7.5,1,NULL,'2024-08-06T00:00:00.000Z','2024-08-06T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-163','rorder-43','prod_savoury_croissants',NULL,1,3.5,3.5,1,NULL,'2024-08-06T00:00:00.000Z','2024-08-06T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-164','rorder-44','prod_apple_blackberry_pies',NULL,2,4.5,9,1,NULL,'2024-08-07T00:00:00.000Z','2024-08-07T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-165','rorder-44','prod_apple_cinnamon_loaf',NULL,2,7,14,1,NULL,'2024-08-07T00:00:00.000Z','2024-08-07T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-166','rorder-44','prod_frangipane','var_frangipane_whole',1,20,20,1,NULL,'2024-08-07T00:00:00.000Z','2024-08-07T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-167','rorder-44','prod_kimchi',NULL,2,7,14,1,NULL,'2024-08-07T00:00:00.000Z','2024-08-07T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-168','rorder-45','prod_kimchi',NULL,3,7,21,1,NULL,'2024-08-13T00:00:00.000Z','2024-08-13T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-169','rorder-45','prod_malt_loaf',NULL,3,7,21,1,NULL,'2024-08-13T00:00:00.000Z','2024-08-13T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-170','rorder-46','prod_cinnamon_knots',NULL,2,2.5,5,1,NULL,'2024-08-13T00:00:00.000Z','2024-08-13T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-171','rorder-46','prod_croissants',NULL,1,2,2,1,NULL,'2024-08-13T00:00:00.000Z','2024-08-13T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-172','rorder-46','prod_dundee_cakes',NULL,1,20,20,1,NULL,'2024-08-13T00:00:00.000Z','2024-08-13T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-173','rorder-46','prod_curried_beef_pasties',NULL,1,3.5,3.5,1,NULL,'2024-08-13T00:00:00.000Z','2024-08-13T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-174','rorder-46','prod_apple_cinnamon_loaf',NULL,2,7,14,1,NULL,'2024-08-13T00:00:00.000Z','2024-08-13T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-175','rorder-46','prod_foccacia',NULL,3,4,12,1,NULL,'2024-08-13T00:00:00.000Z','2024-08-13T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-176','rorder-47','prod_apple_cinnamon_loaf',NULL,3,7,21,1,NULL,'2024-08-14T00:00:00.000Z','2024-08-14T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-177','rorder-47','prod_frangipane','var_frangipane_whole',1,20,20,1,NULL,'2024-08-14T00:00:00.000Z','2024-08-14T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-178','rorder-48','prod_cheese_pesto_swirls',NULL,2,2,4,1,NULL,'2024-08-12T00:00:00.000Z','2024-08-12T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-179','rorder-48','prod_tarte_au_citron',NULL,2,12,24,1,NULL,'2024-08-12T00:00:00.000Z','2024-08-12T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-180','rorder-48','prod_lemon_meringue_pie',NULL,2,10,20,1,NULL,'2024-08-12T00:00:00.000Z','2024-08-12T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-181','rorder-48','prod_cinnamon_knots',NULL,3,2.5,7.5,1,NULL,'2024-08-12T00:00:00.000Z','2024-08-12T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-182','rorder-48','prod_cake_slice',NULL,2,2.5,5,1,NULL,'2024-08-12T00:00:00.000Z','2024-08-12T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-183','rorder-48','prod_sourdough',NULL,3,4,12,1,NULL,'2024-08-12T00:00:00.000Z','2024-08-12T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-184','rorder-49','prod_apple_pies','var_apple_pie_xl',1,15,15,1,NULL,'2024-08-23T00:00:00.000Z','2024-08-23T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-185','rorder-49','prod_flapjacks',NULL,2,2.5,5,1,NULL,'2024-08-23T00:00:00.000Z','2024-08-23T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-186','rorder-50','prod_large_apple_pie',NULL,1,9,9,1,NULL,'2024-08-19T00:00:00.000Z','2024-08-19T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-187','rorder-50','prod_foccacia',NULL,1,4,4,1,NULL,'2024-08-19T00:00:00.000Z','2024-08-19T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-188','rorder-50','prod_curried_beef_pasties',NULL,3,3.5,10.5,1,NULL,'2024-08-19T00:00:00.000Z','2024-08-19T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-189','rorder-50','prod_kimchi',NULL,3,7,21,1,NULL,'2024-08-19T00:00:00.000Z','2024-08-19T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-190','rorder-51','prod_portuguese_custard_tarts',NULL,2,1,2,1,NULL,'2024-08-26T00:00:00.000Z','2024-08-26T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-191','rorder-51','prod_croissants',NULL,2,2,4,1,NULL,'2024-08-26T00:00:00.000Z','2024-08-26T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-192','rorder-51','prod_apple_cinnamon_loaf',NULL,3,7,21,1,NULL,'2024-08-26T00:00:00.000Z','2024-08-26T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-193','rorder-52','prod_whole_cake',NULL,1,20,20,1,NULL,'2024-08-27T00:00:00.000Z','2024-08-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-194','rorder-52','prod_wholemeal_loaf',NULL,2,3.5,7,1,NULL,'2024-08-27T00:00:00.000Z','2024-08-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-195','rorder-52','prod_dundee_cakes',NULL,3,20,60,1,NULL,'2024-08-27T00:00:00.000Z','2024-08-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-196','rorder-52','prod_malt_loaf',NULL,2,7,14,1,NULL,'2024-08-27T00:00:00.000Z','2024-08-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-197','rorder-52','prod_sourdough',NULL,3,4,12,1,NULL,'2024-08-27T00:00:00.000Z','2024-08-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-198','rorder-52','prod_kimchi',NULL,1,7,7,1,NULL,'2024-08-27T00:00:00.000Z','2024-08-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-199','rorder-53','prod_foccacia',NULL,3,4,12,1,NULL,'2024-08-27T00:00:00.000Z','2024-08-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-200','rorder-53','prod_sourdough',NULL,1,4,4,1,NULL,'2024-08-27T00:00:00.000Z','2024-08-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-201','rorder-53','prod_cake_slice',NULL,2,2.5,5,1,NULL,'2024-08-27T00:00:00.000Z','2024-08-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-202','rorder-53','prod_large_apple_pie',NULL,1,9,9,1,NULL,'2024-08-27T00:00:00.000Z','2024-08-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-203','rorder-53','prod_savoury_croissants',NULL,3,3.5,10.5,1,NULL,'2024-08-27T00:00:00.000Z','2024-08-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-204','rorder-54','prod_apple_cinnamon_loaf',NULL,1,7,7,1,NULL,'2024-09-03T00:00:00.000Z','2024-09-03T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-205','rorder-54','prod_sourdough',NULL,3,4,12,1,NULL,'2024-09-03T00:00:00.000Z','2024-09-03T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-206','rorder-54','prod_foccacia',NULL,1,4,4,1,NULL,'2024-09-03T00:00:00.000Z','2024-09-03T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-207','rorder-54','prod_peach_pastry',NULL,2,1.5,3,1,NULL,'2024-09-03T00:00:00.000Z','2024-09-03T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-208','rorder-54','prod_frangipane','var_frangipane_slice',3,2.5,7.5,1,NULL,'2024-09-03T00:00:00.000Z','2024-09-03T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-209','rorder-55','prod_eccles_cakes',NULL,2,1.5,3,1,NULL,'2024-09-04T00:00:00.000Z','2024-09-04T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-210','rorder-55','prod_croissants',NULL,2,2,4,1,NULL,'2024-09-04T00:00:00.000Z','2024-09-04T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-211','rorder-55','prod_sourdough',NULL,2,4,8,1,NULL,'2024-09-04T00:00:00.000Z','2024-09-04T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-212','rorder-56','prod_savoury_croissants',NULL,3,3.5,10.5,1,NULL,'2024-09-12T00:00:00.000Z','2024-09-12T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-213','rorder-56','prod_whole_cake',NULL,3,20,60,1,NULL,'2024-09-12T00:00:00.000Z','2024-09-12T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-214','rorder-56','prod_kimchi',NULL,1,7,7,1,NULL,'2024-09-12T00:00:00.000Z','2024-09-12T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-215','rorder-56','prod_apple_cinnamon_loaf',NULL,2,7,14,1,NULL,'2024-09-12T00:00:00.000Z','2024-09-12T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-216','rorder-56','prod_peach_pastry',NULL,2,1.5,3,1,NULL,'2024-09-12T00:00:00.000Z','2024-09-12T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-217','rorder-56','prod_tarte_au_citron',NULL,2,12,24,1,NULL,'2024-09-12T00:00:00.000Z','2024-09-12T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-218','rorder-57','prod_lemon_drizzle_cake',NULL,2,7,14,1,NULL,'2024-09-10T00:00:00.000Z','2024-09-10T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-219','rorder-57','prod_savoury_croissants',NULL,2,3.5,7,1,NULL,'2024-09-10T00:00:00.000Z','2024-09-10T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-220','rorder-58','prod_curried_beef_pasties',NULL,1,3.5,3.5,1,NULL,'2024-09-13T00:00:00.000Z','2024-09-13T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-221','rorder-58','prod_peach_pastry',NULL,2,1.5,3,1,NULL,'2024-09-13T00:00:00.000Z','2024-09-13T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-222','rorder-58','prod_cheese_pesto_swirls',NULL,2,2,4,1,NULL,'2024-09-13T00:00:00.000Z','2024-09-13T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-223','rorder-58','prod_wholemeal_loaf',NULL,2,3.5,7,1,NULL,'2024-09-13T00:00:00.000Z','2024-09-13T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-224','rorder-58','prod_frangipane','var_frangipane_slice',3,2.5,7.5,1,NULL,'2024-09-13T00:00:00.000Z','2024-09-13T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-225','rorder-58','prod_malt_loaf',NULL,3,7,21,1,NULL,'2024-09-13T00:00:00.000Z','2024-09-13T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-226','rorder-59','prod_wholemeal_loaf',NULL,2,3.5,7,1,NULL,'2024-09-12T00:00:00.000Z','2024-09-12T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-227','rorder-59','prod_peach_pastry',NULL,3,1.5,4.5,1,NULL,'2024-09-12T00:00:00.000Z','2024-09-12T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-228','rorder-59','prod_malt_loaf',NULL,1,7,7,1,NULL,'2024-09-12T00:00:00.000Z','2024-09-12T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-229','rorder-59','prod_apple_blackberry_pies',NULL,2,4.5,9,1,NULL,'2024-09-12T00:00:00.000Z','2024-09-12T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-230','rorder-59','prod_dundee_cakes',NULL,3,20,60,1,NULL,'2024-09-12T00:00:00.000Z','2024-09-12T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-231','rorder-60','prod_dundee_cakes',NULL,3,20,60,1,NULL,'2024-09-17T00:00:00.000Z','2024-09-17T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-232','rorder-60','prod_millionaire_shortbread',NULL,3,2,6,1,NULL,'2024-09-17T00:00:00.000Z','2024-09-17T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-233','rorder-60','prod_portuguese_custard_tarts',NULL,2,1,2,1,NULL,'2024-09-17T00:00:00.000Z','2024-09-17T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-234','rorder-61','prod_foccacia',NULL,1,4,4,1,NULL,'2024-09-18T00:00:00.000Z','2024-09-18T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-235','rorder-61','prod_savoury_croissants',NULL,3,3.5,10.5,1,NULL,'2024-09-18T00:00:00.000Z','2024-09-18T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-236','rorder-61','prod_curried_beef_pasties',NULL,1,3.5,3.5,1,NULL,'2024-09-18T00:00:00.000Z','2024-09-18T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-237','rorder-61','prod_frangipane','var_frangipane_slice',3,2.5,7.5,1,NULL,'2024-09-18T00:00:00.000Z','2024-09-18T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-238','rorder-62','prod_foccacia',NULL,2,4,8,1,NULL,'2024-09-19T00:00:00.000Z','2024-09-19T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-239','rorder-62','prod_malt_loaf',NULL,3,7,21,1,NULL,'2024-09-19T00:00:00.000Z','2024-09-19T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-240','rorder-62','prod_peach_pastry',NULL,2,1.5,3,1,NULL,'2024-09-19T00:00:00.000Z','2024-09-19T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-241','rorder-62','prod_kimchi',NULL,3,7,21,1,NULL,'2024-09-19T00:00:00.000Z','2024-09-19T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-242','rorder-62','prod_tarte_au_citron',NULL,3,12,36,1,NULL,'2024-09-19T00:00:00.000Z','2024-09-19T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-243','rorder-62','prod_curried_beef_pasties',NULL,2,3.5,7,1,NULL,'2024-09-19T00:00:00.000Z','2024-09-19T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-244','rorder-63','prod_croissants',NULL,3,2,6,1,NULL,'2024-09-25T00:00:00.000Z','2024-09-25T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-245','rorder-63','prod_millionaire_shortbread',NULL,2,2,4,1,NULL,'2024-09-25T00:00:00.000Z','2024-09-25T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-246','rorder-64','prod_eccles_cakes',NULL,3,1.5,4.5,1,NULL,'2024-09-27T00:00:00.000Z','2024-09-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-247','rorder-64','prod_large_apple_pie',NULL,1,9,9,1,NULL,'2024-09-27T00:00:00.000Z','2024-09-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-248','rorder-64','prod_tarte_au_citron',NULL,3,12,36,1,NULL,'2024-09-27T00:00:00.000Z','2024-09-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-249','rorder-64','prod_kimchi',NULL,1,7,7,1,NULL,'2024-09-27T00:00:00.000Z','2024-09-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-250','rorder-64','prod_apple_pies','var_apple_pie_small',2,4.5,9,1,NULL,'2024-09-27T00:00:00.000Z','2024-09-27T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-251','rorder-65','prod_sourdough',NULL,3,4,12,1,NULL,'2024-09-25T00:00:00.000Z','2024-09-25T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-252','rorder-65','prod_wholemeal_loaf',NULL,1,3.5,3.5,1,NULL,'2024-09-25T00:00:00.000Z','2024-09-25T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-253','rorder-65','prod_malt_loaf',NULL,3,7,21,1,NULL,'2024-09-25T00:00:00.000Z','2024-09-25T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-254','rorder-65','prod_cake_slice',NULL,1,2.5,2.5,1,NULL,'2024-09-25T00:00:00.000Z','2024-09-25T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-255','rorder-65','prod_peach_pastry',NULL,1,1.5,1.5,1,NULL,'2024-09-25T00:00:00.000Z','2024-09-25T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-256','rorder-65','prod_tarte_au_citron',NULL,3,12,36,1,NULL,'2024-09-25T00:00:00.000Z','2024-09-25T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-257','rorder-66','prod_millionaire_shortbread',NULL,3,2,6,1,NULL,'2024-09-30T00:00:00.000Z','2024-09-30T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-258','rorder-66','prod_apple_cinnamon_loaf',NULL,3,7,21,1,NULL,'2024-09-30T00:00:00.000Z','2024-09-30T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-259','rorder-67','prod_frangipane','var_frangipane_whole',1,20,20,1,NULL,'2024-10-04T00:00:00.000Z','2024-10-04T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-260','rorder-67','prod_cinnamon_knots',NULL,2,2.5,5,1,NULL,'2024-10-04T00:00:00.000Z','2024-10-04T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-261','rorder-67','prod_large_apple_pie',NULL,1,9,9,1,NULL,'2024-10-04T00:00:00.000Z','2024-10-04T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-262','rorder-67','prod_kimchi',NULL,3,7,21,1,NULL,'2024-10-04T00:00:00.000Z','2024-10-04T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-263','rorder-68','prod_peach_pastry',NULL,3,1.5,4.5,1,NULL,'2024-10-02T00:00:00.000Z','2024-10-02T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-264','rorder-68','prod_eccles_cakes',NULL,3,1.5,4.5,1,NULL,'2024-10-02T00:00:00.000Z','2024-10-02T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-265','rorder-68','prod_sourdough',NULL,2,4,8,1,NULL,'2024-10-02T00:00:00.000Z','2024-10-02T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-266','rorder-69','prod_savoury_croissants',NULL,2,3.5,7,1,NULL,'2024-10-08T00:00:00.000Z','2024-10-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-267','rorder-69','prod_portuguese_custard_tarts',NULL,2,1,2,1,NULL,'2024-10-08T00:00:00.000Z','2024-10-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-268','rorder-69','prod_croissants',NULL,2,2,4,1,NULL,'2024-10-08T00:00:00.000Z','2024-10-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-269','rorder-69','prod_pistacio_pastry',NULL,1,1.5,1.5,1,NULL,'2024-10-08T00:00:00.000Z','2024-10-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-270','rorder-69','prod_apple_cinnamon_loaf',NULL,1,7,7,1,NULL,'2024-10-08T00:00:00.000Z','2024-10-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-271','rorder-69','prod_whole_cake',NULL,2,20,40,1,NULL,'2024-10-08T00:00:00.000Z','2024-10-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-272','rorder-70','prod_large_apple_pie',NULL,3,9,27,1,NULL,'2024-10-09T00:00:00.000Z','2024-10-09T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-273','rorder-70','prod_portuguese_custard_tarts',NULL,2,1,2,1,NULL,'2024-10-09T00:00:00.000Z','2024-10-09T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-274','rorder-70','prod_peach_pastry',NULL,2,1.5,3,1,NULL,'2024-10-09T00:00:00.000Z','2024-10-09T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-275','rorder-70','prod_savoury_croissants',NULL,1,3.5,3.5,1,NULL,'2024-10-09T00:00:00.000Z','2024-10-09T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-276','rorder-70','prod_pistacio_pastry',NULL,3,1.5,4.5,1,NULL,'2024-10-09T00:00:00.000Z','2024-10-09T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-277','rorder-71','prod_curried_beef_pasties',NULL,1,3.5,3.5,1,NULL,'2024-10-11T00:00:00.000Z','2024-10-11T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-278','rorder-71','prod_wholemeal_loaf',NULL,2,3.5,7,1,NULL,'2024-10-11T00:00:00.000Z','2024-10-11T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-279','rorder-72','prod_pistacio_pastry',NULL,3,1.5,4.5,1,NULL,'2024-10-14T00:00:00.000Z','2024-10-14T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-280','rorder-72','prod_eccles_cakes',NULL,3,1.5,4.5,1,NULL,'2024-10-14T00:00:00.000Z','2024-10-14T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-281','rorder-72','prod_cheese_pesto_swirls',NULL,1,2,2,1,NULL,'2024-10-14T00:00:00.000Z','2024-10-14T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-282','rorder-72','prod_foccacia',NULL,3,4,12,1,NULL,'2024-10-14T00:00:00.000Z','2024-10-14T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-283','rorder-72','prod_kimchi',NULL,3,7,21,1,NULL,'2024-10-14T00:00:00.000Z','2024-10-14T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-284','rorder-72','prod_apple_blackberry_pies',NULL,1,4.5,4.5,1,NULL,'2024-10-14T00:00:00.000Z','2024-10-14T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-285','rorder-73','prod_cinnamon_knots',NULL,3,2.5,7.5,1,NULL,'2024-10-16T00:00:00.000Z','2024-10-16T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-286','rorder-73','prod_tarte_au_citron',NULL,3,12,36,1,NULL,'2024-10-16T00:00:00.000Z','2024-10-16T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-287','rorder-73','prod_lemon_meringue_pie',NULL,1,10,10,1,NULL,'2024-10-16T00:00:00.000Z','2024-10-16T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-288','rorder-73','prod_wholemeal_loaf',NULL,2,3.5,7,1,NULL,'2024-10-16T00:00:00.000Z','2024-10-16T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-289','rorder-73','prod_portuguese_custard_tarts',NULL,2,1,2,1,NULL,'2024-10-16T00:00:00.000Z','2024-10-16T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-290','rorder-73','prod_sourdough',NULL,3,4,12,1,NULL,'2024-10-16T00:00:00.000Z','2024-10-16T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-291','rorder-74','prod_flapjacks',NULL,1,2.5,2.5,1,NULL,'2024-10-24T00:00:00.000Z','2024-10-24T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-292','rorder-74','prod_croissants',NULL,1,2,2,1,NULL,'2024-10-24T00:00:00.000Z','2024-10-24T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-293','rorder-74','prod_sourdough',NULL,2,4,8,1,NULL,'2024-10-24T00:00:00.000Z','2024-10-24T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-294','rorder-74','prod_peach_pastry',NULL,3,1.5,4.5,1,NULL,'2024-10-24T00:00:00.000Z','2024-10-24T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-295','rorder-74','prod_savoury_croissants',NULL,3,3.5,10.5,1,NULL,'2024-10-24T00:00:00.000Z','2024-10-24T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-296','rorder-74','prod_frangipane','var_frangipane_whole',1,20,20,1,NULL,'2024-10-24T00:00:00.000Z','2024-10-24T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-297','rorder-75','prod_frangipane','var_frangipane_whole',3,20,60,1,NULL,'2024-10-23T00:00:00.000Z','2024-10-23T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-298','rorder-75','prod_apple_cinnamon_loaf',NULL,1,7,7,1,NULL,'2024-10-23T00:00:00.000Z','2024-10-23T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-299','rorder-75','prod_cake_slice',NULL,3,2.5,7.5,1,NULL,'2024-10-23T00:00:00.000Z','2024-10-23T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-300','rorder-75','prod_eccles_cakes',NULL,2,1.5,3,1,NULL,'2024-10-23T00:00:00.000Z','2024-10-23T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-301','rorder-76','prod_malt_loaf',NULL,1,7,7,1,NULL,'2024-10-25T00:00:00.000Z','2024-10-25T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-302','rorder-76','prod_peach_pastry',NULL,1,1.5,1.5,1,NULL,'2024-10-25T00:00:00.000Z','2024-10-25T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-303','rorder-76','prod_cake_slice',NULL,3,2.5,7.5,1,NULL,'2024-10-25T00:00:00.000Z','2024-10-25T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-304','rorder-76','prod_cinnamon_knots',NULL,3,2.5,7.5,1,NULL,'2024-10-25T00:00:00.000Z','2024-10-25T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-305','rorder-76','prod_tarte_au_citron',NULL,2,12,24,1,NULL,'2024-10-25T00:00:00.000Z','2024-10-25T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-306','rorder-76','prod_savoury_croissants',NULL,2,3.5,7,1,NULL,'2024-10-25T00:00:00.000Z','2024-10-25T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-307','rorder-77','prod_peach_pastry',NULL,1,1.5,1.5,1,NULL,'2024-10-23T00:00:00.000Z','2024-10-23T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-308','rorder-77','prod_apple_pies','var_apple_pie_small',3,4.5,13.5,1,NULL,'2024-10-23T00:00:00.000Z','2024-10-23T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-309','rorder-77','prod_cake_slice',NULL,2,2.5,5,1,NULL,'2024-10-23T00:00:00.000Z','2024-10-23T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-310','rorder-77','prod_croissants',NULL,3,2,6,1,NULL,'2024-10-23T00:00:00.000Z','2024-10-23T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-311','rorder-77','prod_cheese_pesto_swirls',NULL,3,2,6,1,NULL,'2024-10-23T00:00:00.000Z','2024-10-23T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-312','rorder-78','prod_cinnamon_knots',NULL,2,2.5,5,1,NULL,'2024-10-21T00:00:00.000Z','2024-10-21T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-313','rorder-78','prod_apple_cinnamon_loaf',NULL,1,7,7,1,NULL,'2024-10-21T00:00:00.000Z','2024-10-21T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-314','rorder-79','prod_croissants',NULL,2,2,4,1,NULL,'2024-10-28T00:00:00.000Z','2024-10-28T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-315','rorder-79','prod_foccacia',NULL,2,4,8,1,NULL,'2024-10-28T00:00:00.000Z','2024-10-28T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-316','rorder-79','prod_lemon_drizzle_cake',NULL,3,7,21,1,NULL,'2024-10-28T00:00:00.000Z','2024-10-28T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-317','rorder-79','prod_curried_beef_pasties',NULL,2,3.5,7,1,NULL,'2024-10-28T00:00:00.000Z','2024-10-28T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-318','rorder-79','prod_apple_pies','var_apple_pie_xl',1,15,15,1,NULL,'2024-10-28T00:00:00.000Z','2024-10-28T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-319','rorder-80','prod_tarte_au_citron',NULL,3,12,36,1,NULL,'2024-10-29T00:00:00.000Z','2024-10-29T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-320','rorder-80','prod_pistacio_pastry',NULL,3,1.5,4.5,1,NULL,'2024-10-29T00:00:00.000Z','2024-10-29T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-321','rorder-81','prod_wholemeal_loaf',NULL,1,3.5,3.5,1,NULL,'2024-11-08T00:00:00.000Z','2024-11-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-322','rorder-81','prod_sourdough',NULL,2,4,8,1,NULL,'2024-11-08T00:00:00.000Z','2024-11-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-323','rorder-81','prod_foccacia',NULL,3,4,12,1,NULL,'2024-11-08T00:00:00.000Z','2024-11-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-324','rorder-81','prod_kimchi',NULL,3,7,21,1,NULL,'2024-11-08T00:00:00.000Z','2024-11-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-325','rorder-81','prod_cheese_pesto_swirls',NULL,2,2,4,1,NULL,'2024-11-08T00:00:00.000Z','2024-11-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-326','rorder-81','prod_frangipane','var_frangipane_whole',2,20,40,1,NULL,'2024-11-08T00:00:00.000Z','2024-11-08T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-327','rorder-82','prod_cheese_pesto_swirls',NULL,3,2,6,1,NULL,'2024-11-04T00:00:00.000Z','2024-11-04T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-328','rorder-82','prod_lemon_meringue_pie',NULL,3,10,30,1,NULL,'2024-11-04T00:00:00.000Z','2024-11-04T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-329','rorder-82','prod_sourdough',NULL,2,4,8,1,NULL,'2024-11-04T00:00:00.000Z','2024-11-04T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-330','rorder-82','prod_tarte_au_citron',NULL,1,12,12,1,NULL,'2024-11-04T00:00:00.000Z','2024-11-04T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-331','rorder-83','prod_wholemeal_loaf',NULL,1,3.5,3.5,1,NULL,'2024-11-05T00:00:00.000Z','2024-11-05T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-332','rorder-83','prod_flapjacks',NULL,2,2.5,5,1,NULL,'2024-11-05T00:00:00.000Z','2024-11-05T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-333','rorder-83','prod_apple_pies','var_apple_pie_xl',3,15,45,1,NULL,'2024-11-05T00:00:00.000Z','2024-11-05T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-334','rorder-83','prod_apple_cinnamon_loaf',NULL,3,7,21,1,NULL,'2024-11-05T00:00:00.000Z','2024-11-05T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-335','rorder-84','prod_sourdough',NULL,1,4,4,1,NULL,'2024-11-14T00:00:00.000Z','2024-11-14T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-336','rorder-84','prod_pistacio_pastry',NULL,2,1.5,3,1,NULL,'2024-11-14T00:00:00.000Z','2024-11-14T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-337','rorder-84','prod_apple_pies','var_apple_pie_small',1,4.5,4.5,1,NULL,'2024-11-14T00:00:00.000Z','2024-11-14T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-338','rorder-84','prod_tarte_au_citron',NULL,3,12,36,1,NULL,'2024-11-14T00:00:00.000Z','2024-11-14T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-339','rorder-85','prod_eccles_cakes',NULL,2,1.5,3,1,NULL,'2024-11-14T00:00:00.000Z','2024-11-14T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-340','rorder-85','prod_tiffin_slice',NULL,1,2.5,2.5,1,NULL,'2024-11-14T00:00:00.000Z','2024-11-14T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-341','rorder-85','prod_flapjacks',NULL,1,2.5,2.5,1,NULL,'2024-11-14T00:00:00.000Z','2024-11-14T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-342','rorder-85','prod_foccacia',NULL,1,4,4,1,NULL,'2024-11-14T00:00:00.000Z','2024-11-14T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-343','rorder-86','prod_tiffin_slice',NULL,3,2.5,7.5,1,NULL,'2024-11-20T00:00:00.000Z','2024-11-20T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-344','rorder-86','prod_croissants',NULL,3,2,6,1,NULL,'2024-11-20T00:00:00.000Z','2024-11-20T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-345','rorder-86','prod_portuguese_custard_tarts',NULL,1,1,1,1,NULL,'2024-11-20T00:00:00.000Z','2024-11-20T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-346','rorder-86','prod_eccles_cakes',NULL,1,1.5,1.5,1,NULL,'2024-11-20T00:00:00.000Z','2024-11-20T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-347','rorder-86','prod_frangipane','var_frangipane_slice',3,2.5,7.5,1,NULL,'2024-11-20T00:00:00.000Z','2024-11-20T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-348','rorder-86','prod_kimchi',NULL,2,7,14,1,NULL,'2024-11-20T00:00:00.000Z','2024-11-20T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-349','rorder-87','prod_portuguese_custard_tarts',NULL,2,1,2,1,NULL,'2024-11-20T00:00:00.000Z','2024-11-20T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-350','rorder-87','prod_cake_slice',NULL,1,2.5,2.5,1,NULL,'2024-11-20T00:00:00.000Z','2024-11-20T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-351','rorder-87','prod_peach_pastry',NULL,1,1.5,1.5,1,NULL,'2024-11-20T00:00:00.000Z','2024-11-20T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-352','rorder-87','prod_tarte_au_citron',NULL,2,12,24,1,NULL,'2024-11-20T00:00:00.000Z','2024-11-20T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-353','rorder-87','prod_eccles_cakes',NULL,3,1.5,4.5,1,NULL,'2024-11-20T00:00:00.000Z','2024-11-20T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-354','rorder-87','prod_lemon_meringue_pie',NULL,2,10,20,1,NULL,'2024-11-20T00:00:00.000Z','2024-11-20T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-355','rorder-88','prod_tarte_au_citron',NULL,3,12,36,1,NULL,'2024-11-18T00:00:00.000Z','2024-11-18T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-356','rorder-88','prod_cheese_pesto_swirls',NULL,2,2,4,1,NULL,'2024-11-18T00:00:00.000Z','2024-11-18T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-357','rorder-88','prod_apple_pies','var_apple_pie_small',3,4.5,13.5,1,NULL,'2024-11-18T00:00:00.000Z','2024-11-18T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-358','rorder-88','prod_pistacio_pastry',NULL,3,1.5,4.5,1,NULL,'2024-11-18T00:00:00.000Z','2024-11-18T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-359','rorder-88','prod_foccacia',NULL,2,4,8,1,NULL,'2024-11-18T00:00:00.000Z','2024-11-18T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-360','rorder-88','prod_tiffin_slice',NULL,3,2.5,7.5,1,NULL,'2024-11-18T00:00:00.000Z','2024-11-18T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-361','rorder-89','prod_pistacio_pastry',NULL,1,1.5,1.5,1,NULL,'2024-11-18T00:00:00.000Z','2024-11-18T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-362','rorder-89','prod_malt_loaf',NULL,2,7,14,1,NULL,'2024-11-18T00:00:00.000Z','2024-11-18T00:00:00.000Z');
INSERT INTO "order_items" VALUES('rorder-item-363','rorder-90','prod_cake_slice',NULL,2,2.5,5,1,NULL,'2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-364','rorder-90','prod_large_apple_pie',NULL,3,9,27,1,NULL,'2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-365','rorder-90','prod_apple_pies','var_apple_pie_xl',2,15,30,1,NULL,'2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-366','rorder-91','prod_foccacia',NULL,2,4,8,1,NULL,'2025-11-28T15:33:41.980Z','2025-11-28T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-367','rorder-91','prod_savoury_croissants',NULL,3,3.5,10.5,1,NULL,'2025-11-28T15:33:41.980Z','2025-11-28T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-368','rorder-91','prod_sourdough',NULL,3,4,12,1,NULL,'2025-11-28T15:33:41.980Z','2025-11-28T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-369','rorder-91','prod_apple_blackberry_pies',NULL,3,4.5,13.5,1,NULL,'2025-11-28T15:33:41.980Z','2025-11-28T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-370','rorder-91','prod_dundee_cakes',NULL,3,20,60,1,NULL,'2025-11-28T15:33:41.980Z','2025-11-28T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-371','rorder-91','prod_flapjacks',NULL,1,2.5,2.5,1,NULL,'2025-11-28T15:33:41.980Z','2025-11-28T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-372','rorder-92','prod_sourdough',NULL,2,4,8,1,NULL,'2025-11-26T15:33:41.980Z','2025-11-26T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-373','rorder-92','prod_lemon_meringue_pie',NULL,3,10,30,1,NULL,'2025-11-26T15:33:41.980Z','2025-11-26T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-374','rorder-92','prod_eccles_cakes',NULL,2,1.5,3,1,NULL,'2025-11-26T15:33:41.980Z','2025-11-26T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-375','rorder-93','prod_lemon_drizzle_cake',NULL,3,7,21,1,NULL,'2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-376','rorder-93','prod_foccacia',NULL,3,4,12,1,NULL,'2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-377','rorder-93','prod_cake_slice',NULL,2,2.5,5,1,NULL,'2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-378','rorder-93','prod_sourdough',NULL,3,4,12,1,NULL,'2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-379','rorder-93','prod_millionaire_shortbread',NULL,2,2,4,1,NULL,'2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-380','rorder-93','prod_apple_cinnamon_loaf',NULL,1,7,7,1,NULL,'2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-381','rorder-94','prod_lemon_meringue_pie',NULL,3,10,30,1,NULL,'2025-11-28T15:33:41.980Z','2025-11-28T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-382','rorder-94','prod_apple_cinnamon_loaf',NULL,3,7,21,1,NULL,'2025-11-28T15:33:41.980Z','2025-11-28T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-383','rorder-94','prod_cheese_pesto_swirls',NULL,3,2,6,1,NULL,'2025-11-28T15:33:41.980Z','2025-11-28T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-384','rorder-94','prod_frangipane','var_frangipane_whole',1,20,20,1,NULL,'2025-11-28T15:33:41.980Z','2025-11-28T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-385','rorder-94','prod_dundee_cakes',NULL,2,20,40,1,NULL,'2025-11-28T15:33:41.980Z','2025-11-28T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-386','rorder-95','prod_whole_cake',NULL,1,20,20,1,NULL,'2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-387','rorder-95','prod_cinnamon_knots',NULL,2,2.5,5,1,NULL,'2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-388','rorder-95','prod_peach_pastry',NULL,3,1.5,4.5,1,NULL,'2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-389','rorder-95','prod_millionaire_shortbread',NULL,2,2,4,1,NULL,'2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-390','rorder-96','prod_apple_blackberry_pies',NULL,3,4.5,13.5,1,NULL,'2025-12-02T15:33:41.980Z','2025-12-02T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-391','rorder-96','prod_millionaire_shortbread',NULL,1,2,2,1,NULL,'2025-12-02T15:33:41.980Z','2025-12-02T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-392','rorder-96','prod_sourdough',NULL,2,4,8,1,NULL,'2025-12-02T15:33:41.980Z','2025-12-02T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-393','rorder-96','prod_savoury_croissants',NULL,2,3.5,7,1,NULL,'2025-12-02T15:33:41.980Z','2025-12-02T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-394','rorder-97','prod_millionaire_shortbread',NULL,3,2,6,1,NULL,'2025-11-26T15:33:41.980Z','2025-11-26T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-395','rorder-97','prod_sourdough',NULL,2,4,8,1,NULL,'2025-11-26T15:33:41.980Z','2025-11-26T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-396','rorder-97','prod_savoury_croissants',NULL,3,3.5,10.5,1,NULL,'2025-11-26T15:33:41.980Z','2025-11-26T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-397','rorder-98','prod_malt_loaf',NULL,1,7,7,1,NULL,'2025-11-27T15:33:41.980Z','2025-11-27T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-398','rorder-98','prod_apple_blackberry_pies',NULL,1,4.5,4.5,1,NULL,'2025-11-27T15:33:41.980Z','2025-11-27T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-399','rorder-98','prod_millionaire_shortbread',NULL,2,2,4,1,NULL,'2025-11-27T15:33:41.980Z','2025-11-27T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-400','rorder-98','prod_frangipane','var_frangipane_slice',1,2.5,2.5,1,NULL,'2025-11-27T15:33:41.980Z','2025-11-27T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-401','rorder-98','prod_foccacia',NULL,3,4,12,1,NULL,'2025-11-27T15:33:41.980Z','2025-11-27T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-402','rorder-98','prod_portuguese_custard_tarts',NULL,1,1,1,1,NULL,'2025-11-27T15:33:41.980Z','2025-11-27T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-403','rorder-99','prod_tarte_au_citron',NULL,1,12,12,1,NULL,'2025-11-29T15:33:41.980Z','2025-11-29T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-404','rorder-99','prod_large_apple_pie',NULL,1,9,9,1,NULL,'2025-11-29T15:33:41.980Z','2025-11-29T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-405','rorder-100','prod_tarte_au_citron',NULL,1,12,12,1,NULL,'2025-11-29T15:33:41.980Z','2025-11-29T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-406','rorder-100','prod_frangipane','var_frangipane_whole',1,20,20,1,NULL,'2025-11-29T15:33:41.980Z','2025-11-29T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-407','rorder-100','prod_peach_pastry',NULL,2,1.5,3,1,NULL,'2025-11-29T15:33:41.980Z','2025-11-29T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-408','rorder-100','prod_lemon_meringue_pie',NULL,2,10,20,1,NULL,'2025-11-29T15:33:41.980Z','2025-11-29T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-409','rorder-101','prod_croissants',NULL,3,2,6,1,NULL,'2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-410','rorder-101','prod_apple_pies','var_apple_pie_small',3,4.5,13.5,1,NULL,'2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-411','rorder-101','prod_savoury_croissants',NULL,2,3.5,7,1,NULL,'2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-412','rorder-101','prod_cinnamon_knots',NULL,3,2.5,7.5,1,NULL,'2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-413','rorder-101','prod_lemon_drizzle_cake',NULL,3,7,21,1,NULL,'2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-414','rorder-101','prod_malt_loaf',NULL,2,7,14,1,NULL,'2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-415','rorder-102','prod_wholemeal_loaf',NULL,3,3.5,10.5,1,NULL,'2025-11-26T15:33:41.980Z','2025-11-26T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-416','rorder-102','prod_cinnamon_knots',NULL,1,2.5,2.5,1,NULL,'2025-11-26T15:33:41.980Z','2025-11-26T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-417','rorder-103','prod_eccles_cakes',NULL,3,1.5,4.5,1,NULL,'2025-11-27T15:33:41.980Z','2025-11-27T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-418','rorder-103','prod_peach_pastry',NULL,1,1.5,1.5,1,NULL,'2025-11-27T15:33:41.980Z','2025-11-27T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-419','rorder-103','prod_tarte_au_citron',NULL,3,12,36,1,NULL,'2025-11-27T15:33:41.980Z','2025-11-27T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-420','rorder-104','prod_croissants',NULL,3,2,6,1,NULL,'2025-11-30T15:33:41.980Z','2025-11-30T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-421','rorder-104','prod_tarte_au_citron',NULL,3,12,36,1,NULL,'2025-11-30T15:33:41.980Z','2025-11-30T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-422','rorder-104','prod_whole_cake',NULL,2,20,40,1,NULL,'2025-11-30T15:33:41.980Z','2025-11-30T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-423','rorder-104','prod_lemon_drizzle_cake',NULL,1,7,7,1,NULL,'2025-11-30T15:33:41.980Z','2025-11-30T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-424','rorder-104','prod_foccacia',NULL,3,4,12,1,NULL,'2025-11-30T15:33:41.980Z','2025-11-30T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-425','rorder-104','prod_kimchi',NULL,2,7,14,1,NULL,'2025-11-30T15:33:41.980Z','2025-11-30T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-426','rorder-105','prod_lemon_meringue_pie',NULL,3,10,30,1,NULL,'2025-11-29T15:33:41.980Z','2025-11-29T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-427','rorder-105','prod_malt_loaf',NULL,1,7,7,1,NULL,'2025-11-29T15:33:41.980Z','2025-11-29T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-428','rorder-105','prod_lemon_drizzle_cake',NULL,3,7,21,1,NULL,'2025-11-29T15:33:41.980Z','2025-11-29T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-429','rorder-105','prod_apple_blackberry_pies',NULL,2,4.5,9,1,NULL,'2025-11-29T15:33:41.980Z','2025-11-29T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-430','rorder-105','prod_wholemeal_loaf',NULL,3,3.5,10.5,1,NULL,'2025-11-29T15:33:41.980Z','2025-11-29T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-431','rorder-106','prod_lemon_meringue_pie',NULL,3,10,30,1,NULL,'2025-12-02T15:33:41.980Z','2025-12-02T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-432','rorder-106','prod_cinnamon_knots',NULL,2,2.5,5,1,NULL,'2025-12-02T15:33:41.980Z','2025-12-02T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-433','rorder-106','prod_whole_cake',NULL,2,20,40,1,NULL,'2025-12-02T15:33:41.980Z','2025-12-02T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-434','rorder-106','prod_eccles_cakes',NULL,2,1.5,3,1,NULL,'2025-12-02T15:33:41.980Z','2025-12-02T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-435','rorder-106','prod_portuguese_custard_tarts',NULL,3,1,3,1,NULL,'2025-12-02T15:33:41.980Z','2025-12-02T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-436','rorder-106','prod_tarte_au_citron',NULL,2,12,24,1,NULL,'2025-12-02T15:33:41.980Z','2025-12-02T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-437','rorder-107','prod_wholemeal_loaf',NULL,2,3.5,7,1,NULL,'2025-11-26T15:33:41.980Z','2025-11-26T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-438','rorder-107','prod_apple_pies','var_apple_pie_small',2,4.5,9,1,NULL,'2025-11-26T15:33:41.980Z','2025-11-26T15:33:41.980Z');
INSERT INTO "order_items" VALUES('rorder-item-439','rorder-107','prod_curried_beef_pasties',NULL,1,3.5,3.5,1,NULL,'2025-11-26T15:33:41.980Z','2025-11-26T15:33:41.980Z');
CREATE TABLE `product_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
, image_url TEXT);
INSERT INTO "product_categories" VALUES('cat_breads_loaves','Breads & Loaves','breads-loaves','Freshly baked artisan breads and loaves',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z','/images/categories/foccacia-detail.webp');
INSERT INTO "product_categories" VALUES('cat_pastries','Pastries','pastries','Buttery, flaky pastries and sweet treats',2,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z','/images/categories/cinnamon_knots-detail.webp');
INSERT INTO "product_categories" VALUES('cat_pies_tarts','Pies & Tarts','pies-tarts','Sweet and savory pies and tarts',3,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z','/images/categories/large_apple_pie-detail.webp');
INSERT INTO "product_categories" VALUES('cat_cakes_slices','Cakes & Slices','cakes-slices','Delicious cakes by the slice or whole',4,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z','/images/categories/frangipane_slice-detail.webp');
INSERT INTO "product_categories" VALUES('cat_savory','Savory Items','savory','Savory baked goods and specialties',5,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z','/images/categories/pesto_swirl-detail.webp');
INSERT INTO "product_categories" VALUES('cat_biscuits_bars','Biscuits & Bars','biscuits-bars','Flapjacks, biscuits, and sweet bars',6,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z','/images/categories/tiffin_cake_slice-detail.webp');
CREATE TABLE `product_variants` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`name` text NOT NULL,
	`price_adjustment` real DEFAULT 0 NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "product_variants" VALUES('var_apple_pie_small','prod_apple_pies','Small',0,1,1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z');
INSERT INTO "product_variants" VALUES('var_apple_pie_xl','prod_apple_pies','Extra Large',10.5,2,1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z');
INSERT INTO "product_variants" VALUES('var_frangipane_slice','prod_frangipane','Per Slice',0,1,1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z');
INSERT INTO "product_variants" VALUES('var_frangipane_whole','prod_frangipane','Whole',17.5,2,1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z');
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`base_price` real NOT NULL,
	`image_url` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL, `stock_quantity` integer, `available_from` text,
	FOREIGN KEY (`category_id`) REFERENCES `product_categories`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO "products" VALUES('prod_foccacia','cat_breads_loaves','Focaccia','foccacia','Italian flatbread with herbs and olive oil',4,'/images/products/breads-loaves/foccacia-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_sourdough','cat_breads_loaves','Sourdough','sourdough','Traditional sourdough bread with crispy crust',4,'/images/products/breads-loaves/sourdough-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_wholemeal_loaf','cat_breads_loaves','Wholemeal Loaf','wholemeal_loaf','Healthy wholemeal bread loaf',3.5,'/images/products/breads-loaves/wholemeal_loaf-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_malt_loaf','cat_breads_loaves','Malt Loaf','malt_loaf','Sweet malt loaf, perfect with butter',7,'/images/products/breads-loaves/malt_loaf-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_apple_cinnamon_loaf','cat_breads_loaves','Apple & Cinnamon Loaf','apple_cinnamon_loaf','Sweet loaf with apple and cinnamon',7,'/images/products/breads-loaves/apple_cinnamon_loaf-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_croissants','cat_pastries','Croissants','croissants','Buttery, flaky French croissants',2,'/images/products/pastries/croissants-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_savoury_croissants','cat_pastries','Savoury Croissants','savoury_croissants','Croissants filled with savory ingredients',3.5,'/images/products/pastries/savoury_croissants-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_peach_pastry','cat_pastries','Peach Pastries','peach_pastry','Sweet pastries with peach filling',1.5,'/images/products/pastries/peach_pastry-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_pistacio_pastry','cat_pastries','Pistachio Pastries','pistacio_pastry','Delicate pastries with pistachio cream',1.5,'/images/products/pastries/pistacio_pastry-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_portuguese_custard_tarts','cat_pastries','Portuguese Custard Tarts','portuguese_custard_tarts','Traditional Pastéis de Nata',1,'/images/products/pastries/portuguese_custard_tarts-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_cinnamon_knots','cat_pastries','Cinnamon Knots','cinnamon_knots','Sweet cinnamon pastry knots',2.5,'/images/products/pastries/cinnamon_knots-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_apple_pies','cat_pies_tarts','Apple Pies','small_apple_pies','Classic apple pies in various sizes',4.5,'/images/products/pies-tarts/small_apple_pies-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_apple_blackberry_pies','cat_pies_tarts','Small Apple & Blackberry Pies','small_appleblackberry_pies','Apple and blackberry pies',4.5,'/images/products/pies-tarts/small_appleblackberry_pies-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_large_apple_pie','cat_pies_tarts','Large Apple Pie','large_apple_pie','Large family-sized apple pie',9,'/images/products/pies-tarts/large_apple_pie-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_lemon_meringue_pie','cat_pies_tarts','Lemon Meringue Pie','lemon_meringue_pie','Tangy lemon filling with fluffy meringue',10,'/images/products/pies-tarts/lemon_meringue_pie-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_tarte_au_citron','cat_pies_tarts','Tarte au Citron','whole_tarte_au_citron','French lemon tart',12,'/images/products/pies-tarts/whole_tarte_au_citron-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_tiffin_slice','cat_cakes_slices','Tiffin Slice','tiffin_cake_slice','Rich chocolate tiffin slice',2.5,'/images/products/cakes-slices/tiffin_cake_slice-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_cake_slice','cat_cakes_slices','Cake Slice','cake_slice','Individual slice of delicious cake',2.5,'/images/products/cakes-slices/frangipane_slice-card.webp',0,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_lemon_drizzle_cake','cat_cakes_slices','Lemon Drizzle Cake','whole_lemon_drizzle_cake','Moist lemon cake with sweet drizzle',7,'/images/products/cakes-slices/whole_lemon_drizzle_cake-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_frangipane','cat_cakes_slices','Frangipane','frangipane_slice','Almond cream tart',2.5,'/images/products/cakes-slices/frangipane_slice-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_whole_cake','cat_cakes_slices','Whole Cake','whole_cake','Whole celebration cake',20,'/images/products/cakes-slices/whole_lemon_drizzle_cake-card.webp',0,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_dundee_cakes','cat_cakes_slices','Dundee Cakes','dundee_cakes','Traditional Scottish fruit cake',20,'/images/products/cakes-slices/dundee_cakes-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_curried_beef_pasties','cat_savory','Curried Beef Mince Pasties','curried_beef_mince_pasties','Spiced beef pasties',3.5,'/images/products/savory/curried_beef_mince_pasties-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_cheese_pesto_swirls','cat_savory','Cheese, Pesto & Basil Swirls','pesto_swirl','Savory swirls with cheese and pesto',2,'/images/products/savory/pesto_swirl-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_kimchi','cat_savory','Kimchi','kimchi','House-made fermented kimchi',7,'/images/products/savory/kimchi-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_eccles_cakes','cat_biscuits_bars','Eccles Cakes','eccles_cake','Traditional currant-filled pastries',1.5,'/images/products/biscuits-bars/eccles_cake-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_flapjacks','cat_biscuits_bars','Flapjacks','flapjack','Oaty, buttery flapjacks',2.5,'/images/products/biscuits-bars/flapjack-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
INSERT INTO "products" VALUES('prod_millionaire_shortbread','cat_biscuits_bars','Millionaire Shortbread','millionaire_shortbread','Shortbread with caramel and chocolate',2,'/images/products/biscuits-bars/millionaire_shortbread-card.webp',1,'2025-12-02T15:33:41.977Z','2025-12-02T15:33:41.977Z',NULL,NULL);
CREATE TABLE `settings` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text,
	`name` text NOT NULL,
	`phone` text,
	`role` text DEFAULT 'customer' NOT NULL,
	`avatar_url` text,
	`email_verified` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
, `is_banned` integer DEFAULT false NOT NULL, `newsletter_opt_in` integer DEFAULT false NOT NULL);
INSERT INTO "users" VALUES('user-owner','admin@bandofbakers.co.uk','KUleAj4+crZ36k9xuRYyuyY00uC+SyHntPqf5WqvCW0=:+qN1nYXkFNbfhVeECsnGOA==','Admin','+447431765839','owner',NULL,1,'2023-01-01T00:00:00.000Z','2025-12-02T16:38:42.213Z',0,0);
INSERT INTO "users" VALUES('user-manager','manager@bandofbakers.co.uk','1q+h5n6w3PQ3S+R2C5Z00SKELCJPZaX4FoQBnd/kurw=:yP1b3rmlmK5p2dHfGcHwgQ==','Hermione Granger','+447700900124','manager',NULL,1,'2023-02-01T00:00:00.000Z','2023-02-01T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-staff','staff@bandofbakers.co.uk','ua4sxZGwoR0jIQlLOkP6WWpv95e9Sl3s9fdqbRBKBpU=:JslyWPWQ3UiKwllLWKdgGQ==','Gimli Son of Glóin','+447700900125','staff',NULL,1,'2023-03-01T00:00:00.000Z','2023-03-01T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-1','harry.potter@hogwarts.edu','APCUOQoWhZp2jjmO//AXMZ0u5JUrIPTFUDmGP8POwco=:Mu28lPZVvNcqO+1xZlklUQ==','Harry Potter','+447700900001','customer',NULL,1,'2024-01-15T00:00:00.000Z','2024-01-15T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-2','frodo.baggins@shire.com','LqlsJIueMckQyE3qdIFyKg9lbobkbJYsuMa1sDEHxnM=:+4qWCxMzS4o8X6U2p9oUMA==','Frodo Baggins','+447700900002','customer',NULL,1,'2024-02-01T00:00:00.000Z','2024-02-01T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-3','leia.organa@rebellion.gov','0ruX+UATY/CCtV6QH9uT6O9j7jq0R5ZfDd/q3SWPTAs=:sZXtJrcvfEKki9snQQ/qpQ==','Leia Organa',NULL,'customer',NULL,1,'2024-03-01T00:00:00.000Z','2024-03-01T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-4','spiderman@dailybugle.com','ceDDbM/eRVdfdhkjBckAJzM0upPax7Ta+blaSDimP3w=:JNEtXvYNkR6VS9FDK2HQTQ==','Peter Parker',NULL,'customer',NULL,1,'2024-05-05T00:00:00.000Z','2024-05-05T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-5','wonder.woman@themyscira.gov','wLeI794PrDSLo9fD+HAtwbY6RuclTWYlwNfw9ZW2Aeg=:Z3AQMgH+6jKji9KeZLR8uA==','Diana Prince',NULL,'customer',NULL,1,'2024-06-06T00:00:00.000Z','2024-06-06T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-6','tony.stark@starkindustries.com','0hnN2GttAO6yFnXEiXEXQ1W2MnQT52a48skXShOpiU4=:0DJW7maE1wa+MfW9Aq7iEQ==','Tony Stark','+447700900006','customer',NULL,1,'2024-07-07T00:00:00.000Z','2024-07-07T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-7','captain.america@avengers.org','CVNMvisF6Dfsd2gM+a996pTTWLsHUJLGbQzkTGWVuBs=:V+GLwuqReH6B1DhQrV4R1Q==','Steve Rogers',NULL,'customer',NULL,1,'2024-08-28T00:00:00.000Z','2024-08-28T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-8','aragorn@king.gondor','1KBX5txBujHFEE0i6pqGfboCjw33QMjq0hcRPZWcKPI=:DG9V0zFLBl/1CHb/mf1YNQ==','Aragorn Elessar',NULL,'customer',NULL,1,'2024-09-29T00:00:00.000Z','2024-09-29T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-9','bruce.wayne@wayneenterprises.com','mOyNOvpjCFXqDxrQ+mw/NotxJxzGspc3G2bfqwwyk3Y=:tpfbHAjDsG+v/EZvfn+wnA==','Bruce Wayne','+447700900009','customer',NULL,1,'2024-10-30T00:00:00.000Z','2024-10-30T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-10','luke.skywalker@jediorder.org','+DlPEztoUTQ5flBSwMOyl2YPkJZ2nRAHkLA2+D3S95A=:7OWIvhdn88CZZ0kdTstYew==','Luke Skywalker',NULL,'customer',NULL,1,'2024-11-30T00:00:00.000Z','2024-11-30T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-11','elizabeth.swan@caribbean.gov','JAYNKjiIPdvtb2ZneY7qJ3D9DpDBx82sMKTm9zueOgI=:1NzTkHBT5MuglxIKrNajDw==','Elizabeth Swann',NULL,'customer',NULL,1,'2024-01-12T00:00:00.000Z','2024-01-12T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-12','will.turner@blackpearl.org','XnHvPIDbqh5VsE+lwmv+Us8WAQv07Pqk1RgAOewiIhM=:9vpRJRLPRweueAzv/1nksw==','Will Turner','+447700900012','customer',NULL,1,'2024-01-13T00:00:00.000Z','2024-01-13T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-13','jon.snow@wall.north','GP5ZpjaghzLAfiUfzpdJMjS7KbD1HjuIKZ/xfU+GBDI=:aZ0Lo42bTBZuA+4pBrrk7Q==','Jon Snow',NULL,'customer',NULL,1,'2024-02-14T00:00:00.000Z','2024-02-14T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-14','daenerys.targaryen@meereen.gov','E/1SW8JzuxlFRDSxmNXd/SfrJGJma8rPu1pdpGjqLC0=:PW1G11iQtmtqQjlMqVZqbw==','Daenerys Targaryen',NULL,'customer',NULL,1,'2024-03-15T00:00:00.000Z','2024-03-15T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-15','sherlock.holmes@221b.bakerst','xopvrIjDlXVHqj65GtzHHQa4SkatX7pOYyPb92FkpSE=:GcHBTtqUPRNjigq4RAEfpA==','Sherlock Holmes','+447700900015','customer',NULL,1,'2024-04-16T00:00:00.000Z','2024-04-16T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-16','jane.eyre@thornfield.hall','pYyvE0vv/hFkgi5/zhwKxofaKlYsPQftYZxzgtIZ+2g=:E9NGR5XD70lDtBYJIdsL1A==','Jane Eyre',NULL,'customer',NULL,1,'2024-05-17T00:00:00.000Z','2024-05-17T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-17','gatsby@west.egg','z/cQOb4cI7oKTtXPHhOmKh6u2FRbcoXGIojcFS1BH70=:CN3AyunaENwbibVQyOt6EA==','Jay Gatsby',NULL,'customer',NULL,1,'2024-06-18T00:00:00.000Z','2024-06-18T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-18',' Atticus Finch@maycomb.justice','ahcaFHqNq03EpXJZaPiq7NVp7M3GeUtTruzJ1JY9BXw=:MqOmrgLceYnrUkqVg1tPgA==','Atticus Finch','+447700900018','customer',NULL,1,'2024-07-19T00:00:00.000Z','2024-07-19T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-19','scarlett.o''hara@tara.plantation','BrUsbak0Y2AdW3ZiYgwu8dFGTDiNqupoAT8LVF6/cDw=:zIBw/O6xbJBkHlS92hPkyA==','Scarlett O''Hara',NULL,'customer',NULL,1,'2024-08-20T00:00:00.000Z','2024-08-20T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-20','huckleberry.finn@mississippi.com','dMzon9UPqorMwJyYbtY1OrYEq+InWxzI48X9bY2aovg=:w/sVzekCLcdtAPRWa4w1Ow==','Huckleberry Finn',NULL,'customer',NULL,1,'2024-09-21T00:00:00.000Z','2024-09-21T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-21','arthur.dent@earth.gov','5oMhIi8OmhjL6oZB3e0nOV3fdpUkeZlFRp0lk9fAqCU=:lPhwWd6qAs075pxflXaMHQ==','Arthur Dent','+447700900021','customer',NULL,1,'2024-10-22T00:00:00.000Z','2024-10-22T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-22','rick.sanchez@citadel.rick','WTAhbQHHKlg9GOVtmwslJvHTSctEnlkcO7BxyVbhrNc=:l8yQQHYF6n0E4CzdIIY5ow==','Rick Sanchez',NULL,'customer',NULL,1,'2024-11-23T00:00:00.000Z','2024-11-23T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-23','mario@nintendo.com','ll0BBU2EpT27v61LdwwJ5pG/Qs0o+fm8cYmnWYXyoTg=:XIECpyCcQMiCKMB3LHPGlA==','Mario Mario',NULL,'customer',NULL,1,'2024-01-24T00:00:00.000Z','2024-01-24T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-24','princess.peach@kingdom.mushroom','lpyJSQsMwuHSlZuLYhMACURYanth+U6kvl4HhoRvtoQ=:nNmxpFHqsHC8MJJKjThU8Q==','Princess Peach','+447700900024','customer',NULL,1,'2024-01-25T00:00:00.000Z','2024-01-25T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-25','link@hyrule.kingdom','Vawe18vIkZMfIsvAQ9JDE3S1FeuQDe+hhtjwRE0IQ/I=:pdPLolFrsJo5Gf/0XdvtTQ==','Link',NULL,'customer',NULL,1,'2024-02-26T00:00:00.000Z','2024-02-26T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-26','zelda@hyrule.gov','Lv59BYy8nldWhnX5Njoneh3cTILbv8yrwTLgjNx5apM=:YjA5RKrqcxoh/pUqYInVBA==','Princess Zelda',NULL,'customer',NULL,1,'2024-03-27T00:00:00.000Z','2024-03-27T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-27','samus.aran@galactic.federation','FhtPJOT8AVOTJH2HuEkkCW7dyH5TtQWoftJfz+0pDKk=:sOmVng5qXFKdSU9IWixGTw==','Samus Aran','+447700900027','customer',NULL,1,'2024-04-28T00:00:00.000Z','2024-04-28T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-28','master.chief@unsc.space','QwZUkhWulprc4BCOUOejy2mBT7ffkgh/2jCVkWJmWo8=:XvtZWVMg71KJaUJjU+TQJg==','Master Chief',NULL,'customer',NULL,1,'2024-05-01T00:00:00.000Z','2024-05-01T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-29','kratos@sparta.gov','3KclY7T1eJUN9BuL9jXnpeAURIJMreU2To0/IDpYgFE=:cEkVeWmjoB46mU58C9O/gQ==','Kratos',NULL,'customer',NULL,1,'2024-06-02T00:00:00.000Z','2024-06-02T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-30','ellie@wyoming.survivor','rylnjWV0ju777Zsy3xhdvQu1euYwZY1JUaoFk6o1BUQ=:jzLUOEVOBslH0JidRs87/Q==','Ellie Williams','+447700900030','customer',NULL,1,'2024-07-03T00:00:00.000Z','2024-07-03T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-31','geralt@white.wolf','yD0sZpm5FgbGemHmzJO3JuqvV/DAA8y03H0agM57P9Y=:GPeX0Bb0d59iNqHx9dd0hw==','Geralt of Rivia',NULL,'customer',NULL,1,'2024-08-04T00:00:00.000Z','2024-08-04T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-32','cloud.strife@midgar.gov','V8NN9B3hXWfHScKGiqxaew7h1epSGA7xobVIf4S8q1Q=:sLTs7lLps6HPUOjyX1ooMA==','Cloud Strife',NULL,'customer',NULL,1,'2024-09-05T00:00:00.000Z','2024-09-05T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-33','tifa.lockhart@nibelheim.com','pGD/qkow3vCzSNnWIKq+SpjKhr5vO1b7nZf0KQesdZM=:aGzauFdH9TP4gIgRdNyFgw==','Tifa Lockhart','+447700900033','customer',NULL,1,'2024-10-06T00:00:00.000Z','2024-10-06T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-34','sephiroth@black.apes','yRb9CxtyrrK5avWTXgYcWDseleEyI8hiyj2xxNvBKts=:7FP/Ii4USjA+V/WTEKfn9w==','Sephiroth',NULL,'customer',NULL,1,'2024-11-07T00:00:00.000Z','2024-11-07T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-35','mulan@chinese.army','kpCNLYEDoyW8+8yD7ae1U86beMX5uA4whlM/Isq1Lp0=:wCF1gE3Y63MnDZpsaj63Bg==','Mulan',NULL,'customer',NULL,1,'2024-01-08T00:00:00.000Z','2024-01-08T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-36','belle@enchanted.castle','voSj+SPZ1R65MUtLZxiy6QdlXfxf81rnnxLSFKes1W0=:M+/km/IHZdWOYsHJidRFrA==','Belle','+447700900036','customer',NULL,1,'2024-01-09T00:00:00.000Z','2024-01-09T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-37','ariel@under.the.sea','sCqpYY9fURVyECzzgKKT1BVnfb+dfZcVVwpoQuMCCN8=:ZEeGESpM1R//3gBtaS1j8Q==','Ariel',NULL,'customer',NULL,1,'2024-02-10T00:00:00.000Z','2024-02-10T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-38','elsa@arendelle.gov','dsQ5TAVQkvvcmz9V+2y4mClSJTG6KK/tuJNzwX0KG0M=:R3IMHsWrUwspbc21GRhzNQ==','Elsa',NULL,'customer',NULL,1,'2024-03-11T00:00:00.000Z','2024-03-11T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-39','anna@arendelle.gov','Og1wcTteFKZ8RYAiB92xR/jaeCHDv1xyYj0I5MYrD0k=:ayR3TEAShH83wWVr7DjHLA==','Anna','+447700900039','customer',NULL,1,'2024-04-12T00:00:00.000Z','2024-04-12T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-40','pocahontas@jamestown.gov','aufIEvB1O6HcQdrgsekqjDrem7irl/jwi5AYuB+5G0s=:RscEm38Hk9S4LaR8JPnICg==','Pocahontas',NULL,'customer',NULL,1,'2024-05-13T00:00:00.000Z','2024-05-13T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-41','moana@motunui.island','YKA9irnHjdGXlrPPjcwkjSrHBkYLZrxK4xX3+RiLaz0=:t4ov1+FkCaZtVh867nAAjw==','Moana',NULL,'customer',NULL,1,'2024-06-14T00:00:00.000Z','2024-06-14T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-42','rapunzel@corona.kingdom','X66yBtWlAi/uNnyP9uxAcN59+rTn4cgGDdGzAFk7f9U=:75yMSeOhLAbKFSFxidPlRw==','Rapunzel','+447700900042','customer',NULL,1,'2024-07-15T00:00:00.000Z','2024-07-15T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-43','jessie@pixar.toystory','18pV/qFkez4GR3LOquLGfk0VwvsF6FRbI9Q4UPkGi7g=:vlq8BfOKmOvcb4/uljDc4w==','Jessie',NULL,'customer',NULL,1,'2024-08-16T00:00:00.000Z','2024-08-16T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-44','buzz.lightyear@pixar.space','L4gVzwM42YW9hhzQ8T9WzpvO0Cs5oR+cyqOiIkSGknA=:EE8gooxhazt7FYCdqHnQDA==','Buzz Lightyear',NULL,'customer',NULL,1,'2024-09-17T00:00:00.000Z','2024-09-17T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-45','woody@pixar.toystory','YQhtnE/1XnvvhBvT9hxflrrMIWZvhjETvIPuV+QCtrw=:ccotY4+zKe/igAnD1PKMdA==','Woody','+447700900045','customer',NULL,1,'2024-10-18T00:00:00.000Z','2024-10-18T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-46','dory@finding.nemo','SvyRoUq6odi9M6tUhA1gdkbw0hl7ObEiE/UPLSnFDsU=:7OEwZwYdIWUp7TwWfymlCA==','Dory',NULL,'customer',NULL,1,'2024-11-19T00:00:00.000Z','2024-11-19T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-47','nemo@finding.nemo','jg8lq5tNcT3ncga6CEYbJFPY/Ur5vB/Mz1IWQt+dRCo=:Uait9/FInZcZ5uIdU+2p2g==','Nemo',NULL,'customer',NULL,1,'2024-01-20T00:00:00.000Z','2024-01-20T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-48','mike.wazowski@monsters.inc','En9LtUsd9QlWI4RIOXTmKZlQ+/QLavboS38tYdZ+bKs=:ErW2O2UbZU5Vhfc2uYyoyQ==','Mike Wazowski','+447700900048','customer',NULL,1,'2024-02-21T00:00:00.000Z','2024-02-21T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-49','james.sullivan@monsters.inc','tAlpB5r6+zZRl486y7555biOJdnkxi6kC14agH2YCkM=:/zqvKUGr2IJ3dRaGTQDD3A==','James P. Sullivan',NULL,'customer',NULL,1,'2024-03-22T00:00:00.000Z','2024-03-22T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-50','randle.mcpherson@shining.horror','lIifayja8dPMAfKTvOgMs/C5C8uzit5gjpec96pmMHw=:ww9BR11md5HgZR32uHzdhw==','Jack Torrance',NULL,'customer',NULL,1,'2024-04-23T00:00:00.000Z','2024-04-23T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-51','hannibal.lecter@chilton.clinic','8jwGNPdYn5UCRs6aC2kFyk9F3K7mrrumzDTR2ilzgJo=:BW8iP5FkrEgK0CGRPJQdvQ==','Hannibal Lecter','+447700900051','customer',NULL,1,'2024-05-24T00:00:00.000Z','2024-05-24T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-52','tyrion.lannister@casterly.rock','M5GunulDbzyDkJa5scNrKC8G/MdlF+SHnfkKBdiVU80=:/iNxPfUb+Uh4LwaTI0j6+Q==','Tyrion Lannister',NULL,'customer',NULL,1,'2024-06-25T00:00:00.000Z','2024-06-25T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-53','walter.white@heisenberg.chemistry','0Z0pWKNzwUW/UruzMGSwo9YwmaDblHp4OgXrdwC9koU=:Q7GY1bwXHwSXNFxtUibZfw==','Walter White',NULL,'customer',NULL,1,'2024-07-26T00:00:00.000Z','2024-07-26T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-54','jesse.pinkman@badger.dealer','hUy3hx9LBU+Wp8j7anyHhwRQ5lEF3NwciBn9JSsZtF8=:fIEnd2uhu2vc5OoNe7xXyA==','Jesse Pinkman','+447700900054','customer',NULL,1,'2024-08-27T00:00:00.000Z','2024-08-27T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-55','gregor.samsa@metamorphosis','Skmnh3HW7smJF+jd2CXB2x8yLFiY4yAGzLk/W2gHYAo=:s2IdP616Y2BnVF0ooisB+A==','Gregor Samsa',NULL,'customer',NULL,1,'2024-09-28T00:00:00.000Z','2024-09-28T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-56','holden.caulfield@phoenix.society','Lu/Ssyk506VafP5z0//CcjBvYahvxOJ4bxDFJNqVBxc=:61jni9Xy850fapDnbJKzYw==','Holden Caulfield',NULL,'customer',NULL,1,'2024-10-29T00:00:00.000Z','2024-10-29T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-57','winston.smith@oceania.gov','VbjLeqza8AeJm+Mj1CSY4yRIoTh7B+V8jwhnYD+YF+s=:KLJtR/pAFs0f1a6Gx+D0yw==','Winston Smith','+447700900057','customer',NULL,1,'2024-11-30T00:00:00.000Z','2024-11-30T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-58','montag@fireman.fahrenheit','A1KPfCjS5R4JP8/9RFda2oFvDKG6VHshtPnbKjYcNY4=:Ar1ui98aLomJNd2YLer3Yg==','Guy Montag',NULL,'customer',NULL,1,'2024-01-31T00:00:00.000Z','2024-01-31T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-59','mildred@fireman.fahrenheit','TlSdr8sWId0pv9Vn+M+I7cOCLiTGSm9ltrxiiAbmg3A=:lPiWaMkmHgIK+X6XSM3HUw==','Mildred Montag',NULL,'customer',NULL,1,'2024-02-28T00:00:00.000Z','2024-02-28T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-60','phoenix.nick@carraway.west','2eJd5WWEhwrLZ/T08tPci+duhgriHg2LAdsrdnjsXfw=:TL1S+beN5dR4nF+AeLMvRg==','Nick Carraway','+447700900060','customer',NULL,1,'2024-03-31T00:00:00.000Z','2024-03-31T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-61','tom.buchanan@east.egg','0BabkqM0Wlsdd0+LkPWEPbf8A0UtdezL/7uJEcly1QA=:Ck2KxU0qWu3UvYxvvxfSKQ==','Tom Buchanan',NULL,'customer',NULL,1,'2024-04-30T00:00:00.000Z','2024-04-30T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-62','daisy.buchanan@east.egg','DVSN1H6cfubC875rEW1ZVkXF3VCifUKDOotORREGTvQ=:yANVzGbDNUe6QznmqggDMA==','Daisy Buchanan',NULL,'customer',NULL,1,'2024-05-31T00:00:00.000Z','2024-05-31T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-63','thomas.anderson@matrix.reality','E/1Faj2lchG8fTfNF3ptd8tXa/Gj49kMnONG8oy+2KI=:PsR3mTeOOitZJYHN6elvFg==','Neo','+447700900063','customer',NULL,1,'2024-06-11T00:00:00.000Z','2024-06-11T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-64','trinity@zion.resistance','WhOmU27/AgUnLGK5Fxg5xp/4PArarerFz8Vrj1Xih0g=:TNW3soXXtzTFtJyR8QkBNw==','Trinity',NULL,'customer',NULL,1,'2024-07-11T00:00:00.000Z','2024-07-11T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-65','agent.smith@matrix.system','ioOF91d0J+Sq1y4vQ8gPbFbhHtpzG04pq83sNT1VNRA=:d2CRGLrwFK8SNMEcuHcDHw==','Agent Smith',NULL,'customer',NULL,1,'2024-08-18T00:00:00.000Z','2024-08-18T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-66','ellen.ripley@weyland.space','ZTCtr+8ztylOVNcNvjIZbGsiJnaHmt0qCwbCqMGwXjk=:oQ07oeAxiSti8N8//Bh9Zg==','Ellen Ripley','+447700900066','customer',NULL,1,'2024-09-12T00:00:00.000Z','2024-09-12T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-67','sarah.connor@resistance.future','ga2/CMS0dO7DnQ5SmK/UEUQJHHBFZ0BFZL3kpOjTBB0=:t8fOtivKvsUHIi4wZ+KizA==','Sarah Connor',NULL,'customer',NULL,1,'2024-10-12T00:00:00.000Z','2024-10-12T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-68','kyle.reese@resistance.past','t6VECHu9RopTrb8YOKSKBEH0WjJPhwCkD7rS3ROX2nI=:qfBqeWPdmgVSmTO0Tsyo9A==','Kyle Reese',NULL,'customer',NULL,1,'2024-11-12T00:00:00.000Z','2024-11-12T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-69','john.mcclane@nakatomi.victim','6DW5qnZ6hDoK1pCBhOD5gBur4497RYOMW0taeF12BUw=:HjJCgsrJrGV5LX8/OQwwqg==','John McClane','+447700900069','customer',NULL,1,'2024-01-31T00:00:00.000Z','2024-01-31T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-70','marty.mcfly@hill.valley','/ZfcH9GEvTL59ycf7hpsWLeQ5/FlXx7RaVcZRVXVreo=:bmi4ySWXKhwvKsikxr566Q==','Marty McFly',NULL,'customer',NULL,1,'2024-02-28T00:00:00.000Z','2024-02-28T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-71','doc.brown@hill.valley','ZQ9VhlarSkIyvqGWbSYfnZ0DOFIWpeDGOSxxS1UC9RU=:aSubHxNTeG7aoU+p97NVBA==','Emmett Brown',NULL,'customer',NULL,1,'2024-03-31T00:00:00.000Z','2024-03-31T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-72','e.t@elliot.Phone','Q15eDaIxfg1Y+W/UniFZX8R/rSCd8lMg754ypwT8FoM=:7Zjs34cSW5vabgaSv6rbSA==','E.T.','+447700900072','customer',NULL,1,'2024-04-30T00:00:00.000Z','2024-04-30T00:00:00.000Z',0,0);
INSERT INTO "users" VALUES('user-cust-73','indiana.jones@archaeology.edu','V9FAddEdKeqkuJ+RNUB1541dogJeGqN9PF7Icr0GtZk=:WK7cFK/T879mvaGZ2hz/hw==','Indiana Jones',NULL,'customer',NULL,1,'2024-05-31T00:00:00.000Z','2024-05-31T00:00:00.000Z',0,0);
CREATE TABLE `vouchers` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`type` text NOT NULL,
	`value` real NOT NULL,
	`min_order_value` real DEFAULT 0 NOT NULL,
	`max_uses` integer,
	`current_uses` integer DEFAULT 0 NOT NULL,
	`max_uses_per_customer` integer DEFAULT 1 NOT NULL,
	`valid_from` text NOT NULL,
	`valid_until` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
, `notes` text);
INSERT INTO "vouchers" VALUES('vouch-1','WELCOME10','percentage',10,20,100,15,1,'2024-01-01T00:00:00.000Z','2026-12-02T15:33:41.975Z',1,'2024-01-01T00:00:00.000Z','2024-01-01T00:00:00.000Z',NULL);
INSERT INTO "vouchers" VALUES('vouch-2','CHRISTMAS5','fixed_amount',5,30,NULL,42,1,'2024-12-01T00:00:00.000Z','2024-12-31T23:59:59.000Z',1,'2024-11-01T00:00:00.000Z','2024-11-01T00:00:00.000Z',NULL);
INSERT INTO "vouchers" VALUES('vouch-3','BLACKFRIDAY','percentage',20,50,50,48,1,'2024-11-29T00:00:00.000Z','2024-11-30T23:59:59.000Z',1,'2024-11-15T00:00:00.000Z','2024-11-15T00:00:00.000Z',NULL);
INSERT INTO "vouchers" VALUES('vouch-4','FREEDELIVERY','fixed_amount',5,40,20,5,1,'2024-11-01T00:00:00.000Z','2024-12-31T23:59:59.000Z',1,'2024-11-01T00:00:00.000Z','2024-11-01T00:00:00.000Z',NULL);
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
INSERT INTO "images" VALUES('img_foccacia-card','/images/products/breads-loaves/foccacia-card.webp','foccacia-card.webp','breads-loaves','["product","cat_breads_loaves","foccacia","card"]',86022,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_foccacia-detail','/images/products/breads-loaves/foccacia-detail.webp','foccacia-detail.webp','breads-loaves','["product","cat_breads_loaves","foccacia","detail"]',264048,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_foccacia-thumbnail','/images/products/breads-loaves/foccacia-thumbnail.webp','foccacia-thumbnail.webp','breads-loaves','["product","cat_breads_loaves","foccacia","thumbnail"]',18572,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_sourdough-card','/images/products/breads-loaves/sourdough-card.webp','sourdough-card.webp','breads-loaves','["product","cat_breads_loaves","sourdough","card"]',44416,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_sourdough-detail','/images/products/breads-loaves/sourdough-detail.webp','sourdough-detail.webp','breads-loaves','["product","cat_breads_loaves","sourdough","detail"]',159170,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_sourdough-thumbnail','/images/products/breads-loaves/sourdough-thumbnail.webp','sourdough-thumbnail.webp','breads-loaves','["product","cat_breads_loaves","sourdough","thumbnail"]',9548,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_wholemeal_loaf-card','/images/products/breads-loaves/wholemeal_loaf-card.webp','wholemeal_loaf-card.webp','breads-loaves','["product","cat_breads_loaves","wholemeal_loaf","card"]',64374,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_wholemeal_loaf-detail','/images/products/breads-loaves/wholemeal_loaf-detail.webp','wholemeal_loaf-detail.webp','breads-loaves','["product","cat_breads_loaves","wholemeal_loaf","detail"]',212942,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_wholemeal_loaf-thumbnail','/images/products/breads-loaves/wholemeal_loaf-thumbnail.webp','wholemeal_loaf-thumbnail.webp','breads-loaves','["product","cat_breads_loaves","wholemeal_loaf","thumbnail"]',13922,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_malt_loaf-card','/images/products/breads-loaves/malt_loaf-card.webp','malt_loaf-card.webp','breads-loaves','["product","cat_breads_loaves","malt_loaf","card"]',84320,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_malt_loaf-detail','/images/products/breads-loaves/malt_loaf-detail.webp','malt_loaf-detail.webp','breads-loaves','["product","cat_breads_loaves","malt_loaf","detail"]',267354,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_malt_loaf-thumbnail','/images/products/breads-loaves/malt_loaf-thumbnail.webp','malt_loaf-thumbnail.webp','breads-loaves','["product","cat_breads_loaves","malt_loaf","thumbnail"]',19140,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_apple_cinnamon_loaf-card','/images/products/breads-loaves/apple_cinnamon_loaf-card.webp','apple_cinnamon_loaf-card.webp','breads-loaves','["product","cat_breads_loaves","apple_cinnamon_loaf","card"]',89826,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_apple_cinnamon_loaf-detail','/images/products/breads-loaves/apple_cinnamon_loaf-detail.webp','apple_cinnamon_loaf-detail.webp','breads-loaves','["product","cat_breads_loaves","apple_cinnamon_loaf","detail"]',273884,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_apple_cinnamon_loaf-thumbnail','/images/products/breads-loaves/apple_cinnamon_loaf-thumbnail.webp','apple_cinnamon_loaf-thumbnail.webp','breads-loaves','["product","cat_breads_loaves","apple_cinnamon_loaf","thumbnail"]',21598,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_croissants-card','/images/products/pastries/croissants-card.webp','croissants-card.webp','pastries','["product","cat_pastries","croissants","card"]',51222,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_croissants-detail','/images/products/pastries/croissants-detail.webp','croissants-detail.webp','pastries','["product","cat_pastries","croissants","detail"]',173368,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_croissants-thumbnail','/images/products/pastries/croissants-thumbnail.webp','croissants-thumbnail.webp','pastries','["product","cat_pastries","croissants","thumbnail"]',10526,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_savoury_croissants-card','/images/products/pastries/savoury_croissants-card.webp','savoury_croissants-card.webp','pastries','["product","cat_pastries","savoury_croissants","card"]',40608,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_savoury_croissants-detail','/images/products/pastries/savoury_croissants-detail.webp','savoury_croissants-detail.webp','pastries','["product","cat_pastries","savoury_croissants","detail"]',136736,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_savoury_croissants-thumbnail','/images/products/pastries/savoury_croissants-thumbnail.webp','savoury_croissants-thumbnail.webp','pastries','["product","cat_pastries","savoury_croissants","thumbnail"]',9748,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_peach_pastry-card','/images/products/pastries/peach_pastry-card.webp','peach_pastry-card.webp','pastries','["product","cat_pastries","peach_pastry","card"]',50300,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_peach_pastry-detail','/images/products/pastries/peach_pastry-detail.webp','peach_pastry-detail.webp','pastries','["product","cat_pastries","peach_pastry","detail"]',142118,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_peach_pastry-thumbnail','/images/products/pastries/peach_pastry-thumbnail.webp','peach_pastry-thumbnail.webp','pastries','["product","cat_pastries","peach_pastry","thumbnail"]',12986,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_pistacio_pastry-card','/images/products/pastries/pistacio_pastry-card.webp','pistacio_pastry-card.webp','pastries','["product","cat_pastries","pistacio_pastry","card"]',37828,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_pistacio_pastry-detail','/images/products/pastries/pistacio_pastry-detail.webp','pistacio_pastry-detail.webp','pastries','["product","cat_pastries","pistacio_pastry","detail"]',115192,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_pistacio_pastry-thumbnail','/images/products/pastries/pistacio_pastry-thumbnail.webp','pistacio_pastry-thumbnail.webp','pastries','["product","cat_pastries","pistacio_pastry","thumbnail"]',9260,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_portuguese_custard_tarts-card','/images/products/pastries/portuguese_custard_tarts-card.webp','portuguese_custard_tarts-card.webp','pastries','["product","cat_pastries","portuguese_custard_tarts","card"]',77864,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_portuguese_custard_tarts-detail','/images/products/pastries/portuguese_custard_tarts-detail.webp','portuguese_custard_tarts-detail.webp','pastries','["product","cat_pastries","portuguese_custard_tarts","detail"]',245352,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_portuguese_custard_tarts-thumbnail','/images/products/pastries/portuguese_custard_tarts-thumbnail.webp','portuguese_custard_tarts-thumbnail.webp','pastries','["product","cat_pastries","portuguese_custard_tarts","thumbnail"]',17946,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_cinnamon_knots-card','/images/products/pastries/cinnamon_knots-card.webp','cinnamon_knots-card.webp','pastries','["product","cat_pastries","cinnamon_knots","card"]',71902,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_cinnamon_knots-detail','/images/products/pastries/cinnamon_knots-detail.webp','cinnamon_knots-detail.webp','pastries','["product","cat_pastries","cinnamon_knots","detail"]',230178,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_cinnamon_knots-thumbnail','/images/products/pastries/cinnamon_knots-thumbnail.webp','cinnamon_knots-thumbnail.webp','pastries','["product","cat_pastries","cinnamon_knots","thumbnail"]',17948,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_small_apple_pies-card','/images/products/pies-tarts/small_apple_pies-card.webp','small_apple_pies-card.webp','pies-tarts','["product","cat_pies_tarts","small_apple_pies","card"]',82802,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_small_apple_pies-detail','/images/products/pies-tarts/small_apple_pies-detail.webp','small_apple_pies-detail.webp','pies-tarts','["product","cat_pies_tarts","small_apple_pies","detail"]',241834,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_small_apple_pies-thumbnail','/images/products/pies-tarts/small_apple_pies-thumbnail.webp','small_apple_pies-thumbnail.webp','pies-tarts','["product","cat_pies_tarts","small_apple_pies","thumbnail"]',19314,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_small_appleblackberry_pies-card','/images/products/pies-tarts/small_appleblackberry_pies-card.webp','small_appleblackberry_pies-card.webp','pies-tarts','["product","cat_pies_tarts","small_appleblackberry_pies","card"]',84092,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_small_appleblackberry_pies-detail','/images/products/pies-tarts/small_appleblackberry_pies-detail.webp','small_appleblackberry_pies-detail.webp','pies-tarts','["product","cat_pies_tarts","small_appleblackberry_pies","detail"]',242274,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_small_appleblackberry_pies-thumbnail','/images/products/pies-tarts/small_appleblackberry_pies-thumbnail.webp','small_appleblackberry_pies-thumbnail.webp','pies-tarts','["product","cat_pies_tarts","small_appleblackberry_pies","thumbnail"]',20268,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_large_apple_pie-card','/images/products/pies-tarts/large_apple_pie-card.webp','large_apple_pie-card.webp','pies-tarts','["product","cat_pies_tarts","large_apple_pie","card"]',73604,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_large_apple_pie-detail','/images/products/pies-tarts/large_apple_pie-detail.webp','large_apple_pie-detail.webp','pies-tarts','["product","cat_pies_tarts","large_apple_pie","detail"]',206676,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_large_apple_pie-thumbnail','/images/products/pies-tarts/large_apple_pie-thumbnail.webp','large_apple_pie-thumbnail.webp','pies-tarts','["product","cat_pies_tarts","large_apple_pie","thumbnail"]',19182,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_lemon_meringue_pie-card','/images/products/pies-tarts/lemon_meringue_pie-card.webp','lemon_meringue_pie-card.webp','pies-tarts','["product","cat_pies_tarts","lemon_meringue_pie","card"]',53670,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_lemon_meringue_pie-detail','/images/products/pies-tarts/lemon_meringue_pie-detail.webp','lemon_meringue_pie-detail.webp','pies-tarts','["product","cat_pies_tarts","lemon_meringue_pie","detail"]',161390,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_lemon_meringue_pie-thumbnail','/images/products/pies-tarts/lemon_meringue_pie-thumbnail.webp','lemon_meringue_pie-thumbnail.webp','pies-tarts','["product","cat_pies_tarts","lemon_meringue_pie","thumbnail"]',14024,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_whole_tarte_au_citron-card','/images/products/pies-tarts/whole_tarte_au_citron-card.webp','whole_tarte_au_citron-card.webp','pies-tarts','["product","cat_pies_tarts","whole_tarte_au_citron","card"]',54156,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_whole_tarte_au_citron-detail','/images/products/pies-tarts/whole_tarte_au_citron-detail.webp','whole_tarte_au_citron-detail.webp','pies-tarts','["product","cat_pies_tarts","whole_tarte_au_citron","detail"]',167998,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_whole_tarte_au_citron-thumbnail','/images/products/pies-tarts/whole_tarte_au_citron-thumbnail.webp','whole_tarte_au_citron-thumbnail.webp','pies-tarts','["product","cat_pies_tarts","whole_tarte_au_citron","thumbnail"]',13016,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_tiffin_cake_slice-card','/images/products/cakes-slices/tiffin_cake_slice-card.webp','tiffin_cake_slice-card.webp','cakes-slices','["product","cat_cakes_slices","tiffin_cake_slice","card"]',73858,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_tiffin_cake_slice-detail','/images/products/cakes-slices/tiffin_cake_slice-detail.webp','tiffin_cake_slice-detail.webp','cakes-slices','["product","cat_cakes_slices","tiffin_cake_slice","detail"]',198610,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_tiffin_cake_slice-thumbnail','/images/products/cakes-slices/tiffin_cake_slice-thumbnail.webp','tiffin_cake_slice-thumbnail.webp','cakes-slices','["product","cat_cakes_slices","tiffin_cake_slice","thumbnail"]',18858,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_whole_lemon_drizzle_cake-card','/images/products/cakes-slices/whole_lemon_drizzle_cake-card.webp','whole_lemon_drizzle_cake-card.webp','cakes-slices','["product","cat_cakes_slices","whole_lemon_drizzle_cake","card"]',69046,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_whole_lemon_drizzle_cake-detail','/images/products/cakes-slices/whole_lemon_drizzle_cake-detail.webp','whole_lemon_drizzle_cake-detail.webp','cakes-slices','["product","cat_cakes_slices","whole_lemon_drizzle_cake","detail"]',205268,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_whole_lemon_drizzle_cake-thumbnail','/images/products/cakes-slices/whole_lemon_drizzle_cake-thumbnail.webp','whole_lemon_drizzle_cake-thumbnail.webp','cakes-slices','["product","cat_cakes_slices","whole_lemon_drizzle_cake","thumbnail"]',17174,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_frangipane_slice-card','/images/products/cakes-slices/frangipane_slice-card.webp','frangipane_slice-card.webp','cakes-slices','["product","cat_cakes_slices","frangipane_slice","card"]',71172,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_frangipane_slice-detail','/images/products/cakes-slices/frangipane_slice-detail.webp','frangipane_slice-detail.webp','cakes-slices','["product","cat_cakes_slices","frangipane_slice","detail"]',198800,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_frangipane_slice-thumbnail','/images/products/cakes-slices/frangipane_slice-thumbnail.webp','frangipane_slice-thumbnail.webp','cakes-slices','["product","cat_cakes_slices","frangipane_slice","thumbnail"]',18260,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_dundee_cakes-card','/images/products/cakes-slices/dundee_cakes-card.webp','dundee_cakes-card.webp','cakes-slices','["product","cat_cakes_slices","dundee_cakes","card"]',75720,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_dundee_cakes-detail','/images/products/cakes-slices/dundee_cakes-detail.webp','dundee_cakes-detail.webp','cakes-slices','["product","cat_cakes_slices","dundee_cakes","detail"]',229526,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_dundee_cakes-thumbnail','/images/products/cakes-slices/dundee_cakes-thumbnail.webp','dundee_cakes-thumbnail.webp','cakes-slices','["product","cat_cakes_slices","dundee_cakes","thumbnail"]',17296,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_curried_beef_mince_pasties-card','/images/products/savory/curried_beef_mince_pasties-card.webp','curried_beef_mince_pasties-card.webp','savory','["product","cat_savory","curried_beef_mince_pasties","card"]',69782,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_curried_beef_mince_pasties-detail','/images/products/savory/curried_beef_mince_pasties-detail.webp','curried_beef_mince_pasties-detail.webp','savory','["product","cat_savory","curried_beef_mince_pasties","detail"]',210626,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_curried_beef_mince_pasties-thumbnail','/images/products/savory/curried_beef_mince_pasties-thumbnail.webp','curried_beef_mince_pasties-thumbnail.webp','savory','["product","cat_savory","curried_beef_mince_pasties","thumbnail"]',17084,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_pesto_swirl-card','/images/products/savory/pesto_swirl-card.webp','pesto_swirl-card.webp','savory','["product","cat_savory","pesto_swirl","card"]',78170,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_pesto_swirl-detail','/images/products/savory/pesto_swirl-detail.webp','pesto_swirl-detail.webp','savory','["product","cat_savory","pesto_swirl","detail"]',247732,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_pesto_swirl-thumbnail','/images/products/savory/pesto_swirl-thumbnail.webp','pesto_swirl-thumbnail.webp','savory','["product","cat_savory","pesto_swirl","thumbnail"]',18630,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_kimchi-card','/images/products/savory/kimchi-card.webp','kimchi-card.webp','savory','["product","cat_savory","kimchi","card"]',47270,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_kimchi-detail','/images/products/savory/kimchi-detail.webp','kimchi-detail.webp','savory','["product","cat_savory","kimchi","detail"]',142886,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_kimchi-thumbnail','/images/products/savory/kimchi-thumbnail.webp','kimchi-thumbnail.webp','savory','["product","cat_savory","kimchi","thumbnail"]',13050,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_eccles_cake-card','/images/products/biscuits-bars/eccles_cake-card.webp','eccles_cake-card.webp','biscuits-bars','["product","cat_biscuits_bars","eccles_cake","card"]',64246,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_eccles_cake-detail','/images/products/biscuits-bars/eccles_cake-detail.webp','eccles_cake-detail.webp','biscuits-bars','["product","cat_biscuits_bars","eccles_cake","detail"]',193406,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_eccles_cake-thumbnail','/images/products/biscuits-bars/eccles_cake-thumbnail.webp','eccles_cake-thumbnail.webp','biscuits-bars','["product","cat_biscuits_bars","eccles_cake","thumbnail"]',14794,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_flapjack-card','/images/products/biscuits-bars/flapjack-card.webp','flapjack-card.webp','biscuits-bars','["product","cat_biscuits_bars","flapjack","card"]',72174,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_flapjack-detail','/images/products/biscuits-bars/flapjack-detail.webp','flapjack-detail.webp','biscuits-bars','["product","cat_biscuits_bars","flapjack","detail"]',195864,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_flapjack-thumbnail','/images/products/biscuits-bars/flapjack-thumbnail.webp','flapjack-thumbnail.webp','biscuits-bars','["product","cat_biscuits_bars","flapjack","thumbnail"]',17724,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_millionaire_shortbread-card','/images/products/biscuits-bars/millionaire_shortbread-card.webp','millionaire_shortbread-card.webp','biscuits-bars','["product","cat_biscuits_bars","millionaire_shortbread","card"]',53986,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_millionaire_shortbread-detail','/images/products/biscuits-bars/millionaire_shortbread-detail.webp','millionaire_shortbread-detail.webp','biscuits-bars','["product","cat_biscuits_bars","millionaire_shortbread","detail"]',123238,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_millionaire_shortbread-thumbnail','/images/products/biscuits-bars/millionaire_shortbread-thumbnail.webp','millionaire_shortbread-thumbnail.webp','biscuits-bars','["product","cat_biscuits_bars","millionaire_shortbread","thumbnail"]',14626,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_workspace-hero','/images/hero/workspace-hero.webp','workspace-hero.webp','hero','["hero"]',628422,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_bakery-workspace','/images/hero/bakery-workspace.webp','bakery-workspace.webp','hero','["hero"]',628422,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_about-hero-v2','/images/hero/about-hero-v2.webp','about-hero-v2.webp','hero','["hero"]',247364,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_artisan-bread','/images/hero/artisan-bread.webp','artisan-bread.webp','hero','["hero"]',423142,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_jon','/images/team/jon.webp','jon.webp','team','["team","jon"]',32402,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
INSERT INTO "images" VALUES('img_mike','/images/team/mike.webp','mike.webp','team','["team","mike"]',36656,NULL,'2025-12-02 15:35:15','2025-12-02 15:35:15');
CREATE TABLE `testimonials` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text,
	`content` text NOT NULL,
	`rating` integer DEFAULT 5 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
, `avatar_url` text, `user_id` text REFERENCES users(id), `status` text DEFAULT 'pending' NOT NULL);
INSERT INTO "testimonials" VALUES('rtest-1','Sarah Mitchell','Regular Customer','Band of Bakers has become a weekly treat for our family! The sourdough is absolutely incredible - crusty on the outside, perfectly soft inside. We''ve tried everything from their foccacia to the Portuguese custard tarts, and every single item has been outstanding.',5,'2024-09-15T00:00:00.000Z','2024-09-15T00:00:00.000Z',NULL,'user-cust-1','approved');
INSERT INTO "testimonials" VALUES('rtest-2','James Thompson','Local Business Owner','We order from Band of Bakers for all our office meetings. The croissants and pastries are always fresh, and the service is excellent. The lemon drizzle cake is particularly popular with our team!',5,'2024-10-02T00:00:00.000Z','2024-10-02T00:00:00.000Z',NULL,'user-cust-2','approved');
INSERT INTO "testimonials" VALUES('rtest-3','Emma Davies','Food Blogger','As someone who reviews food regularly, I can honestly say Band of Bakers produces some of the finest baked goods I''ve encountered. Their flapjacks are legendary, and the apple pies - both small and large - are perfection!',5,'2024-08-20T00:00:00.000Z','2024-08-20T00:00:00.000Z',NULL,'user-cust-3','approved');
INSERT INTO "testimonials" VALUES('rtest-4','Michael O''Connor','Weekly Subscriber','I''ve been ordering weekly for over six months now. The quality never wavers - everything is consistently delicious. Special mention to the curried beef pasties and the eccles cakes. Absolute gems!',5,'2024-07-10T00:00:00.000Z','2024-07-10T00:00:00.000Z',NULL,'user-cust-4','approved');
INSERT INTO "testimonials" VALUES('rtest-5','Lisa Patel','Loyal Customer','The cinnamon knots are to die for! And don''t even get me started on the millionaire shortbread - it''s dangerously addictive. Love supporting a local business that clearly takes pride in their craft.',5,'2024-11-05T00:00:00.000Z','2024-11-05T00:00:00.000Z',NULL,'user-cust-5','approved');
INSERT INTO "testimonials" VALUES('rtest-6','Robert Hughes','Customer Since 2024','Discovered Band of Bakers at a local market and now we''re hooked! The wholemeal loaf makes the best toast, and the kids love the Portuguese custard tarts. Can''t recommend enough!',5,'2024-06-18T00:00:00.000Z','2024-06-18T00:00:00.000Z',NULL,'user-cust-6','approved');
INSERT INTO "testimonials" VALUES('rtest-7','Catherine Williams','Happy Customer','Every single product I''ve tried has been exceptional. The attention to detail and quality ingredients really show. The lemon meringue pie was the star of our dinner party!',5,'2024-10-22T00:00:00.000Z','2024-10-22T00:00:00.000Z',NULL,'user-cust-7','approved');
INSERT INTO "testimonials" VALUES('rtest-8','David Chen','Regular Buyer','Fantastic bakery! The foccacia is restaurant-quality, and I''m obsessed with the peach pastries. Perfect for weekend brunches. Always arrives fresh and beautifully presented.',5,'2024-09-30T00:00:00.000Z','2024-09-30T00:00:00.000Z',NULL,'user-cust-8','approved');
INSERT INTO "testimonials" VALUES('rtest-9','Rachel Green','Monthly Subscriber','The whole tarte au citron was the highlight of my birthday celebration. Absolutely stunning and tasted incredible. Band of Bakers never disappoints!',5,'2024-08-12T00:00:00.000Z','2024-08-12T00:00:00.000Z',NULL,'user-cust-9','approved');
INSERT INTO "testimonials" VALUES('rtest-10','Thomas Anderson','Satisfied Customer','Best sourdough in Shropshire, hands down. Also highly recommend the savoury croissants - perfect for breakfast! Great value for exceptional quality.',5,'2024-11-18T00:00:00.000Z','2024-11-18T00:00:00.000Z',NULL,'user-cust-10','approved');
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
INSERT INTO "reviews" VALUES('rreview-1','prod_foccacia','user-cust-45',4,'Really Nice','Good product, tastes homemade. Much better than supermarket versions.',0,5,'approved','2025-10-26T15:33:41.980Z','2025-10-26T15:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-2','prod_foccacia','user-cust-8',5,'Great Product','Excellent quality, will order again. Kids absolutely loved them!',0,9,'approved','2025-09-06T14:33:41.980Z','2025-09-06T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-3','prod_sourdough','user-cust-70',4,'Pretty Good','Nice product, enjoyed it. Would have liked it slightly less sweet but that''s personal preference.',1,12,'approved','2025-10-04T14:33:41.980Z','2025-10-04T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-4','prod_sourdough','user-cust-19',5,'Superb','Outstanding quality. You can tell these are made with care and good ingredients.',0,6,'approved','2025-10-07T14:33:41.980Z','2025-10-07T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-5','prod_sourdough','user-cust-73',5,'Absolutely Divine!','The best I''ve ever tasted. Fresh, flavorful, and perfectly baked. Will definitely order again!',1,5,'approved','2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-6','prod_sourdough','user-cust-70',4,'Very Good','Really nice, would buy again. Maybe a bit pricey but worth it for the quality.',0,13,'approved','2025-10-17T14:33:41.980Z','2025-10-17T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-7','prod_croissants','user-cust-30',5,'Fantastic Quality','You can taste the quality ingredients. Freshly baked and delicious.',0,11,'approved','2025-09-01T14:33:41.980Z','2025-09-01T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-8','prod_croissants','user-cust-24',4,'Pretty Good','Nice product, enjoyed it. Would have liked it slightly less sweet but that''s personal preference.',1,13,'approved','2025-09-18T14:33:41.980Z','2025-09-18T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-9','prod_croissants','user-cust-67',5,'Fantastic Quality','You can taste the quality ingredients. Freshly baked and delicious.',0,0,'approved','2025-08-10T14:33:41.980Z','2025-08-10T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-10','prod_croissants','user-cust-59',5,'Fantastic Quality','You can taste the quality ingredients. Freshly baked and delicious.',1,6,'approved','2025-08-13T14:33:41.980Z','2025-08-13T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-11','prod_apple_pies','user-cust-50',5,'Absolutely Divine!','The best I''ve ever tasted. Fresh, flavorful, and perfectly baked. Will definitely order again!',0,13,'approved','2025-10-25T14:33:41.980Z','2025-10-25T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-12','prod_apple_pies','user-cust-38',5,'Absolutely Divine!','The best I''ve ever tasted. Fresh, flavorful, and perfectly baked. Will definitely order again!',1,14,'approved','2025-11-18T15:33:41.980Z','2025-11-18T15:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-13','prod_apple_pies','user-cust-54',4,'Tasty!','Good flavor and texture. Fresh and well-made.',0,13,'approved','2025-08-28T14:33:41.980Z','2025-08-28T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-14','prod_portuguese_custard_tarts','user-cust-63',5,'Amazing!','Best bakery items in Shropshire! Always fresh and always delicious.',1,6,'approved','2025-09-15T14:33:41.980Z','2025-09-15T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-15','prod_portuguese_custard_tarts','user-cust-17',5,'Lovely','Really enjoyed this. Perfect with a cup of tea!',0,13,'approved','2025-10-25T14:33:41.980Z','2025-10-25T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-16','prod_large_apple_pie','user-cust-60',5,'Great Product','Excellent quality, will order again. Kids absolutely loved them!',1,12,'approved','2025-10-08T14:33:41.980Z','2025-10-08T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-17','prod_large_apple_pie','user-cust-8',5,'Delightful','Perfectly baked, great texture, wonderful flavor. Can''t fault it!',0,4,'approved','2025-11-24T15:33:41.980Z','2025-11-24T15:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-18','prod_lemon_drizzle_cake','user-cust-57',5,'Wonderful','Absolutely love these. Order them every time they''re available!',1,2,'approved','2025-08-15T14:33:41.980Z','2025-08-15T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-19','prod_lemon_drizzle_cake','user-cust-23',5,'Delicious!','Really enjoyed this. Great texture and taste. Highly recommend!',1,10,'approved','2025-09-13T14:33:41.980Z','2025-09-13T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-20','prod_lemon_drizzle_cake','user-cust-5',4,'Tasty!','Good flavor and texture. Fresh and well-made.',1,10,'approved','2025-08-07T14:33:41.980Z','2025-08-07T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-21','prod_cinnamon_knots','user-cust-35',5,'Highly Recommend','These are brilliant! Fresh, tasty, and great value for money.',1,13,'approved','2025-11-17T15:33:41.980Z','2025-11-17T15:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-22','prod_cinnamon_knots','user-cust-56',4,'Pretty Good','Nice product, enjoyed it. Would have liked it slightly less sweet but that''s personal preference.',1,13,'approved','2025-09-20T14:33:41.980Z','2025-09-20T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-23','prod_eccles_cakes','user-cust-61',5,'Lovely','Really enjoyed this. Perfect with a cup of tea!',0,6,'approved','2025-10-10T14:33:41.980Z','2025-10-10T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-24','prod_eccles_cakes','user-cust-43',5,'Amazing!','Best bakery items in Shropshire! Always fresh and always delicious.',1,4,'approved','2025-08-08T14:33:41.980Z','2025-08-08T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-25','prod_eccles_cakes','user-cust-46',5,'Amazing!','Best bakery items in Shropshire! Always fresh and always delicious.',0,1,'approved','2025-10-10T14:33:41.980Z','2025-10-10T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-26','prod_flapjacks','user-cust-40',5,'Fantastic Quality','You can taste the quality ingredients. Freshly baked and delicious.',1,5,'approved','2025-09-27T14:33:41.980Z','2025-09-27T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-27','prod_flapjacks','user-cust-11',5,'Fantastic Quality','You can taste the quality ingredients. Freshly baked and delicious.',1,5,'approved','2025-08-25T14:33:41.980Z','2025-08-25T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-28','prod_curried_beef_pasties','user-cust-14',5,'Fantastic Quality','You can taste the quality ingredients. Freshly baked and delicious.',1,0,'approved','2025-08-16T14:33:41.980Z','2025-08-16T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-29','prod_curried_beef_pasties','user-cust-61',4,'Tasty!','Good flavor and texture. Fresh and well-made.',1,4,'approved','2025-08-20T14:33:41.980Z','2025-08-20T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-30','prod_millionaire_shortbread','user-cust-9',4,'Tasty!','Good flavor and texture. Fresh and well-made.',1,4,'approved','2025-11-09T15:33:41.980Z','2025-11-09T15:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-31','prod_millionaire_shortbread','user-cust-38',5,'Lovely','Really enjoyed this. Perfect with a cup of tea!',1,14,'approved','2025-09-29T14:33:41.980Z','2025-09-29T14:33:41.980Z');
INSERT INTO "reviews" VALUES('rreview-32','prod_millionaire_shortbread','user-cust-17',5,'Superb','Outstanding quality. You can tell these are made with care and good ingredients.',0,6,'approved','2025-11-23T15:33:41.980Z','2025-11-23T15:33:41.980Z');
CREATE TABLE `email_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`subject` text NOT NULL,
	`content` text NOT NULL,
	`variables` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT INTO "email_templates" VALUES('tmpl_order_ready','order_ready_for_collection','Your Order is Ready for Collection! 🥖','          <h1>Your Order is Ready!</h1>          <p>Hi {{customer_name}},</p>          <p>Great news! Your order #{{order_id}} is now ready for collection.</p>          <p><strong>Collection Details:</strong></p>          <ul>            <li>Location: {{location_name}}</li>            <li>Address: {{location_address}}</li>            <li>Time: {{collection_time}}</li>          </ul>          <p>Please bring your order number with you.</p>          <p>See you soon!</p>          <p>Band of Bakers</p>        ','["customer_name","order_id","location_name","location_address","collection_time"]','2025-12-02 15:33:46');
INSERT INTO "email_templates" VALUES('tmpl_order_completed','order_completed','Thank you for your order! 🌟','          <h1>Thank You!</h1>          <p>Hi {{customer_name}},</p>          <p>Thanks for collecting your order #{{order_id}}. We hope you enjoy your bakes!</p>          <p>If you have a moment, we''d love to hear your feedback.</p>          <p>Best regards,</p>          <p>Band of Bakers</p>        ','["customer_name","order_id"]','2025-12-02 15:33:46');
INSERT INTO "email_templates" VALUES('tmpl_bake_sale_cancelled','bake_sale_cancelled','Important: Bake Sale Cancelled ⚠️','          <h1>Bake Sale Update</h1>          <p>Hi {{customer_name}},</p>          <p>We regret to inform you that the bake sale scheduled for {{date}} at {{location_name}} has been cancelled.</p>          <p><strong>Reason:</strong> {{reason}}</p>          <p>Your order #{{order_id}} has been cancelled and a full refund has been processed.</p>          <p>We apologize for any inconvenience caused.</p>          <p>Band of Bakers</p>        ','["customer_name","date","location_name","reason","order_id"]','2025-12-02 15:33:46');
INSERT INTO "email_templates" VALUES('tmpl_bake_sale_rescheduled','bake_sale_rescheduled','Action Required: Bake Sale Rescheduled 📅','          <h1>Bake Sale Rescheduled</h1>          <p>Hi {{customer_name}},</p>          <p>The bake sale scheduled for {{old_date}} has been moved to <strong>{{new_date}}</strong>.</p>          <p><strong>Reason:</strong> {{reason}}</p>          <p>We have updated your order #{{order_id}} to the new date. If this doesn''t work for you, please contact us to cancel for a full refund.</p>          <p>Band of Bakers</p>        ','["customer_name","old_date","new_date","reason","order_id"]','2025-12-02 15:33:46');
INSERT INTO "email_templates" VALUES('tmpl_action_required','action_required','Action Required: Update on your Order ⚠️','          <h1>Action Required</h1>          <p>Hi {{customer_name}},</p>          <p>There has been a change to the bake sale scheduled for {{date}}.</p>          <p><strong>Please review your options:</strong></p>          <p><a href="{{resolution_link}}">Click here to view options</a></p>          <p>You can choose to transfer your order to another date or cancel for a full refund.</p>          <p>Band of Bakers</p>        ','["customer_name","date","resolution_link"]','2025-12-02 15:33:46');
INSERT INTO "email_templates" VALUES('tmpl_order_update_bakery','order_update_bakery','Important Update to Your Order #{{order_id}} ⚠️','          <h1>Order Update Required</h1>          <p>Hi {{customer_name}},</p>          <p>We need to inform you of some changes to your order #{{order_id}}.</p>          <p><strong>Changes:</strong></p>          {{change_details}}          <p><strong>Updated Total:</strong> £{{new_total}}</p>          <p>We apologize for any inconvenience this may cause. If you have any questions or concerns, please don''t hesitate to contact us.</p>          <p>Best regards,<br>Band of Bakers</p>        ','["customer_name","order_id","change_details","new_total"]','2025-12-02 15:33:46');
INSERT INTO "email_templates" VALUES('tmpl_order_update_customer','order_update_customer','Confirmation: Your Order Changes #{{order_id}} ✓','          <h1>Order Changes Confirmed</h1>          <p>Hi {{customer_name}},</p>          <p>As requested, we''ve made the following changes to your order #{{order_id}}:</p>          <p><strong>Changes:</strong></p>          {{change_details}}          <p><strong>Updated Total:</strong> £{{new_total}}</p>          <p>Thank you for letting us know. If you need any further changes, please contact us.</p>          <p>Best regards,<br>Band of Bakers</p>        ','["customer_name","order_id","change_details","new_total"]','2025-12-02 15:33:46');
CREATE TABLE IF NOT EXISTS "orders" (
  id text PRIMARY KEY NOT NULL,
  order_number integer NOT NULL,
  user_id text NOT NULL,
  bake_sale_id text NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  fulfillment_method text DEFAULT 'collection' NOT NULL,
  payment_method text DEFAULT 'payment_on_collection' NOT NULL,
  payment_status text DEFAULT 'pending' NOT NULL,
  payment_intent_id text,
  subtotal real NOT NULL,
  delivery_fee real DEFAULT 0 NOT NULL,
  voucher_discount real DEFAULT 0 NOT NULL,
  total real NOT NULL,
  shipping_address_line1 text,
  shipping_address_line2 text,
  shipping_city text,
  shipping_postcode text,
  billing_address_line1 text NOT NULL,
  billing_address_line2 text,
  billing_city text NOT NULL,
  billing_postcode text NOT NULL,
  voucher_id text,
  notes text,
  created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE no action,
  FOREIGN KEY (bake_sale_id) REFERENCES bake_sales(id) ON UPDATE no action ON DELETE no action,
  FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON UPDATE no action ON DELETE no action
);
INSERT INTO "orders" VALUES('rorder-1',1,'user-cust-65','rbs-past-1','fulfilled','collection','payment_on_collection','completed',NULL,27.5,0,0,27.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-05-30T00:00:00.000Z','2024-05-30T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-2',2,'user-cust-71','rbs-past-1','fulfilled','collection','payment_on_collection','completed',NULL,52.5,0,0,52.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-05-27T00:00:00.000Z','2024-05-27T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-3',3,'user-cust-48','rbs-past-1','fulfilled','collection','payment_on_collection','completed',NULL,92,0,0,92,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-05-30T00:00:00.000Z','2024-05-30T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-4',4,'user-cust-11','rbs-past-1','fulfilled','collection','payment_on_collection','completed',NULL,6,0,0,6,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-05-30T00:00:00.000Z','2024-05-30T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-5',5,'user-cust-48','rbs-past-2','fulfilled','collection','payment_on_collection','completed',NULL,93,0,0,93,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-06-07T00:00:00.000Z','2024-06-07T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-6',6,'user-cust-24','rbs-past-2','fulfilled','collection','payment_on_collection','completed',NULL,45,0,0,45,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-06-06T00:00:00.000Z','2024-06-06T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-7',7,'user-cust-72','rbs-past-2','fulfilled','collection','payment_on_collection','completed',NULL,12.5,0,0,12.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-06-05T00:00:00.000Z','2024-06-05T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-8',8,'user-cust-72','rbs-past-2','fulfilled','collection','payment_on_collection','completed',NULL,93,0,0,93,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-06-03T00:00:00.000Z','2024-06-03T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-9',9,'user-cust-53','rbs-past-3','fulfilled','collection','payment_on_collection','completed',NULL,8.5,0,0,8.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-06-13T00:00:00.000Z','2024-06-13T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-10',10,'user-cust-41','rbs-past-3','fulfilled','collection','payment_on_collection','completed',NULL,109,0,0,109,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-06-11T00:00:00.000Z','2024-06-11T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-11',11,'user-cust-72','rbs-past-3','fulfilled','collection','payment_on_collection','completed',NULL,34.5,0,0,34.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-06-11T00:00:00.000Z','2024-06-11T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-12',12,'user-cust-29','rbs-past-4','fulfilled','collection','payment_on_collection','completed',NULL,52.5,0,0,52.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-06-18T00:00:00.000Z','2024-06-18T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-13',13,'user-cust-50','rbs-past-4','fulfilled','collection','payment_on_collection','completed',NULL,61.5,0,0,61.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-06-17T00:00:00.000Z','2024-06-17T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-14',14,'user-cust-55','rbs-past-4','fulfilled','collection','payment_on_collection','completed',NULL,6.5,0,0,6.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-06-20T00:00:00.000Z','2024-06-20T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-15',15,'user-cust-54','rbs-past-4','fulfilled','collection','payment_on_collection','completed',NULL,18.5,0,0,18.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-06-20T00:00:00.000Z','2024-06-20T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-16',16,'user-cust-64','rbs-past-5','fulfilled','collection','payment_on_collection','completed',NULL,44.5,0,0,44.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-06-27T00:00:00.000Z','2024-06-27T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-17',17,'user-cust-36','rbs-past-5','fulfilled','collection','payment_on_collection','completed',NULL,72,0,0,72,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-06-26T00:00:00.000Z','2024-06-26T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-18',18,'user-cust-53','rbs-past-5','fulfilled','collection','payment_on_collection','completed',NULL,29,0,0,29,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-06-25T00:00:00.000Z','2024-06-25T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-19',19,'user-cust-35','rbs-past-5','fulfilled','collection','payment_on_collection','completed',NULL,61,0,0,61,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-06-24T00:00:00.000Z','2024-06-24T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-20',20,'user-cust-19','rbs-past-5','fulfilled','collection','payment_on_collection','completed',NULL,88.5,0,0,88.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-06-28T00:00:00.000Z','2024-06-28T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-21',21,'user-cust-9','rbs-past-6','fulfilled','collection','payment_on_collection','completed',NULL,13,0,0,13,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-07-02T00:00:00.000Z','2024-07-02T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-22',22,'user-cust-22','rbs-past-6','fulfilled','collection','payment_on_collection','completed',NULL,54,0,0,54,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-07-03T00:00:00.000Z','2024-07-03T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-23',23,'user-cust-36','rbs-past-6','fulfilled','collection','payment_on_collection','completed',NULL,64,0,0,64,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-07-02T00:00:00.000Z','2024-07-02T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-24',24,'user-cust-34','rbs-past-6','fulfilled','collection','payment_on_collection','completed',NULL,71,0,0,71,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-07-05T00:00:00.000Z','2024-07-05T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-25',25,'user-cust-44','rbs-past-6','fulfilled','collection','payment_on_collection','completed',NULL,10,0,0,10,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-07-01T00:00:00.000Z','2024-07-01T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-26',26,'user-cust-46','rbs-past-7','fulfilled','collection','payment_on_collection','completed',NULL,61,0,0,61,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-07-08T00:00:00.000Z','2024-07-08T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-27',27,'user-cust-49','rbs-past-7','fulfilled','collection','payment_on_collection','completed',NULL,26,0,0,26,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-07-08T00:00:00.000Z','2024-07-08T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-28',28,'user-cust-52','rbs-past-7','fulfilled','collection','payment_on_collection','completed',NULL,11,0,0,11,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-07-12T00:00:00.000Z','2024-07-12T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-29',29,'user-cust-12','rbs-past-7','fulfilled','collection','payment_on_collection','completed',NULL,47,0,0,47,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-07-08T00:00:00.000Z','2024-07-08T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-30',30,'user-cust-67','rbs-past-7','fulfilled','collection','payment_on_collection','completed',NULL,57.5,0,0,57.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-07-08T00:00:00.000Z','2024-07-08T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-31',31,'user-cust-36','rbs-past-8','fulfilled','collection','payment_on_collection','completed',NULL,50,0,0,50,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-07-16T00:00:00.000Z','2024-07-16T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-32',32,'user-cust-20','rbs-past-8','fulfilled','collection','payment_on_collection','completed',NULL,37.5,0,0,37.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-07-17T00:00:00.000Z','2024-07-17T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-33',33,'user-cust-71','rbs-past-8','fulfilled','collection','payment_on_collection','completed',NULL,16,0,0,16,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-07-16T00:00:00.000Z','2024-07-16T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-34',34,'user-cust-40','rbs-past-8','fulfilled','collection','payment_on_collection','completed',NULL,67.5,0,0,67.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-07-15T00:00:00.000Z','2024-07-15T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-35',35,'user-cust-61','rbs-past-9','fulfilled','collection','payment_on_collection','completed',NULL,47,0,0,47,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-07-23T00:00:00.000Z','2024-07-23T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-36',36,'user-cust-8','rbs-past-9','fulfilled','collection','payment_on_collection','completed',NULL,72.5,0,0,72.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-07-24T00:00:00.000Z','2024-07-24T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-37',37,'user-cust-17','rbs-past-10','fulfilled','collection','payment_on_collection','completed',NULL,29,0,0,29,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-07-30T00:00:00.000Z','2024-07-30T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-38',38,'user-cust-55','rbs-past-10','fulfilled','collection','payment_on_collection','completed',NULL,30,0,0,30,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-08-02T00:00:00.000Z','2024-08-02T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-39',39,'user-cust-17','rbs-past-10','fulfilled','collection','payment_on_collection','completed',NULL,52,0,0,52,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-08-02T00:00:00.000Z','2024-08-02T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-40',40,'user-cust-15','rbs-past-11','fulfilled','collection','payment_on_collection','completed',NULL,63,0,0,63,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-08-07T00:00:00.000Z','2024-08-07T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-41',41,'user-cust-67','rbs-past-11','fulfilled','collection','payment_on_collection','completed',NULL,23,0,0,23,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-08-08T00:00:00.000Z','2024-08-08T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-42',42,'user-cust-6','rbs-past-11','fulfilled','collection','payment_on_collection','completed',NULL,21.5,0,0,21.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-08-07T00:00:00.000Z','2024-08-07T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-43',43,'user-cust-2','rbs-past-11','fulfilled','collection','payment_on_collection','completed',NULL,41,0,0,41,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-08-06T00:00:00.000Z','2024-08-06T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-44',44,'user-cust-51','rbs-past-11','fulfilled','collection','payment_on_collection','completed',NULL,57,0,0,57,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-08-07T00:00:00.000Z','2024-08-07T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-45',45,'user-cust-32','rbs-past-12','fulfilled','collection','payment_on_collection','completed',NULL,42,0,0,42,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-08-13T00:00:00.000Z','2024-08-13T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-46',46,'user-cust-55','rbs-past-12','fulfilled','collection','payment_on_collection','completed',NULL,56.5,0,0,56.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-08-13T00:00:00.000Z','2024-08-13T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-47',47,'user-cust-24','rbs-past-12','fulfilled','collection','payment_on_collection','completed',NULL,41,0,0,41,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-08-14T00:00:00.000Z','2024-08-14T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-48',48,'user-cust-33','rbs-past-12','fulfilled','collection','payment_on_collection','completed',NULL,72.5,0,0,72.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-08-12T00:00:00.000Z','2024-08-12T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-49',49,'user-cust-5','rbs-past-13','fulfilled','collection','payment_on_collection','completed',NULL,20,0,0,20,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-08-23T00:00:00.000Z','2024-08-23T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-50',50,'user-cust-58','rbs-past-13','fulfilled','collection','payment_on_collection','completed',NULL,44.5,0,0,44.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-08-19T00:00:00.000Z','2024-08-19T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-51',51,'user-cust-61','rbs-past-14','fulfilled','collection','payment_on_collection','completed',NULL,27,0,0,27,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-08-26T00:00:00.000Z','2024-08-26T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-52',52,'user-cust-7','rbs-past-14','fulfilled','collection','payment_on_collection','completed',NULL,120,0,0,120,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-08-27T00:00:00.000Z','2024-08-27T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-53',53,'user-cust-73','rbs-past-14','fulfilled','collection','payment_on_collection','completed',NULL,40.5,0,0,40.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-08-27T00:00:00.000Z','2024-08-27T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-54',54,'user-cust-41','rbs-past-15','fulfilled','collection','payment_on_collection','completed',NULL,33.5,0,0,33.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-09-03T00:00:00.000Z','2024-09-03T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-55',55,'user-cust-61','rbs-past-15','fulfilled','collection','payment_on_collection','completed',NULL,15,0,0,15,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-09-04T00:00:00.000Z','2024-09-04T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-56',56,'user-cust-72','rbs-past-16','fulfilled','collection','payment_on_collection','completed',NULL,118.5,0,0,118.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-09-12T00:00:00.000Z','2024-09-12T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-57',57,'user-cust-2','rbs-past-16','fulfilled','collection','payment_on_collection','completed',NULL,21,0,0,21,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-09-10T00:00:00.000Z','2024-09-10T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-58',58,'user-cust-59','rbs-past-16','fulfilled','collection','payment_on_collection','completed',NULL,46,0,0,46,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-09-13T00:00:00.000Z','2024-09-13T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-59',59,'user-cust-45','rbs-past-16','fulfilled','collection','payment_on_collection','completed',NULL,87.5,0,0,87.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-09-12T00:00:00.000Z','2024-09-12T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-60',60,'user-cust-53','rbs-past-17','fulfilled','collection','payment_on_collection','completed',NULL,68,0,0,68,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-09-17T00:00:00.000Z','2024-09-17T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-61',61,'user-cust-56','rbs-past-17','fulfilled','collection','payment_on_collection','completed',NULL,25.5,0,0,25.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-09-18T00:00:00.000Z','2024-09-18T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-62',62,'user-cust-70','rbs-past-17','fulfilled','collection','payment_on_collection','completed',NULL,96,0,0,96,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-09-19T00:00:00.000Z','2024-09-19T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-63',63,'user-cust-27','rbs-past-18','fulfilled','collection','payment_on_collection','completed',NULL,10,0,0,10,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-09-25T00:00:00.000Z','2024-09-25T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-64',64,'user-cust-3','rbs-past-18','fulfilled','collection','payment_on_collection','completed',NULL,65.5,0,0,65.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-09-27T00:00:00.000Z','2024-09-27T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-65',65,'user-cust-42','rbs-past-18','fulfilled','collection','payment_on_collection','completed',NULL,76.5,0,0,76.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-09-25T00:00:00.000Z','2024-09-25T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-66',66,'user-cust-16','rbs-past-19','fulfilled','collection','payment_on_collection','completed',NULL,27,0,0,27,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-09-30T00:00:00.000Z','2024-09-30T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-67',67,'user-cust-42','rbs-past-19','fulfilled','collection','payment_on_collection','completed',NULL,55,0,0,55,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-10-04T00:00:00.000Z','2024-10-04T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-68',68,'user-cust-10','rbs-past-19','fulfilled','collection','payment_on_collection','completed',NULL,17,0,0,17,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-10-02T00:00:00.000Z','2024-10-02T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-69',69,'user-cust-70','rbs-past-20','fulfilled','collection','payment_on_collection','completed',NULL,61.5,0,0,61.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-10-08T00:00:00.000Z','2024-10-08T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-70',70,'user-cust-9','rbs-past-20','fulfilled','collection','payment_on_collection','completed',NULL,40,0,0,40,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-10-09T00:00:00.000Z','2024-10-09T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-71',71,'user-cust-71','rbs-past-20','fulfilled','collection','payment_on_collection','completed',NULL,10.5,0,0,10.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-10-11T00:00:00.000Z','2024-10-11T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-72',72,'user-cust-24','rbs-past-21','fulfilled','collection','payment_on_collection','completed',NULL,48.5,0,0,48.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-10-14T00:00:00.000Z','2024-10-14T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-73',73,'user-cust-67','rbs-past-21','fulfilled','collection','payment_on_collection','completed',NULL,74.5,0,0,74.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-10-16T00:00:00.000Z','2024-10-16T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-74',74,'user-cust-14','rbs-past-22','fulfilled','collection','payment_on_collection','completed',NULL,47.5,0,0,47.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-10-24T00:00:00.000Z','2024-10-24T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-75',75,'user-cust-63','rbs-past-22','fulfilled','collection','payment_on_collection','completed',NULL,77.5,0,0,77.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-10-23T00:00:00.000Z','2024-10-23T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-76',76,'user-cust-7','rbs-past-22','fulfilled','collection','payment_on_collection','completed',NULL,54.5,0,0,54.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-10-25T00:00:00.000Z','2024-10-25T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-77',77,'user-cust-48','rbs-past-22','fulfilled','collection','payment_on_collection','completed',NULL,32,0,0,32,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-10-23T00:00:00.000Z','2024-10-23T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-78',78,'user-cust-40','rbs-past-22','fulfilled','collection','payment_on_collection','completed',NULL,12,0,0,12,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-10-21T00:00:00.000Z','2024-10-21T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-79',79,'user-cust-8','rbs-past-23','fulfilled','collection','payment_on_collection','completed',NULL,55,0,0,55,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-10-28T00:00:00.000Z','2024-10-28T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-80',80,'user-cust-9','rbs-past-23','fulfilled','collection','payment_on_collection','completed',NULL,40.5,0,0,40.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-10-29T00:00:00.000Z','2024-10-29T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-81',81,'user-cust-11','rbs-past-24','fulfilled','collection','payment_on_collection','completed',NULL,88.5,0,0,88.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-11-08T00:00:00.000Z','2024-11-08T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-82',82,'user-cust-3','rbs-past-24','fulfilled','collection','payment_on_collection','completed',NULL,56,0,0,56,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-11-04T00:00:00.000Z','2024-11-04T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-83',83,'user-cust-7','rbs-past-24','fulfilled','collection','payment_on_collection','completed',NULL,74.5,0,0,74.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-11-05T00:00:00.000Z','2024-11-05T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-84',84,'user-cust-67','rbs-past-25','fulfilled','collection','payment_on_collection','completed',NULL,47.5,0,0,47.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-11-14T00:00:00.000Z','2024-11-14T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-85',85,'user-cust-65','rbs-past-25','fulfilled','collection','payment_on_collection','completed',NULL,12,0,0,12,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-11-14T00:00:00.000Z','2024-11-14T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-86',86,'user-cust-66','rbs-past-26','fulfilled','collection','payment_on_collection','completed',NULL,37.5,0,0,37.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-11-20T00:00:00.000Z','2024-11-20T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-87',87,'user-cust-42','rbs-past-26','fulfilled','collection','payment_on_collection','completed',NULL,54.5,0,0,54.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-11-20T00:00:00.000Z','2024-11-20T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-88',88,'user-cust-26','rbs-past-26','fulfilled','collection','payment_on_collection','completed',NULL,73.5,0,0,73.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-11-18T00:00:00.000Z','2024-11-18T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-89',89,'user-cust-59','rbs-past-26','fulfilled','collection','payment_on_collection','completed',NULL,15.5,0,0,15.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2024-11-18T00:00:00.000Z','2024-11-18T00:00:00.000Z');
INSERT INTO "orders" VALUES('rorder-90',90,'user-cust-66','rbs-future-1','pending','collection','payment_on_collection','pending',NULL,62,0,0,62,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "orders" VALUES('rorder-91',91,'user-cust-25','rbs-future-1','pending','collection','payment_on_collection','pending',NULL,106.5,0,0,106.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2025-11-28T15:33:41.980Z','2025-11-28T15:33:41.980Z');
INSERT INTO "orders" VALUES('rorder-92',92,'user-cust-38','rbs-future-1','pending','collection','payment_on_collection','pending',NULL,41,0,0,41,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2025-11-26T15:33:41.980Z','2025-11-26T15:33:41.980Z');
INSERT INTO "orders" VALUES('rorder-93',93,'user-cust-28','rbs-future-1','processing','collection','payment_on_collection','pending',NULL,61,0,0,61,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "orders" VALUES('rorder-94',94,'user-cust-8','rbs-future-1','processing','collection','payment_on_collection','pending',NULL,117,0,0,117,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2025-11-28T15:33:41.980Z','2025-11-28T15:33:41.980Z');
INSERT INTO "orders" VALUES('rorder-95',95,'user-cust-71','rbs-future-1','pending','collection','payment_on_collection','pending',NULL,33.5,0,0,33.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "orders" VALUES('rorder-96',96,'user-cust-11','rbs-future-1','pending','collection','payment_on_collection','pending',NULL,30.5,0,0,30.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2025-12-02T15:33:41.980Z','2025-12-02T15:33:41.980Z');
INSERT INTO "orders" VALUES('rorder-97',97,'user-cust-40','rbs-future-2','processing','collection','payment_on_collection','pending',NULL,24.5,0,0,24.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2025-11-26T15:33:41.980Z','2025-11-26T15:33:41.980Z');
INSERT INTO "orders" VALUES('rorder-98',98,'user-cust-73','rbs-future-2','processing','collection','payment_on_collection','pending',NULL,31,0,0,31,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2025-11-27T15:33:41.980Z','2025-11-27T15:33:41.980Z');
INSERT INTO "orders" VALUES('rorder-99',99,'user-cust-59','rbs-future-2','pending','collection','payment_on_collection','pending',NULL,21,0,0,21,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2025-11-29T15:33:41.980Z','2025-11-29T15:33:41.980Z');
INSERT INTO "orders" VALUES('rorder-100',100,'user-cust-4','rbs-future-2','pending','collection','payment_on_collection','pending',NULL,55,0,0,55,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2025-11-29T15:33:41.980Z','2025-11-29T15:33:41.980Z');
INSERT INTO "orders" VALUES('rorder-101',101,'user-cust-30','rbs-future-2','pending','collection','payment_on_collection','pending',NULL,69,0,0,69,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2025-12-01T15:33:41.980Z','2025-12-01T15:33:41.980Z');
INSERT INTO "orders" VALUES('rorder-102',102,'user-cust-14','rbs-future-3','ready','collection','payment_on_collection','pending',NULL,13,0,0,13,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2025-11-26T15:33:41.980Z','2025-11-26T15:33:41.980Z');
INSERT INTO "orders" VALUES('rorder-103',103,'user-cust-40','rbs-future-3','processing','collection','payment_on_collection','pending',NULL,42,0,0,42,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2025-11-27T15:33:41.980Z','2025-11-27T15:33:41.980Z');
INSERT INTO "orders" VALUES('rorder-104',104,'user-cust-12','rbs-future-3','pending','collection','payment_on_collection','pending',NULL,115,0,0,115,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2025-11-30T15:33:41.980Z','2025-11-30T15:33:41.980Z');
INSERT INTO "orders" VALUES('rorder-105',105,'user-cust-55','rbs-future-3','pending','collection','payment_on_collection','pending',NULL,77.5,0,0,77.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2025-11-29T15:33:41.980Z','2025-11-29T15:33:41.980Z');
INSERT INTO "orders" VALUES('rorder-106',106,'user-cust-2','rbs-future-4','pending','collection','payment_on_collection','pending',NULL,105,0,0,105,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2025-12-02T15:33:41.980Z','2025-12-02T15:33:41.980Z');
INSERT INTO "orders" VALUES('rorder-107',107,'user-cust-16','rbs-future-4','pending','collection','payment_on_collection','pending',NULL,19.5,0,0,19.5,NULL,NULL,NULL,NULL,'123 Mock Street',NULL,'Shrewsbury','SY1 1AA',NULL,NULL,'2025-11-26T15:33:41.980Z','2025-11-26T15:33:41.980Z');
CREATE TABLE product_bake_sale_availability (
  product_id TEXT NOT NULL,
  bake_sale_id TEXT NOT NULL,
  is_available INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (product_id, bake_sale_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (bake_sale_id) REFERENCES bake_sales(id) ON DELETE CASCADE
);
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
INSERT INTO "faqs" VALUES('faq-1','How do I place an order?','Browse our menu, select your items, choose a bake sale date, and complete checkout. You must order before the cutoff date (typically 2 days before the bake sale).','ordering',1,1,'2025-12-02 15:33:46','2025-12-02 15:33:46');
INSERT INTO "faqs" VALUES('faq-2','What is the order cutoff time?','Orders must be placed at least 24 hours before the bake sale date, typically by 11:00 AM. Check each bake sale listing for specific cutoff times.','ordering',2,1,'2025-12-02 15:33:46','2025-12-02 15:33:46');
INSERT INTO "faqs" VALUES('faq-3','Can I modify or cancel my order?','Yes, you can modify or cancel your order up until the cutoff time. After that, we''ve already started baking and changes cannot be made.','ordering',3,1,'2025-12-02 15:33:46','2025-12-02 15:33:46');
INSERT INTO "faqs" VALUES('faq-4','Do you accept payment on collection?','Yes! We accept both online payment (Stripe) and payment on collection. If paying on collection, we accept cash and card.','ordering',4,1,'2025-12-02 15:33:46','2025-12-02 15:33:46');
INSERT INTO "faqs" VALUES('faq-5','Do you offer delivery?','Yes, we offer delivery to selected areas in Shropshire for a small fee. Delivery areas include Cressage, Shrewsbury, and Telford. Check your postcode at checkout.','delivery',1,1,'2025-12-02 15:33:46','2025-12-02 15:33:46');
INSERT INTO "faqs" VALUES('faq-6','What are the collection times?','Collection times vary by location and bake sale. Typical hours are 10:00 AM - 4:00 PM. You''ll receive specific collection details in your order confirmation.','delivery',2,1,'2025-12-02 15:33:46','2025-12-02 15:33:46');
INSERT INTO "faqs" VALUES('faq-7','What if I can''t collect at the specified time?','Please contact us as soon as possible if you need to arrange an alternative collection time. We''ll do our best to accommodate you within the same day.','delivery',3,1,'2025-12-02 15:33:46','2025-12-02 15:33:46');
INSERT INTO "faqs" VALUES('faq-8','Are your products suitable for vegetarians?','Most of our products are vegetarian. We use local dairy and eggs. Check individual product descriptions for specific dietary information.','products',1,1,'2025-12-02 15:33:46','2025-12-02 15:33:46');
INSERT INTO "faqs" VALUES('faq-9','Do you cater for allergies and dietary requirements?','While we list common allergens on our products, all items are made in a kitchen that handles nuts, gluten, dairy, and eggs. Please contact us for specific allergy concerns.','products',2,1,'2025-12-02 15:33:46','2025-12-02 15:33:46');
INSERT INTO "faqs" VALUES('faq-10','How long do your baked goods stay fresh?','Our bread is best within 2-3 days and can be frozen for up to 3 months. Pastries are best enjoyed on the day of collection. Cakes will last 3-5 days when stored properly.','products',3,1,'2025-12-02 15:33:46','2025-12-02 15:33:46');
INSERT INTO "faqs" VALUES('faq-11','What makes your sourdough special?','Our sourdough is made with a natural starter that''s been cultivated for years. We use long fermentation (up to 24 hours) for better flavor, texture, and digestibility.','products',4,1,'2025-12-02 15:33:46','2025-12-02 15:33:46');
INSERT INTO "faqs" VALUES('faq-12','How often do you have bake sales?','We typically hold bake sales weekly or fortnightly at various locations around Shropshire. Check our menu or follow us on social media for the latest schedule.','general',1,1,'2025-12-02 15:33:46','2025-12-02 15:33:46');
INSERT INTO "faqs" VALUES('faq-13','Can I place a custom order?','Yes! We accept custom orders for special occasions. Please contact us at least 2 weeks in advance to discuss your requirements and pricing.','general',2,1,'2025-12-02 15:33:46','2025-12-02 15:33:46');
INSERT INTO "faqs" VALUES('faq-14','Do you offer wholesale or supply to cafes/restaurants?','We''re currently focused on our bake sale model for individual customers, but we''re happy to discuss wholesale opportunities. Please get in touch to explore options.','general',3,1,'2025-12-02 15:33:46','2025-12-02 15:33:46');
INSERT INTO "faqs" VALUES('faq-15','How can I stay updated on new products and bake sales?','Follow us on Instagram, Facebook, and Twitter for the latest updates, special bakes, and bake sale announcements. You can also subscribe to our newsletter (coming soon!).','general',4,1,'2025-12-02 15:33:46','2025-12-02 15:33:46');
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" VALUES('d1_migrations',20);
CREATE UNIQUE INDEX `news_posts_slug_unique` ON `news_posts` (`slug`);
CREATE UNIQUE INDEX `product_categories_name_unique` ON `product_categories` (`name`);
CREATE UNIQUE INDEX `product_categories_slug_unique` ON `product_categories` (`slug`);
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);
CREATE UNIQUE INDEX `settings_key_unique` ON `settings` (`key`);
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
CREATE UNIQUE INDEX `vouchers_code_unique` ON `vouchers` (`code`);
CREATE UNIQUE INDEX `images_url_unique` ON `images` (`url`);
CREATE INDEX `idx_images_category` ON `images` (`category`);
CREATE INDEX `idx_images_uploaded_by` ON `images` (`uploaded_by`);
CREATE INDEX `idx_news_posts_is_published` ON `news_posts` (`is_published`);
CREATE INDEX `idx_products_category_id` ON `products` (`category_id`);
CREATE INDEX `idx_products_is_active` ON `products` (`is_active`);
CREATE INDEX `idx_users_role` ON `users` (`role`);
CREATE INDEX `idx_reviews_product_id` ON `reviews` (`product_id`);
CREATE INDEX `idx_reviews_user_id` ON `reviews` (`user_id`);
CREATE INDEX `idx_reviews_status` ON `reviews` (`status`);
CREATE UNIQUE INDEX `email_templates_name_unique` ON `email_templates` (`name`);
CREATE INDEX `idx_testimonials_status` ON `testimonials` (`status`);
CREATE INDEX `idx_bake_sales_location_id` ON `bake_sales` (`location_id`);
CREATE INDEX `idx_order_items_order_id` ON `order_items` (`order_id`);
CREATE INDEX `idx_order_items_product_id` ON `order_items` (`product_id`);
CREATE INDEX `idx_product_variants_product_id` ON `product_variants` (`product_id`);
CREATE INDEX `idx_products_cat_active` ON `products` (`category_id`,`is_active`);
CREATE INDEX `idx_order_items_variant_id` ON `order_items` (`product_variant_id`);
CREATE INDEX `idx_testimonials_user_id` ON `testimonials` (`user_id`);
CREATE UNIQUE INDEX idx_orders_order_number ON orders (order_number);
CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_created_at ON orders (created_at);
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at);
CREATE INDEX idx_bake_sales_date ON bake_sales (date);
CREATE INDEX idx_pbsa_bake_sale_id ON product_bake_sale_availability (bake_sale_id);
CREATE INDEX `idx_faqs_is_active` ON `faqs` (`is_active`);
CREATE INDEX `idx_faqs_sort_order` ON `faqs` (`sort_order`);
