import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { slackTeams } from './slack-teams';

export const slackChannels = sqliteTable('slack_channels', {
  id: text('id').primaryKey(),
  slackTeamId: text('slack_team_id').notNull().references(() => slackTeams.id),
  name: text('name').notNull(),
});

export const slackChannelsRelations = relations(slackChannels, ({ one }) => ({
  team: one(slackTeams, {
    fields: [slackChannels.slackTeamId],
    references: [slackTeams.id],
  }),
}));
