import { R } from '@praha/byethrow';
import { UnexpectedError } from '@praha/error-factory/presets';

import type { SlackChannelId } from '@feedbackun/package-domain';
import type { SlackAPIClient } from 'slack-edge';

export const completeQuestion = R.fn({
  try: async (
    client: SlackAPIClient,
    slackChannelId: SlackChannelId,
    messageTs: string,
  ) => {
    const { messages } = await client.conversations.history({
      channel: slackChannelId.value,
      latest: messageTs,
      inclusive: true,
      limit: 1,
    });

    await client.chat.update({
      channel: slackChannelId.value,
      ts: messageTs,
      text: messages![0]!.text!,
      blocks: [
        messages![0]!.blocks![0]!,
      ],
    });
  },
  catch: (error) => new UnexpectedError({ cause: error }),
});
