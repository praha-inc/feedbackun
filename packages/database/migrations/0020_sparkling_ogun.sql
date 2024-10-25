PRAGMA defer_foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_slack_users` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`slack_team_id` text NOT NULL,
	`name` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`slack_team_id`) REFERENCES `slack_teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_slack_users`("id", "user_id", "slack_team_id", "name") SELECT "id", "user_id", "slack_team_id", "name" FROM `slack_users`;--> statement-breakpoint
DROP TABLE `slack_users`;--> statement-breakpoint
ALTER TABLE `__new_slack_users` RENAME TO `slack_users`;--> statement-breakpoint
PRAGMA defer_foreign_keys=OFF;
