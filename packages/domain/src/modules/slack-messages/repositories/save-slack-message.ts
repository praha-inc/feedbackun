import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { ok, ResultAsync } from 'neverthrow';

import { SlackChannelId } from '../../slack-channels';
import { SlackUserId } from '../../slack-users';
import { SlackMessage } from '../models/slack-message';
import { SlackMessageId } from '../models/slack-message-id';

export type SaveSlackMessageInput = SlackMessage;

export class SaveSlackMessageUnexpectedError extends CustomError({
  name: 'SaveSlackMessageUnexpectedError',
  message: 'Failed to save slack message.',
}) {}

export type SaveSlackMessageError = (
  | SaveSlackMessageUnexpectedError
);

export type SaveSlackMessage = (
  input: SaveSlackMessageInput,
) => ResultAsync<SlackMessage, SaveSlackMessageError>;

export const saveSlackMessage: SaveSlackMessage = (input) => {
  const result = ResultAsync.fromPromise(
    database()
      .insert(schema.slackMessages)
      .values({
        id: input.id.value,
        slackChannelId: input.slackChannelId.value,
        slackUserId: input.slackUserId.value,
        text: input.text,
        ts: input.ts,
      })
      .returning()
      .get(),
    (error) => new SaveSlackMessageUnexpectedError({ cause: error }),
  );

  return result
    .andThen((row) => {
      return ok(new SlackMessage({
        id: SlackMessageId.create(row.id)._unsafeUnwrap(),
        slackChannelId: SlackChannelId.create(row.slackChannelId)._unsafeUnwrap(),
        slackUserId: SlackUserId.create(row.slackUserId)._unsafeUnwrap(),
        text: row.text,
        ts: row.ts,
      }));
    });
};
