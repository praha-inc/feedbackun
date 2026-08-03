import { R } from '@praha/byethrow';

import { builder } from '../../../core/builder';
import { auth } from '../../../plugins/auth';
import { userById } from '../../../usecases/users/queries/user-by-id';
import { User } from '../types/user';

builder.queryField('me', (t) => t.field({
  type: User,
  description: 'ログインユーザーを取得する',
  resolve: async () => {
    return R.pipe(
      userById({
        userId: auth().id.value,
      }),
      R.unwrap(),
    );
  },
}));
