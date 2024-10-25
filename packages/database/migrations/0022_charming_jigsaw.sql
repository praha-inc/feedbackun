ALTER TABLE `work_skill_elements` RENAME TO `skill_elements`;--> statement-breakpoint
ALTER TABLE `work_skills` RENAME TO `skills`;--> statement-breakpoint
ALTER TABLE `skill_elements` RENAME COLUMN "work_skill_id" TO "skill_id";--> statement-breakpoint
PRAGMA defer_foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_skill_elements` (
	`id` text PRIMARY KEY NOT NULL,
	`skill_id` text NOT NULL,
	`order` integer NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_skill_elements`("id", "skill_id", "order", "name", "description") SELECT "id", "skill_id", "order", "name", "description" FROM `skill_elements`;--> statement-breakpoint
DROP TABLE `skill_elements`;--> statement-breakpoint
ALTER TABLE `__new_skill_elements` RENAME TO `skill_elements`;--> statement-breakpoint
PRAGMA defer_foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_feedback_skills` (
	`feedback_id` text NOT NULL,
	`skill_element_id` text NOT NULL,
	PRIMARY KEY(`feedback_id`, `skill_element_id`),
	FOREIGN KEY (`feedback_id`) REFERENCES `feedbacks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`skill_element_id`) REFERENCES `skill_elements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_feedback_skills`("feedback_id", "skill_element_id") SELECT "feedback_id", "work_skill_element_id" FROM `feedback_skills`;--> statement-breakpoint
DROP TABLE `feedback_skills`;--> statement-breakpoint
ALTER TABLE `__new_feedback_skills` RENAME TO `feedback_skills`;
