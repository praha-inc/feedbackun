import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { ok, ResultAsync } from 'neverthrow';

import { SlackEmojiId } from '../../slack-emojis';
import { SlackMessageId } from '../../slack-messages';
import { SlackUserId } from '../../slack-users';
import { SlackReaction } from '../models/slack-reaction';
import { SlackReactionId } from '../models/slack-reaction-id';

export type SaveSlackReactionInput = SlackReaction;

export class SaveSlackReactionUnexpectedError extends CustomError({
  name: 'SaveSlackReactionUnexpectedError',
  message: 'Failed to save slack reaction.',
}) {}

export type SaveSlackReactionError = (
  | SaveSlackReactionUnexpectedError
);

export type SaveSlackReaction = (
  input: SaveSlackReactionInput,
) => ResultAsync<SlackReaction, SaveSlackReactionError>;

export const saveSlackReaction: SaveSlackReaction = (input) => {
  const result = ResultAsync.fromPromise(
    database()
      .insert(schema.slackReactions)
      .values({
        id: input.id.value,
        slackMessageId: input.slackMessageId.value,
        slackEmojiId: input.slackEmojiId.value,
        slackUserId: input.slackUserId.value,
        ts: input.ts,
      })
      .returning()
      .get(),
    (error) => new SaveSlackReactionUnexpectedError({ cause: error }),
  );

  return result
    .andThen((row) => {
      return ok(new SlackReaction({
        id: SlackReactionId.create({ value: row.id })._unsafeUnwrap(),
        slackMessageId: SlackMessageId.create({ value: row.slackMessageId })._unsafeUnwrap(),
        slackEmojiId: SlackEmojiId.create({ value: row.slackEmojiId })._unsafeUnwrap(),
        slackUserId: SlackUserId.create({ value: row.slackUserId })._unsafeUnwrap(),
        ts: row.ts,
      }));
    });
};
