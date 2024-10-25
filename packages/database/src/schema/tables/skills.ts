import { relations } from 'drizzle-orm';
import { sqliteTable, int, text } from 'drizzle-orm/sqlite-core';

import { skillElements } from './skill-elements';

export const skills = sqliteTable('skills', {
  id: text('id').primaryKey(),
  type: text('type', { enum: ['engineer', 'designer'] }).notNull(),
  level: int('level').notNull(),
  name: text('name').notNull(),
});

export const skillsRelations = relations(skills, ({ many }) => ({
  elements: many(skillElements),
}));
