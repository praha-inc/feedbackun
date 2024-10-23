import { UserType } from './user-type';
import { builder } from '../../../core/builder';

export const User = builder.simpleObject('User', {
  description: 'ユーザー',
  fields: (t) => ({
    id: t.id({ description: 'ユーザーID' }),
    type: t.field({ type: UserType, description: 'ユーザー種別' }),
    name: t.string({ description: 'ユーザー名' }),
    icon: t.string({ description: 'ユーザーアイコン' }),
  }),
});
