CREATE TABLE `slack_custom_emojis` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `slack_emojis`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `slack_emojis` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`slack_team_id` text NOT NULL,
	`name` text NOT NULL,
	FOREIGN KEY (`slack_team_id`) REFERENCES `slack_teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `slack_unicode_emojis` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `slack_emojis`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `slack_emojis_slack_team_id_name_unique` ON `slack_emojis` (`slack_team_id`,`name`);