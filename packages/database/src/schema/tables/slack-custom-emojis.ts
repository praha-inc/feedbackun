import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { slackEmojis } from './slack-emojis';

export const slackCustomEmojis = sqliteTable('slack_custom_emojis', {
  id: text('id').primaryKey().references(() => slackEmojis.id),
  url: text('url').notNull(),
});

export const slackCustomEmojisRelations = relations(slackCustomEmojis, ({ one }) => ({
  emoji: one(slackEmojis, {
    fields: [slackCustomEmojis.id],
    references: [slackEmojis.id],
  }),
}));
