import { SlackChannelId } from '@feedbackun/package-domain';
import { bindSync, doSync, structSync } from '@feedbackun/package-neverthrow';
import { ok, ResultAsync } from 'neverthrow';

import type { Env } from '../../types/env';
import type { BlockActionAckHandler } from 'slack-edge';

export const discardFeedbackHandler: BlockActionAckHandler<'button', Env> = async ({
  payload,
  context,
}) => {
  await doSync
    .andThen(bindSync('container', () => structSync({
      channelId: SlackChannelId.create(payload.container.channel_id ?? ''),
      messageTs: ok(payload.container.message_ts!),
    })))
    .asyncAndThen(ResultAsync.fromThrowable(async ({ container }) => {
      return context.client.chat.delete({
        channel: container.channelId.value,
        ts: container.messageTs,
      });
    }));
};
