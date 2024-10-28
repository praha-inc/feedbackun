import { builder } from '../../../core/builder';
import { userById } from '../../../usecases/users/queries/user-by-id';
import { User } from '../types/user';

builder.queryField('userById', (t) => t.field({
  type: User,
  description: 'ユーザーを取得する',
  args: {
    userId: t.arg.id({ description: 'ユーザーID' }),
  },
  resolve: async (_, args) => {
    const result = await userById({
      userId: args.userId,
    });

    if (result.isOk()) {
      return result.value;
    }

    throw result.error;
  },
}));
