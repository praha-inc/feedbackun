DROP TABLE `feedbacks`;
--> statement-breakpoint
CREATE TABLE `feedbacks` (
    `id` text PRIMARY KEY NOT NULL,
    `send_slack_user_id` text NOT NULL,
    `receive_slack_user_id` text NOT NULL,
    `slack_message_id` text NOT NULL,
    `content` text NOT NULL,
    `created_at` integer NOT NULL,
    FOREIGN KEY (`send_slack_user_id`) REFERENCES `slack_users`(`id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`receive_slack_user_id`) REFERENCES `slack_users`(`id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`slack_message_id`) REFERENCES `slack_messages`(`id`) ON UPDATE no action ON DELETE no action
);
