import { ResultAsync } from 'neverthrow';

import type { SlackChannelId } from '@feedbackun/package-domain';
import type { SlackAPIClient } from 'slack-edge';

export const postSuccessMessage = ResultAsync.fromThrowable(async (
  client: SlackAPIClient,
  slackChannelId: SlackChannelId,
  messageTs: string,
) => {
  await client.chat.postMessage({
    channel: slackChannelId.value,
    thread_ts: messageTs,
    text: 'フィードバックありがとうなのにゃ！',
  });
});
