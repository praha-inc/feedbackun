CREATE TABLE `slack_reactions` (
	`slack_message_id` text NOT NULL,
	`slack_emoji_id` text NOT NULL,
	`slack_user_id` text NOT NULL,
	`ts` text NOT NULL,
	PRIMARY KEY(`slack_emoji_id`, `slack_message_id`, `slack_user_id`),
	FOREIGN KEY (`slack_message_id`) REFERENCES `slack_messages`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`slack_emoji_id`) REFERENCES `slack_emojis`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`slack_user_id`) REFERENCES `slack_users`(`id`) ON UPDATE no action ON DELETE no action
);
