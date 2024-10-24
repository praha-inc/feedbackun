import { builder } from '../../../core/builder';
import { slackMessageSlackChannel } from '../../../usecases/slack-message/fields/slack-channel';
import { SlackChannel } from '../../slack-channels/types/slack-channel';
import { SlackMessage } from '../types/slack-message';

builder.objectField(SlackMessage, 'slackChannel', (t) => t.field({
  type: SlackChannel,
  description: 'フィードバックを受けたSlackメッセージ',
  resolve: async (slackMessage) => {
    const result = await slackMessageSlackChannel({
      slackMessageId: slackMessage.id,
    });

    if (result.isOk()) {
      return result.value;
    }

    throw result.error;
  },
}));
