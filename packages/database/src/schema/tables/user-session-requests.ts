import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { users } from './users';

export const userSessionRequests = sqliteTable('user_session_requests', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique().references(() => users.id),
  token: text('token').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const userSessionRequestsRelations = relations(userSessionRequests, ({ many }) => ({
  users: many(users),
}));
