import { ResultAsync } from 'neverthrow';

import type { SlackChannelId } from '@feedbackun/package-domain';
import type { SlackAPIClient } from 'slack-edge';

export const getMessage = ResultAsync.fromThrowable(async (
  client: SlackAPIClient,
  channelId: SlackChannelId,
  ts: string,
) => {
  return await client.conversations.history({ channel: channelId.value, latest: ts, inclusive: true, limit: 1 });
});
