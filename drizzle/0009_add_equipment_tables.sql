CREATE TABLE `grinder_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`manufacturer` text NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `machine_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`manufacturer` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL
);
