import { ResultAsync } from 'neverthrow';

import type { SlackChannelId } from '@feedbackun/package-domain';
import type { SlackAPIClient } from 'slack-edge';

export const postFailureMessage = ResultAsync.fromThrowable(async (
  client: SlackAPIClient,
  slackChannelId: SlackChannelId,
  messageTs: string,
) => {
  await client.chat.postMessage({
    channel: slackChannelId.value,
    thread_ts: messageTs,
    text: '何らかの原因で保存に失敗したのにゃ。。。',
  });
});
