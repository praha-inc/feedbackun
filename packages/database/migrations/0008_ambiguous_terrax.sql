CREATE TABLE `work_skill_elements` (
	`id` text PRIMARY KEY NOT NULL,
	`work_skill_id` text NOT NULL,
	`order` integer NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	FOREIGN KEY (`work_skill_id`) REFERENCES `work_skills`(`id`) ON UPDATE no action ON DELETE no action
);
