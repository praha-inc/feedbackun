import { relations } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { skills } from './skills';

export const skillElements = sqliteTable('skill_elements', {
  id: text('id').primaryKey(),
  skillId: text('skill_id').notNull().references(() => skills.id),
  order: int('order').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
});

export const skillElementsRelations = relations(skillElements, ({ one }) => ({
  skill: one(skills, {
    fields: [skillElements.skillId],
    references: [skills.id],
  }),
}));
