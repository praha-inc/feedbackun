import { SlackChannelId } from '@feedbackun/package-domain';
import { R } from '@praha/byethrow';
import { UnexpectedError } from '@praha/error-factory/presets';

import type { Env } from '../../types/env';
import type { BlockActionAckHandler } from 'slack-edge';

export const discardFeedbackHandler: BlockActionAckHandler<'button', Env> = async ({
  payload,
  context,
}) => {
  await R.pipe(
    R.do(),
    R.bind('container', () => R.collect({
      channelId: SlackChannelId.create('channel_id' in payload.container ? payload.container.channel_id : ''),
      messageTs: R.succeed('message_ts' in payload.container ? payload.container.message_ts : ''),
    })),
    R.andThen(({ container }) => {
      return R.try({
        try: async () => {
          return context.client.chat.delete({
            channel: container.channelId.value,
            ts: container.messageTs,
          });
        },
        catch: (error) => new UnexpectedError({ cause: error }),
      });
    }),
  );
};
