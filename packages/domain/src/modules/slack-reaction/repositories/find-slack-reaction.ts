import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { and, eq } from 'drizzle-orm';
import { err, ok, ResultAsync } from 'neverthrow';
import { match } from 'ts-pattern';

import { SlackEmojiId } from '../../slack-emojis';
import { SlackMessageId } from '../../slack-messages';
import { SlackUserId } from '../../slack-users';
import { SlackReaction } from '../models/slack-reaction';
import { SlackReactionId } from '../models/slack-reaction-id';

export type FindSlackReactionInputSlackMessageIdAndSlackEmojiIdAndSlackUserId = {
  type: 'slack-message-id-and-slack-emoji-id-and-slack-user-id';
  slackMessageId: SlackMessageId;
  slackEmojiId: SlackEmojiId;
  slackUserId: SlackUserId;
};

export type FindSlackReactionInput = (
  | FindSlackReactionInputSlackMessageIdAndSlackEmojiIdAndSlackUserId
);

export class FindSlackReactionNotFoundError extends CustomError({
  name: 'FindSlackReactionNotFoundError',
  message: 'Does not exist slack reaction.',
}) {}

export class FindSlackReactionUnexpectedError extends CustomError({
  name: 'FindSlackReactionUnexpectedError',
  message: 'Failed to find slack reaction.',
}) {}

export type FindSlackReactionError = (
  | FindSlackReactionNotFoundError
  | FindSlackReactionUnexpectedError
);

export type FindSlackReaction = (
  input: FindSlackReactionInput,
) => ResultAsync<SlackReaction, FindSlackReactionError>;

export const findSlackReaction: FindSlackReaction = input => {
  const result = ResultAsync.fromThrowable((input: FindSlackReactionInputSlackMessageIdAndSlackEmojiIdAndSlackUserId) =>
    database()
      .select()
      .from(schema.slackReactions)
      .where(
        and(
          eq(schema.slackReactions.slackMessageId, input.slackMessageId.value),
          eq(schema.slackReactions.slackEmojiId, input.slackEmojiId.value),
          eq(schema.slackReactions.slackUserId, input.slackUserId.value),
        ),
      )
      .get(),
  );

  return match(input)
    .with({ type: 'slack-message-id-and-slack-emoji-id-and-slack-user-id' }, input => result(input))
    .exhaustive()
    .mapErr(error => new FindSlackReactionUnexpectedError({ cause: error }))
    .andThen(row => {
      if (!row) return err(new FindSlackReactionNotFoundError());
      return ok(new SlackReaction({
        id: SlackReactionId.create({ value: row.id })._unsafeUnwrap(),
        slackMessageId: SlackMessageId.create({ value: row.slackMessageId })._unsafeUnwrap(),
        slackEmojiId: SlackEmojiId.create({ value: row.slackEmojiId })._unsafeUnwrap(),
        slackUserId: SlackUserId.create({ value: row.slackUserId })._unsafeUnwrap(),
        ts: row.ts,
      }));
    });
};
