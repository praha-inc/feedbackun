import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { slackMessages } from './slack-messages';
import { users } from './users';

export const feedbacks = sqliteTable('feedbacks', {
  id: text('id').primaryKey(),
  sendUserId: text('send_user_id').notNull().references(() => users.id),
  receiveUserId: text('receive_user_id').notNull().references(() => users.id),
  slackMessageId: text('slack_message_id').notNull().references(() => slackMessages.id),
  content: text('content').notNull(),
});

export const feedbacksRelations = relations(feedbacks, ({ one }) => ({
  sendUser: one(users, {
    fields: [feedbacks.sendUserId],
    references: [users.id],
  }),
  receiveUser: one(users, {
    fields: [feedbacks.receiveUserId],
    references: [users.id],
  }),
  slackMessage: one(slackMessages, {
    fields: [feedbacks.slackMessageId],
    references: [slackMessages.id],
  }),
}));
