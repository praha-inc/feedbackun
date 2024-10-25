import { builder } from '../../../core/builder';
import { slackChannelSlackTeam } from '../../../usecases/slack-channels/fields/slack-team';
import { SlackTeam } from '../../slack-teams/types/slack-team';
import { SlackChannel } from '../types/slack-channel';

builder.objectField(SlackChannel, 'slackTeam', (t) => t.field({
  type: SlackTeam,
  description: 'Slackチャンネルが所属するSlackチーム',
  resolve: async (slackChannel) => {
    const result = await slackChannelSlackTeam({
      slackChannelId: slackChannel.id,
    });

    if (result.isOk()) {
      return result.value;
    }

    throw result.error;
  },
}));
