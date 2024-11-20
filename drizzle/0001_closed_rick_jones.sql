CREATE TABLE `bean_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`robustaAmount` integer,
	`arabicaAmount` integer,
	`roastery` integer,
	FOREIGN KEY (`roastery`) REFERENCES `roastery_table`(`id`) ON UPDATE no action ON DELETE no action
);
