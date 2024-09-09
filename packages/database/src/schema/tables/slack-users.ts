import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { feedbacks } from './feedbacks';
import { slackMessages } from './slack-messages';
import { slackTeams } from './slack-teams';
import { users } from './users';

export const slackUsers = sqliteTable('slack_users', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  slackTeamId: text('slack_team_id').notNull().references(() => slackTeams.id),
  name: text('name').notNull(),
});

export const slackUsersRelations = relations(slackUsers, ({ one, many }) => ({
  user: one(users, {
    fields: [slackUsers.userId],
    references: [users.id],
  }),
  team: one(slackTeams, {
    fields: [slackUsers.slackTeamId],
    references: [slackTeams.id],
  }),
  messages: many(slackMessages),
  sendFeedbacks: many(feedbacks, { relationName: 'sendUser' }),
  receiveFeedbacks: many(feedbacks, { relationName: 'receiveUser' }),
}));
