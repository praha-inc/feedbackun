import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { and, eq } from 'drizzle-orm';
import { err, ok, ResultAsync } from 'neverthrow';

import { SlackChannelId } from '../../slack-channels';
import { SlackUserId } from '../../slack-users';
import { SlackMessage } from '../models/slack-message';
import { SlackMessageId } from '../models/slack-message-id';

export type FindSlackMessageBySlackChannelIdAndSlackUserIdAndSlackMessageTsInput = {
  slackChannelId: SlackChannelId;
  slackUserId: SlackUserId;
  slackMessageTs: string;
};

export class FindSlackMessageBySlackChannelIdAndSlackUserIdAndSlackMessageTsNotFoundError extends CustomError({
  name: 'FindSlackMessageBySlackChannelIdAndSlackUserIdAndSlackMessageTsNotFoundError',
  message: 'Does not exist slack message.',
}) {}

export class FindSlackMessageBySlackChannelIdAndSlackUserIdAndSlackMessageTsUnexpectedError extends CustomError({
  name: 'FindSlackMessageBySlackChannelIdAndSlackUserIdAndSlackMessageTsUnexpectedError',
  message: 'Failed to find slack message.',
}) {}

export type FindSlackMessageBySlackChannelIdAndSlackUserIdAndSlackMessageTsError = (
  | FindSlackMessageBySlackChannelIdAndSlackUserIdAndSlackMessageTsNotFoundError
  | FindSlackMessageBySlackChannelIdAndSlackUserIdAndSlackMessageTsUnexpectedError
);

export type FindSlackMessageBySlackChannelIdAndSlackUserIdAndSlackMessageTs = (
  input: FindSlackMessageBySlackChannelIdAndSlackUserIdAndSlackMessageTsInput,
) => ResultAsync<SlackMessage, FindSlackMessageBySlackChannelIdAndSlackUserIdAndSlackMessageTsError>;

export const findSlackMessageBySlackChannelIdAndSlackUserIdAndSlackMessageTs: FindSlackMessageBySlackChannelIdAndSlackUserIdAndSlackMessageTs = input => {
  const result = ResultAsync.fromPromise(
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
    error => new FindSlackMessageBySlackChannelIdAndSlackUserIdAndSlackMessageTsUnexpectedError({ cause: error }),
  );

  return result
    .andThen(slackUser => {
      if (!slackUser) return err(new FindSlackMessageBySlackChannelIdAndSlackUserIdAndSlackMessageTsNotFoundError());
      return ok(new SlackMessage({
        id: SlackMessageId.create({ value: slackUser.id })._unsafeUnwrap(),
        slackChannelId: SlackChannelId.create({ value: slackUser.slackChannelId })._unsafeUnwrap(),
        slackUserId: SlackUserId.create({ value: slackUser.slackUserId })._unsafeUnwrap(),
        text: slackUser.text,
        ts: slackUser.ts,
      }));
    });
};
