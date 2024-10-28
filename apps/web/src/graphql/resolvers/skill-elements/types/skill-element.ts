import { builder } from '../../../core/builder';

export const SkillElement = builder.simpleObject('SkillElement', {
  description: 'スキル要素',
  fields: (t) => ({
    id: t.id({ description: 'スキル要素ID' }),
    order: t.int({ description: 'スキル要素番号' }),
    name: t.string({ description: 'スキル要素名' }),
  }),
});
