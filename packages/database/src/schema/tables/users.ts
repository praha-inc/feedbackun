import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { slackUsers } from './slack-users';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  slackUsers: many(slackUsers),
}));
