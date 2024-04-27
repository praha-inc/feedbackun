CREATE TABLE `slack_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`slack_channel_id` text NOT NULL,
	`slack_user_id` text NOT NULL,
	`text` text NOT NULL,
	`ts` text NOT NULL,
	FOREIGN KEY (`slack_channel_id`) REFERENCES `slack_channels`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`slack_user_id`) REFERENCES `slack_users`(`id`) ON UPDATE no action ON DELETE no action
);
