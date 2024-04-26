import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { slackEmojis } from './slack-emojis';

export const slackUnicodeEmojis = sqliteTable('slack_unicode_emojis', {
  id: text('id').primaryKey().references(() => slackEmojis.id),
  code: text('code').notNull(),
});

export const slackUnicodeEmojisRelations = relations(slackUnicodeEmojis, ({ one }) => ({
  emoji: one(slackEmojis, {
    fields: [slackUnicodeEmojis.id],
    references: [slackEmojis.id],
  }),
}));
