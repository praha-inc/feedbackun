import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { feedbacks } from './feedbacks';
import { workSkillElements } from './work-skill-elements';

export const feedbackWorkSkills = sqliteTable('feedback_skills', {
  id: text('id').primaryKey(),
  feedbackId: text('feedback_id').notNull().references(() => feedbacks.id),
  workSkillElementId: text('work_skill_element_id').notNull().references(() => workSkillElements.id),
});

export const feedbackWorkSkillsRelations = relations(feedbackWorkSkills, ({ one }) => ({
  feedback: one(feedbacks, {
    fields: [feedbackWorkSkills.feedbackId],
    references: [feedbacks.id],
  }),
  workSkillElement: one(workSkillElements, {
    fields: [feedbackWorkSkills.workSkillElementId],
    references: [workSkillElements.id],
  }),
}));
