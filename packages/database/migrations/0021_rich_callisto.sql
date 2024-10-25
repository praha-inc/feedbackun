PRAGMA defer_foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_slack_messages` (
    `id` text PRIMARY KEY NOT NULL,
    `slack_channel_id` text NOT NULL,
    `slack_user_id` text NOT NULL,
    `text` text NOT NULL,
    `ts` text NOT NULL,
    `thread_ts` text NOT NULL,
    FOREIGN KEY (`slack_channel_id`) REFERENCES `slack_channels`(`id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`slack_user_id`) REFERENCES `slack_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_slack_messages`("id", "slack_channel_id", "slack_user_id", "text", "ts", "thread_ts") SELECT "id", "slack_channel_id", "slack_user_id", "text", "ts", "ts" AS "thread_ts" FROM `slack_messages`;--> statement-breakpoint
DROP TABLE `slack_messages`;--> statement-breakpoint
ALTER TABLE `__new_slack_messages` RENAME TO `slack_messages`;--> statement-breakpoint
PRAGMA defer_foreign_keys=OFF;
