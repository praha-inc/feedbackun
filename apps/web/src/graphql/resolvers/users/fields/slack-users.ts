import { builder } from '../../../core/builder';
import { userSlackUsers } from '../../../usecases/users/fields/slack-users';
import { SlackUser } from '../../slack-users/types/slack-user';
import { User } from '../types/user';

builder.objectField(User, 'slackUsers', (t) => t.field({
  type: [SlackUser],
  description: 'ユーザーに紐づくSlackユーザー',
  resolve: async (user) => {
    const result = await userSlackUsers({
      userId: user.id,
    });

    if (result.isOk()) {
      return result.value;
    }

    throw result.error;
  },
}));
