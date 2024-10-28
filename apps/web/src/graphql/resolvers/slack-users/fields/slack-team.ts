import { builder } from '../../../core/builder';
import { slackUserSlackTeam } from '../../../usecases/slack-users/fields/slack-team';
import { SlackTeam } from '../../slack-teams/types/slack-team';
import { SlackUser } from '../types/slack-user';

builder.objectField(SlackUser, 'slackTeam', (t) => t.field({
  type: SlackTeam,
  description: 'Slackユーザーが所属するSlackチーム',
  resolve: async (slackUser) => {
    const result = await slackUserSlackTeam({
      slackUserId: slackUser.id,
    });

    if (result.isOk()) {
      return result.value;
    }

    throw result.error;
  },
}));
