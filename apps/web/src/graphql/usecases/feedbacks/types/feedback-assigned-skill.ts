import type { SkillElement } from '../../skill-elements/types/skill-element';
import type { Skill } from '../../skills/types/skill';

export type FeedbackAssignedSkill = {
  skill: Skill;
  skillElements: SkillElement[];
};
