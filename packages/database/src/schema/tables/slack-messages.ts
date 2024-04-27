import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { slackChannels } from './slack-channels';
import { slackUsers } from './slack-users';

export const slackMessages = sqliteTable('slack_messages', {
  id: text('id').primaryKey(),
  slackChannelId: text('slack_channel_id').notNull().references(() => slackChannels.id),
  slackUserId: text('slack_user_id').notNull().references(() => slackUsers.id),
  text: text('text').notNull(),
  ts: text('ts').notNull(),
});

export const slackMessagesRelations = relations(slackMessages, ({ one }) => ({
  channel: one(slackChannels, {
    fields: [slackMessages.slackChannelId],
    references: [slackChannels.id],
  }),
  user: one(slackUsers, {
    fields: [slackMessages.slackUserId],
    references: [slackUsers.id],
  }),
}));
