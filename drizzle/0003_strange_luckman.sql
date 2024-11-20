CREATE TABLE `bean_taste_association` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`beanId` integer NOT NULL,
	`tasteId` integer NOT NULL,
	FOREIGN KEY (`beanId`) REFERENCES `bean_table`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tasteId`) REFERENCES `bean_taste_table`(`id`) ON UPDATE no action ON DELETE no action
);
