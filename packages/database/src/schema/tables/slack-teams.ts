import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { slackChannels } from './slack-channels';
import { slackEmojis } from './slack-emojis';
import { slackUsers } from './slack-users';

export const slackTeams = sqliteTable('slack_teams', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  domain: text('domain').notNull(),
});

export const slackTeamsRelations = relations(slackTeams, ({ many }) => ({
  emojis: many(slackEmojis),
  channels: many(slackChannels),
  users: many(slackUsers),
}));
