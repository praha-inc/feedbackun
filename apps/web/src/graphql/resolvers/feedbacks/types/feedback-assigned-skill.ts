import { builder } from '../../../core/builder';
import { SkillElement } from '../../skill-elements/types/skill-element';
import { Skill } from '../../skills/types/skill';

export const FeedbackAssignedSkill = builder.simpleObject('FeedbackAssignedSkill', {
  description: 'フィードバックに紐づくスキル',
  fields: (t) => ({
    skill: t.field({ type: Skill, description: 'スキル' }),
    skillElements: t.field({ type: [SkillElement], description: 'スキル要素' }),
  }),
});
