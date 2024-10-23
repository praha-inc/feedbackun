import { builder } from '../../../core/builder';
import { auth } from '../../../plugins/auth';
import { userById } from '../../../usecases/users/queries/user-by-id';
import { User } from '../types/user';

builder.queryField('me', (t) => t.field({
  type: User,
  description: 'ログインユーザーを取得する',
  resolve: async () => {
    const result = await userById({
      userId: auth().id.value,
    });

    if (result.isOk()) {
      return result.value;
    }

    throw result.error;
  },
}));
