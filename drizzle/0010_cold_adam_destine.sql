CREATE TABLE `kb_chunks` (
	`id` text PRIMARY KEY NOT NULL,
	`fileId` text NOT NULL,
	`heading` text NOT NULL,
	`topic` text NOT NULL,
	`language` text NOT NULL,
	`tags` text NOT NULL,
	`text` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `kb_embeddings` (
	`id` text PRIMARY KEY NOT NULL,
	`chunkId` text NOT NULL,
	`model` text NOT NULL,
	`embedding` text NOT NULL,
	FOREIGN KEY (`chunkId`) REFERENCES `kb_chunks`(`id`) ON UPDATE no action ON DELETE no action
);
