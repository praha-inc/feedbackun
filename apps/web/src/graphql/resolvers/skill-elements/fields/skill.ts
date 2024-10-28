import { builder } from '../../../core/builder';
import { skillElementSkill } from '../../../usecases/skill-elements/fields/skill';
import { Skill } from '../../skills/types/skill';
import { SkillElement } from '../types/skill-element';

builder.objectField(SkillElement, 'skill', (t) => t.field({
  type: Skill,
  description: 'スキル要素に紐づくスキル',
  resolve: async (skillElement) => {
    const result = await skillElementSkill({
      skillElementId: skillElement.id,
    });

    if (result.isOk()) {
      return result.value;
    }

    throw result.error;
  },
}));
