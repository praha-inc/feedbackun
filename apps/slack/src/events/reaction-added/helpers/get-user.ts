import { ResultAsync } from 'neverthrow';

import type { SlackUserId } from '@feedbackun/package-domain';
import type { SlackAPIClient } from 'slack-edge';

export const getUser = ResultAsync.fromThrowable(async (
  client: SlackAPIClient,
  userId: SlackUserId,
) => {
  return await client.users.info({ user: userId.value });
});
