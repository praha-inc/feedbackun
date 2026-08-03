import { relations } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

import { skillElements } from './skill-elements';

export const skills = sqliteTable('skills', {
  id: text('id').primaryKey(),
  type: text('type', { enum: ['engineer', 'designer'] }).notNull(),
  level: integer('level').notNull(),
  name: text('name').notNull(),
  deprecatedAt: integer('deprecated_at', { mode: 'timestamp' }),
});

export const skillsRelations = relations(skills, ({ many }) => ({
  elements: many(skillElements),
}));
