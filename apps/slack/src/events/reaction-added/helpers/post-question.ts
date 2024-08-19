import { ResultAsync } from 'neverthrow';

import type { SlackChannelId, SlackUserId } from '@feedbackun/package-domain';
import type { SlackAPIClient } from 'slack-edge';

export const postQuestion = ResultAsync.fromThrowable(async (
  client: SlackAPIClient,
  channelId: SlackChannelId,
  reactionUserId: SlackUserId,
  messageTs: string,
) => {
  const link = await client.chat.getPermalink({
    channel: channelId.value,
    message_ts: messageTs,
  });

  await client.chat.postEphemeral({
    channel: channelId.value,
    user: reactionUserId.value,
    text: '良いと思ったことをフィードバックして欲しいにゃ！',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `<${link.permalink}|メッセージ>へのフィードバックをお願いするにゃん！`,
        },
      },
      {
        type: 'input',
        label: {
          type: 'plain_text',
          text: 'どういう所が良かったのかにゃ？',
        },
        element: {
          type: 'plain_text_input',
          multiline: true,
        },
      },
      {
        type: 'input',
        label: {
          type: 'plain_text',
          text: 'どのスキルに該当しそうかにゃ？',
        },
        element: {
          type: 'multi_static_select',
          placeholder: {
            type: 'plain_text',
            text: 'スキルを選択する',
          },
          options: [
            {
              text: {
                type: 'plain_text',
                text: 'スキル1-1 (ミスが起きた際、自力ですぐに修正できる)',
              },
            },
          ],
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: ' ',
        },
        accessory: {
          type: 'button',
          style: 'primary',
          text: {
            type: 'plain_text',
            text: '送信するにゃ！',
          },
        },
      },
    ],
  });
});
