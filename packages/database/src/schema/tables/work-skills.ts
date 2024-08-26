import { relations } from 'drizzle-orm';
import { sqliteTable, int, text } from 'drizzle-orm/sqlite-core';

import { workSkillElements } from './work-skill-elements';

export const workSkills = sqliteTable('work_skills', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  level: int('level').notNull(),
  name: text('name').notNull(),
});

export const workSkillRelations = relations(workSkills, ({ many }) => ({
  elements: many(workSkillElements),
}));
