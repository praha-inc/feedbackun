import { R } from '@praha/byethrow';
import { UnexpectedError } from '@praha/error-factory/presets';

import type { SlackChannelId } from '@feedbackun/package-domain';
import type { SlackAPIClient } from 'slack-edge';

export const getMessage = R.fn({
  try: async (
    client: SlackAPIClient,
    channelId: SlackChannelId,
    ts: string,
  ) => {
    return await client.conversations.replies({
      channel: channelId.value,
      ts,
      limit: 1,
    });
  },
  catch: (error) => new UnexpectedError({ cause: error }),
});
