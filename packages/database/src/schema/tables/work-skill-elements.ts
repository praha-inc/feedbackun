import { relations } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { workSkills } from './work-skills';

export const workSkillElements = sqliteTable('work_skill_elements', {
  id: text('id').primaryKey(),
  workSkillId: text('work_skill_id').notNull().references(() => workSkills.id),
  order: int('order').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
});

export const workSkillElementsRelations = relations(workSkillElements, ({ one }) => ({
  skill: one(workSkills, {
    fields: [workSkillElements.workSkillId],
    references: [workSkills.id],
  }),
}));
