import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { slackMessages } from './slack-messages';
import { slackTeams } from './slack-teams';

export const slackUsers = sqliteTable('slack_users', {
  id: text('id').primaryKey(),
  slackTeamId: text('slack_team_id').notNull().references(() => slackTeams.id),
  name: text('name').notNull(),
});

export const slackUsersRelations = relations(slackUsers, ({ one, many }) => ({
  team: one(slackTeams, {
    fields: [slackUsers.slackTeamId],
    references: [slackTeams.id],
  }),
  messages: many(slackMessages),
}));
