import { R } from '@praha/byethrow';

import { builder } from '../../../core/builder';
import { userSlackUsers } from '../../../usecases/users/fields/slack-users';
import { SlackUser } from '../../slack-users/types/slack-user';
import { User } from '../types/user';

builder.objectField(User, 'slackUsers', (t) => t.field({
  type: [SlackUser],
  description: 'ユーザーに紐づくSlackユーザー',
  resolve: async (user) => {
    return await R.pipe(
      userSlackUsers({
        userId: user.id,
      }),
      R.unwrap(),
    );
  },
}));
