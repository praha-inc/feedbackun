import { relations } from 'drizzle-orm';
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { feedbacks } from './feedbacks';
import { skillElements } from './skill-elements';

export const feedbackSkills = sqliteTable('feedback_skills', {
  feedbackId: text('feedback_id').notNull().references(() => feedbacks.id),
  skillElementId: text('skill_element_id').notNull().references(() => skillElements.id),
}, (t) => ({
  primaryKey: primaryKey({ columns: [t.feedbackId, t.skillElementId] }),
}));

export const feedbackSkillsRelations = relations(feedbackSkills, ({ one }) => ({
  feedback: one(feedbacks, {
    fields: [feedbackSkills.feedbackId],
    references: [feedbacks.id],
  }),
  skillElement: one(skillElements, {
    fields: [feedbackSkills.skillElementId],
    references: [skillElements.id],
  }),
}));
