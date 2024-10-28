import type { SkillElement } from '../skill-elements/types';
import type { Skill } from '../skills/types';

export type Feedback = {
  id: string;
  content: string;
  createdAt: Date;
};

export type FeedbackAssignedSkill = {
  skill: Skill;
  skillElements: SkillElement[];
};
