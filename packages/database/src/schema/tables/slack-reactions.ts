import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { slackEmojis } from './slack-emojis';
import { slackMessages } from './slack-messages';
import { slackUsers } from './slack-users';

export const slackReactions = sqliteTable('slack_reactions', {
  id: text('id').primaryKey(),
  slackMessageId: text('slack_message_id').notNull().references(() => slackMessages.id),
  slackEmojiId: text('slack_emoji_id').notNull().references(() => slackEmojis.id),
  slackUserId: text('slack_user_id').notNull().references(() => slackUsers.id),
  ts: text('ts').notNull(),
});

export const slackReactionsRelations = relations(slackReactions, ({ one }) => ({
  user: one(slackUsers, {
    fields: [slackReactions.slackUserId],
    references: [slackUsers.id],
  }),
  message: one(slackMessages, {
    fields: [slackReactions.slackMessageId],
    references: [slackMessages.id],
  }),
  emoji: one(slackEmojis, {
    fields: [slackReactions.slackEmojiId],
    references: [slackEmojis.id],
  }),
}));
