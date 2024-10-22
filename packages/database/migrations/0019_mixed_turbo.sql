CREATE UNIQUE INDEX `user_session_requests_user_id_unique` ON `user_session_requests` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_session_requests_token_unique` ON `user_session_requests` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_sessions_user_id_unique` ON `user_sessions` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_sessions_token_unique` ON `user_sessions` (`token`);