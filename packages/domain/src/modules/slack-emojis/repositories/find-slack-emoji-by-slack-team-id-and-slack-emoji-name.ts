import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { and, eq } from 'drizzle-orm';
import { err, ok, ResultAsync } from 'neverthrow';

import { SlackTeamId } from '../../slack-teams';
import { SlackEmoji } from '../models/slack-emoji';
import { SlackEmojiId } from '../models/slack-emoji-id';
import { SlackEmojiType } from '../models/slack-emoji-type';

export type FindSlackEmojiBySlackTeamIdAndSlackEmojiNameInput = {
  slackTeamId: SlackTeamId;
  name: string;
};

export class FindSlackEmojiBySlackTeamIdAndSlackEmojiNameNotFoundError extends CustomError({
  name: 'FindSlackEmojiBySlackTeamIdAndSlackEmojiNameNotFoundError',
  message: 'Does not exist slack emoji.',
}) {}

export class FindSlackEmojiBySlackTeamIdAndSlackEmojiNameUnexpectedError extends CustomError({
  name: 'FindSlackEmojiBySlackTeamIdAndSlackEmojiNameUnexpectedError',
  message: 'Failed to find slack emoji.',
}) {}

export type FindSlackEmojiBySlackTeamIdAndSlackEmojiNameError = (
  | FindSlackEmojiBySlackTeamIdAndSlackEmojiNameNotFoundError
  | FindSlackEmojiBySlackTeamIdAndSlackEmojiNameUnexpectedError
);

export type FindSlackEmojiBySlackTeamIdAndSlackEmojiName = (
  input: FindSlackEmojiBySlackTeamIdAndSlackEmojiNameInput,
) => ResultAsync<SlackEmoji, FindSlackEmojiBySlackTeamIdAndSlackEmojiNameError>;

export const findSlackEmojiBySlackTeamIdAndSlackEmojiName: FindSlackEmojiBySlackTeamIdAndSlackEmojiName = input => {
  const result = ResultAsync.fromPromise(
    database()
      .select()
      .from(schema.slackEmojis)
      .where(
        and(
          eq(schema.slackEmojis.slackTeamId, input.slackTeamId.value),
          eq(schema.slackEmojis.name, input.name),
        ),
      )
      .get(),
    error => new FindSlackEmojiBySlackTeamIdAndSlackEmojiNameUnexpectedError({ cause: error }),
  );

  return result
    .andThen(slackEmoji => {
      if (!slackEmoji) return err(new FindSlackEmojiBySlackTeamIdAndSlackEmojiNameNotFoundError());
      return ok(new SlackEmoji({
        id: SlackEmojiId.create({ value: slackEmoji.id })._unsafeUnwrap(),
        type: SlackEmojiType.create({ value: slackEmoji.type })._unsafeUnwrap(),
        slackTeamId: SlackTeamId.create({ value: slackEmoji.slackTeamId })._unsafeUnwrap(),
        name: slackEmoji.name,
      }));
    });
};
