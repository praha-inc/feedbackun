import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import { UnexpectedError } from '@praha/error-factory/presets';
import { and, eq } from 'drizzle-orm';
import { match } from 'ts-pattern';

import { SlackChannelId } from '../../slack-channels';
import { SlackUserId } from '../../slack-users';
import { SlackMessage } from '../models/slack-message';
import { SlackMessageId } from '../models/slack-message-id';

export type FindSlackMessageInputSlackChannelIdAndSlackUserIdAndSlackMessageTs = {
  type: 'slack-channel-id-and-slack-user-id-and-slack-message-ts';
  slackChannelId: SlackChannelId;
  slackUserId: SlackUserId;
  slackMessageTs: string;
};

const findBySlackChannelIdAndSlackUserIdAndSlackMessageTs = R.fn({
  try: (input: FindSlackMessageInputSlackChannelIdAndSlackUserIdAndSlackMessageTs) =>
    database()
      .select()
      .from(schema.slackMessages)
      .where(
        and(
          eq(schema.slackMessages.slackChannelId, input.slackChannelId.value),
          eq(schema.slackMessages.slackUserId, input.slackUserId.value),
          eq(schema.slackMessages.ts, input.slackMessageTs),
        ),
      )
      .get(),
  catch: (error) => new UnexpectedError({ cause: error }),
});

export type FindSlackMessageInput = (
  | FindSlackMessageInputSlackChannelIdAndSlackUserIdAndSlackMessageTs
);

export class FindSlackMessageNotFoundError extends ErrorFactory({
  name: 'FindSlackMessageNotFoundError',
  message: 'Does not exist slack message.',
}) {}

export type FindSlackMessageError = (
  | FindSlackMessageNotFoundError
  | UnexpectedError
);

export type FindSlackMessage = (
  input: FindSlackMessageInput,
) => R.ResultAsync<SlackMessage, FindSlackMessageError>;

export const findSlackMessage: FindSlackMessage = (input) => {
  return R.pipe(
    match(input)
      .with({ type: 'slack-channel-id-and-slack-user-id-and-slack-message-ts' }, findBySlackChannelIdAndSlackUserIdAndSlackMessageTs)
      .exhaustive(),
    R.andThen((row) => {
      if (!row) return R.fail(new FindSlackMessageNotFoundError());
      return R.succeed(new SlackMessage({
        id: SlackMessageId.reconstruct(row.id),
        slackChannelId: SlackChannelId.reconstruct(row.slackChannelId),
        slackUserId: SlackUserId.reconstruct(row.slackUserId),
        text: row.text,
        ts: row.ts,
        threadTs: row.threadTs,
      }));
    }),
  );
};
