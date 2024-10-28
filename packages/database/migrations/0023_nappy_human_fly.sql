PRAGMA defer_foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_slack_teams` (
    `id` text PRIMARY KEY NOT NULL,
    `name` text NOT NULL,
    `icon` text NOT NULL,
    `domain` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_slack_teams`("id", "name", "icon", "domain") SELECT "id", "name", "" AS "icon", "domain" FROM `slack_teams`;--> statement-breakpoint
DROP TABLE `slack_teams`;--> statement-breakpoint
ALTER TABLE `__new_slack_teams` RENAME TO `slack_teams`;--> statement-breakpoint
PRAGMA defer_foreign_keys=OFF;
