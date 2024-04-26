import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { slackEmojis } from './slack-emojis';

export const slackTeams = sqliteTable('slack_teams', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  domain: text('domain').notNull(),
});

export const slackTeamsRelations = relations(slackTeams, ({ many }) => ({
  emojis: many(slackEmojis),
}));
