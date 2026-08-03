import { R } from '@praha/byethrow';
import { UnexpectedError } from '@praha/error-factory/presets';

import type { SlackChannelId } from '@feedbackun/package-domain';
import type { SlackAPIClient } from 'slack-edge';

export const getChannel = R.fn({
  try: async (
    client: SlackAPIClient,
    channelId: SlackChannelId,
  ) => {
    return await client.conversations.info({ channel: channelId.value });
  },
  catch: (error) => new UnexpectedError({ cause: error }),
});
