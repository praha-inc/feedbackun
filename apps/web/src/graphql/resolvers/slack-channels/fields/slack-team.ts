import { R } from '@praha/byethrow';

import { builder } from '../../../core/builder';
import { slackChannelSlackTeam } from '../../../usecases/slack-channels/fields/slack-team';
import { SlackTeam } from '../../slack-teams/types/slack-team';
import { SlackChannel } from '../types/slack-channel';

builder.objectField(SlackChannel, 'slackTeam', (t) => t.field({
  type: SlackTeam,
  description: 'Slackチャンネルが所属するSlackチーム',
  resolve: async (slackChannel) => {
    return R.pipe(
      slackChannelSlackTeam({
        slackChannelId: slackChannel.id,
      }),
      R.unwrap(),
    );
  },
}));
