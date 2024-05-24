DROP TABLE `slack_reactions`;
--> statement-breakpoint
CREATE TABLE `slack_reactions` (
    `id` text PRIMARY KEY NOT NULL,
    `slack_message_id` text NOT NULL,
    `slack_emoji_id` text NOT NULL,
    `slack_user_id` text NOT NULL,
    `ts` text NOT NULL,
    FOREIGN KEY (`slack_message_id`) REFERENCES `slack_messages`(`id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`slack_emoji_id`) REFERENCES `slack_emojis`(`id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`slack_user_id`) REFERENCES `slack_users`(`id`) ON UPDATE no action ON DELETE no action
);
