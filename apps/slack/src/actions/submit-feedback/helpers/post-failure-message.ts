import { R } from '@praha/byethrow';
import { UnexpectedError } from '@praha/error-factory/presets';

import type { SlackChannelId } from '@feedbackun/package-domain';
import type { SlackAPIClient } from 'slack-edge';

export const postFailureMessage = R.fn({
  try: async (
    client: SlackAPIClient,
    slackChannelId: SlackChannelId,
    messageTs: string,
  ) => {
    await client.chat.postMessage({
      channel: slackChannelId.value,
      thread_ts: messageTs,
      text: '何らかの原因で保存に失敗したのにゃ。。。',
    });
  },
  catch: (error) => new UnexpectedError({ cause: error }),
});
