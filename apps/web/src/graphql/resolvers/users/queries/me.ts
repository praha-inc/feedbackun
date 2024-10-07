import { builder } from '../../../core/builder';
import { User } from '../types/user';

builder.queryField('me', (t) => t.field({
  type: User,
  description: 'ログインユーザーを取得する',
  resolve: () => {
    return {
      id: 'id',
      name: 'name',
      icon: 'icon',
    };
  },
}));
