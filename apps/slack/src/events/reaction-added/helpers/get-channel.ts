import { ResultAsync } from 'neverthrow';

import type { SlackChannelId } from '@feedbackun/package-domain';
import type { SlackAPIClient } from 'slack-edge';

export const getChannel = ResultAsync.fromThrowable(async (
  client: SlackAPIClient,
  channelId: SlackChannelId,
) => {
  return await client.conversations.info({ channel: channelId.value });
});
