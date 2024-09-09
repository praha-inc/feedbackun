import { ResultAsync } from 'neverthrow';

import type { SlackChannelId, SlackUserId } from '@feedbackun/package-domain';
import type { SlackAPIClient } from 'slack-edge';

export const postFailureMessage = ResultAsync.fromThrowable(async (
  client: SlackAPIClient,
  slackChannelId: SlackChannelId,
  slackUserId: SlackUserId,
) => {
  await client.chat.postEphemeral({
    channel: slackChannelId.value,
    user: slackUserId.value,
    text: '何らかの原因で保存に失敗したのにゃ。。。',
  });
});
