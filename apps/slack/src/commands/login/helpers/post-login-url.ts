import { R } from '@praha/byethrow';
import { UnexpectedError } from '@praha/error-factory/presets';

import type { SlackChannelId, SlackUserId } from '@feedbackun/package-domain';
import type { SlackAPIClient } from 'slack-edge';

export const postLoginUrl = R.fn({
  try: async (
    client: SlackAPIClient,
    channelId: SlackChannelId,
    slackUserId: SlackUserId,
    url: string,
  ) => {
    await client.chat.postEphemeral({
      channel: channelId.value,
      user: slackUserId.value,
      text: 'このリンクからログインできるにゃ！',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `<${url}|このリンク>からログインできるにゃ！\n有効期限があるから期限が切れる前にログインして欲しいにゃん！`,
          },
        },
      ],
    });
  },
  catch: (error) => new UnexpectedError({ cause: error }),
});
