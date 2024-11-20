CREATE TABLE `bean_taste_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`flavor` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `bean_table` ADD `isFavorit` integer;