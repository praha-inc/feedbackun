import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { and, eq } from 'drizzle-orm';
import { err, ok, ResultAsync } from 'neverthrow';
import { match } from 'ts-pattern';

import { SlackTeamId } from '../../slack-teams';
import { SlackEmoji } from '../models/slack-emoji';
import { SlackEmojiId } from '../models/slack-emoji-id';
import { SlackEmojiType } from '../models/slack-emoji-type';

export type FindSlackEmojiInputSlackTeamIdAndSlackEmojiName = {
  type: 'slack-team-id-and-slack-emoji-name';
  slackTeamId: SlackTeamId;
  name: string;
};

export type FindSlackEmojiInput = (
  | FindSlackEmojiInputSlackTeamIdAndSlackEmojiName
);

export class FindSlackEmojiNotFoundError extends CustomError({
  name: 'FindSlackEmojiNotFoundError',
  message: 'Does not exist slack emoji.',
}) {}

export class FindSlackEmojiUnexpectedError extends CustomError({
  name: 'FindSlackEmojiUnexpectedError',
  message: 'Failed to find slack emoji.',
}) {}

export type FindSlackEmojiError = (
  | FindSlackEmojiNotFoundError
  | FindSlackEmojiUnexpectedError
);

export type FindSlackEmoji = (
  input: FindSlackEmojiInput,
) => ResultAsync<SlackEmoji, FindSlackEmojiError>;

const findBySlackTeamIdAndSlackEmojiName = ResultAsync.fromThrowable((input: FindSlackEmojiInputSlackTeamIdAndSlackEmojiName) =>
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
);

export const findSlackEmoji: FindSlackEmoji = (input) => {
  return match(input)
    .with({ type: 'slack-team-id-and-slack-emoji-name' }, (input) => findBySlackTeamIdAndSlackEmojiName(input))
    .exhaustive()
    .mapErr((error) => new FindSlackEmojiUnexpectedError({ cause: error }))
    .andThen((row) => {
      if (!row) return err(new FindSlackEmojiNotFoundError());
      return ok(new SlackEmoji({
        id: SlackEmojiId.reconstruct(row.id),
        type: SlackEmojiType.reconstruct(row.type),
        slackTeamId: SlackTeamId.reconstruct(row.slackTeamId),
        name: row.name,
      }));
    });
};
