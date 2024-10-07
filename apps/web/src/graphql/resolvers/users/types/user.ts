import { builder } from '../../../core/builder';

export const User = builder.simpleObject('User', {
  description: 'ユーザー',
  fields: (t) => ({
    id: t.id({ description: 'ユーザーID' }),
    name: t.string({ description: 'ユーザー名' }),
    icon: t.string({ description: 'ユーザーアイコン' }),
  }),
});
