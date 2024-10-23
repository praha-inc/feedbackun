import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { slackUsers } from './slack-users';
import { userSessionRequests } from './user-session-requests';
import { userSessions } from './user-sessions';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  type: text('type', { enum: ['engineer', 'designer'] }).notNull(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  slackUsers: many(slackUsers),
  sessionRequests: many(userSessionRequests),
  sessions: many(userSessions),
}));
