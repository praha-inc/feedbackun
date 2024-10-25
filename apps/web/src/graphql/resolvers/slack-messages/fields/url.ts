import { builder } from '../../../core/builder';
import { slackMessageUrl } from '../../../usecases/slack-message/fields/url';
import { SlackMessage } from '../types/slack-message';

builder.objectField(SlackMessage, 'url', (t) => t.string({
  description: 'SlackメッセージへのURL',
  resolve: async (slackMessage) => {
    const result = await slackMessageUrl({
      slackMessageId: slackMessage.id,
    });

    if (result.isOk()) {
      return result.value;
    }

    throw result.error;
  },
}));
