import { ResultAsync } from 'neverthrow';

import type { SlackChannelId } from '@feedbackun/package-domain';
import type { SlackAPIClient } from 'slack-edge';

export const deleteMessage = ResultAsync.fromThrowable(async (
  client: SlackAPIClient,
  slackChannelId: SlackChannelId,
  slackMessageTs: string,
) => {
  await client.chat.delete({
    channel: slackChannelId.value,
    ts: slackMessageTs,
  });
});
