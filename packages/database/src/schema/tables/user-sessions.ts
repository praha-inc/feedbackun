import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { users } from './users';

export const userSessions = sqliteTable('user_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  token: text('token').notNull(),
  expiredAt: integer('expired_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const userSessionsRelations = relations(userSessions, ({ many }) => ({
  users: many(users),
}));
