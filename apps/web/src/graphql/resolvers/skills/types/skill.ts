import { builder } from '../../../core/builder';

export const Skill = builder.simpleObject('Skill', {
  description: 'スキル',
  fields: (t) => ({
    id: t.id({ description: 'スキルID' }),
    level: t.int({ description: 'スキルレベル' }),
    name: t.string({ description: 'スキル名' }),
  }),
});
