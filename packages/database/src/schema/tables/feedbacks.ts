import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { slackMessages } from './slack-messages';
import { slackUsers } from './slack-users';
import { users } from './users';

export const feedbacks = sqliteTable('feedbacks', {
  id: text('id').primaryKey(),
  sendSlackUserId: text('send_slack_user_id').notNull().references(() => users.id),
  receiveSlackUserId: text('receive_slack_user_id').notNull().references(() => users.id),
  slackMessageId: text('slack_message_id').notNull().references(() => slackMessages.id),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const feedbacksRelations = relations(feedbacks, ({ one }) => ({
  sendUser: one(slackUsers, {
    fields: [feedbacks.sendSlackUserId],
    references: [slackUsers.id],
  }),
  receiveUser: one(slackUsers, {
    fields: [feedbacks.receiveSlackUserId],
    references: [slackUsers.id],
  }),
  slackMessage: one(slackMessages, {
    fields: [feedbacks.slackMessageId],
    references: [slackMessages.id],
  }),
}));
