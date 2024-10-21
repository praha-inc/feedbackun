import { ResultAsync } from 'neverthrow';

import type { SlackChannelId, SlackUserId } from '@feedbackun/package-domain';
import type { SlackAPIClient } from 'slack-edge';

export const postLoginUrl = ResultAsync.fromThrowable(async (
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
});
