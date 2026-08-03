import { R } from '@praha/byethrow';
import { UnexpectedError } from '@praha/error-factory/presets';

import type { SlackChannelId } from '@feedbackun/package-domain';
import type { SlackAPIClient } from 'slack-edge';

export const postSuccessMessage = R.fn({
  try: async (
    client: SlackAPIClient,
    slackChannelId: SlackChannelId,
    messageTs: string,
  ) => {
    await client.chat.postMessage({
      channel: slackChannelId.value,
      thread_ts: messageTs,
      text: 'フィードバックありがとうなのにゃ！',
    });
  },
  catch: (error) => new UnexpectedError({ cause: error }),
});
