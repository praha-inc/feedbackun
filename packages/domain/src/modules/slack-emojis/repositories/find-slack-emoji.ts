import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import { and, eq } from 'drizzle-orm';
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

const findBySlackTeamIdAndSlackEmojiName = R.fn({
  try: (input: FindSlackEmojiInputSlackTeamIdAndSlackEmojiName) =>
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
  catch: (error) => new FindSlackEmojiUnexpectedError({ cause: error }),
});

export type FindSlackEmojiInput = (
  | FindSlackEmojiInputSlackTeamIdAndSlackEmojiName
);

export class FindSlackEmojiNotFoundError extends ErrorFactory({
  name: 'FindSlackEmojiNotFoundError',
  message: 'Does not exist slack emoji.',
}) {}

export class FindSlackEmojiUnexpectedError extends ErrorFactory({
  name: 'FindSlackEmojiUnexpectedError',
  message: 'Failed to find slack emoji.',
}) {}

export type FindSlackEmojiError = (
  | FindSlackEmojiNotFoundError
  | FindSlackEmojiUnexpectedError
);

export type FindSlackEmoji = (
  input: FindSlackEmojiInput,
) => R.ResultAsync<SlackEmoji, FindSlackEmojiError>;

export const findSlackEmoji: FindSlackEmoji = (input) => {
  return R.pipe(
    match(input)
      .with({ type: 'slack-team-id-and-slack-emoji-name' }, findBySlackTeamIdAndSlackEmojiName)
      .exhaustive(),
    R.andThen((row) => {
      if (!row) return R.fail(new FindSlackEmojiNotFoundError());
      return R.succeed(new SlackEmoji({
        id: SlackEmojiId.reconstruct(row.id),
        type: SlackEmojiType.reconstruct(row.type),
        slackTeamId: SlackTeamId.reconstruct(row.slackTeamId),
        name: row.name,
      }));
    }),
  );
};
