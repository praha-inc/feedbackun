import { R } from '@praha/byethrow';

import { builder } from '../../../core/builder';
import { slackMessageUrl } from '../../../usecases/slack-message/fields/url';
import { SlackMessage } from '../types/slack-message';

builder.objectField(SlackMessage, 'url', (t) => t.string({
  description: 'SlackメッセージへのURL',
  resolve: async (slackMessage) => {
    return R.pipe(
      slackMessageUrl({
        slackMessageId: slackMessage.id,
      }),
      R.unwrap(),
    );
  },
}));
