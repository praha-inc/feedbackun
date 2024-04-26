import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const slackTeams = sqliteTable('slack_teams', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  domain: text('domain').notNull(),
});
