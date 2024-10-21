PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_session_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expired_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_user_session_requests`("id", "user_id", "token", "expired_at", "created_at") SELECT "id", "user_id", "token", "expired_at", "created_at" FROM `user_session_requests`;--> statement-breakpoint
DROP TABLE `user_session_requests`;--> statement-breakpoint
ALTER TABLE `__new_user_session_requests` RENAME TO `user_session_requests`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_user_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expired_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_user_sessions`("id", "user_id", "token", "expired_at", "created_at") SELECT "id", "user_id", "token", "expired_at", "created_at" FROM `user_sessions`;--> statement-breakpoint
DROP TABLE `user_sessions`;--> statement-breakpoint
ALTER TABLE `__new_user_sessions` RENAME TO `user_sessions`;