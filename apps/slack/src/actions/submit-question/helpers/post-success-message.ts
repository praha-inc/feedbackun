import { ResultAsync } from 'neverthrow';

import type { SlackChannelId, SlackUserId } from '@feedbackun/package-domain';
import type { SlackAPIClient } from 'slack-edge';

export const postSuccessMessage = ResultAsync.fromThrowable(async (
  client: SlackAPIClient,
  slackChannelId: SlackChannelId,
  slackUserId: SlackUserId,
) => {
  await client.chat.postEphemeral({
    channel: slackChannelId.value,
    user: slackUserId.value,
    text: 'フィードバックありがとうなのにゃ！',
  });
});
