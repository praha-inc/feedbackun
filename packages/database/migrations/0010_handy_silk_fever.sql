CREATE TABLE `feedback_skills` (
	`id` text PRIMARY KEY NOT NULL,
	`feedback_id` text NOT NULL,
	`work_skill_element_id` text NOT NULL,
	FOREIGN KEY (`feedback_id`) REFERENCES `feedbacks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`work_skill_element_id`) REFERENCES `work_skill_elements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `feedbacks` (
	`id` text PRIMARY KEY NOT NULL,
	`send_user_id` text NOT NULL,
	`receive_user_id` text NOT NULL,
	`slack_message_id` text NOT NULL,
	`content` text NOT NULL,
	FOREIGN KEY (`send_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`receive_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`slack_message_id`) REFERENCES `slack_messages`(`id`) ON UPDATE no action ON DELETE no action
);
