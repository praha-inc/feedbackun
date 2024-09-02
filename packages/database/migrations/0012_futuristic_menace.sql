DROP TABLE `feedback_skills`;
--> statement-breakpoint
CREATE TABLE `feedback_skills` (
    `feedback_id` text NOT NULL,
    `work_skill_element_id` text NOT NULL,
    PRIMARY KEY (`feedback_id`, `work_skill_element_id`),
    FOREIGN KEY (`feedback_id`) REFERENCES `feedbacks`(`id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`work_skill_element_id`) REFERENCES `work_skill_elements`(`id`) ON UPDATE no action ON DELETE no action
);
