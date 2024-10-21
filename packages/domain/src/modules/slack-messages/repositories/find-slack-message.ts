import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { and, eq } from 'drizzle-orm';
import { err, ok, ResultAsync } from 'neverthrow';
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

export type FindSlackMessageInput = (
  | FindSlackMessageInputSlackChannelIdAndSlackUserIdAndSlackMessageTs
);

export class FindSlackMessageNotFoundError extends CustomError({
  name: 'FindSlackMessageNotFoundError',
  message: 'Does not exist slack message.',
}) {}

export class FindSlackMessageUnexpectedError extends CustomError({
  name: 'FindSlackMessageUnexpectedError',
  message: 'Failed to find slack message.',
}) {}

export type FindSlackMessageError = (
  | FindSlackMessageNotFoundError
  | FindSlackMessageUnexpectedError
);

export type FindSlackMessage = (
  input: FindSlackMessageInput,
) => ResultAsync<SlackMessage, FindSlackMessageError>;

const findBySlackChannelIdAndSlackUserIdAndSlackMessageTs = ResultAsync.fromThrowable((input: FindSlackMessageInputSlackChannelIdAndSlackUserIdAndSlackMessageTs) =>
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
);

export const findSlackMessage: FindSlackMessage = (input) => {
  return match(input)
    .with({ type: 'slack-channel-id-and-slack-user-id-and-slack-message-ts' }, (input) => findBySlackChannelIdAndSlackUserIdAndSlackMessageTs(input))
    .exhaustive()
    .mapErr((error) => new FindSlackMessageUnexpectedError({ cause: error }))
    .andThen((row) => {
      if (!row) return err(new FindSlackMessageNotFoundError());
      return ok(new SlackMessage({
        id: SlackMessageId.reconstruct(row.id),
        slackChannelId: SlackChannelId.reconstruct(row.slackChannelId),
        slackUserId: SlackUserId.reconstruct(row.slackUserId),
        text: row.text,
        ts: row.ts,
      }));
    });
};
