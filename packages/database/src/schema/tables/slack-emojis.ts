import { relations } from 'drizzle-orm';
import { sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';

import { slackCustomEmojis } from './slack-custom-emojis';
import { slackReactions } from './slack-reactions';
import { slackTeams } from './slack-teams';
import { slackUnicodeEmojis } from './slack-unicode-emojis';

export const slackEmojis = sqliteTable('slack_emojis', {
  id: text('id').primaryKey(),
  type: text('type', { enum: ['custom', 'unicode'] }).notNull(),
  slackTeamId: text('slack_team_id').notNull().references(() => slackTeams.id),
  name: text('name').notNull(),
}, (table) => ({
  uniqueName: unique().on(table.slackTeamId, table.name),
}));

export const slackEmojisRelations = relations(slackEmojis, ({ one, many }) => ({
  team: one(slackTeams, {
    fields: [slackEmojis.slackTeamId],
    references: [slackTeams.id],
  }),
  custom: one(slackCustomEmojis, {
    fields: [slackEmojis.id],
    references: [slackCustomEmojis.id],
  }),
  unicode: one(slackUnicodeEmojis, {
    fields: [slackEmojis.id],
    references: [slackUnicodeEmojis.id],
  }),
  reactions: many(slackReactions),
}));
