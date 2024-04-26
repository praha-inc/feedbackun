CREATE TABLE `slack_channels` (
	`id` text PRIMARY KEY NOT NULL,
	`slack_team_id` text NOT NULL,
	`name` text NOT NULL,
	FOREIGN KEY (`slack_team_id`) REFERENCES `slack_teams`(`id`) ON UPDATE no action ON DELETE no action
);
