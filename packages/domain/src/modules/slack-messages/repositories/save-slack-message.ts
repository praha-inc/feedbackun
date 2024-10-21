import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { doAsync } from '@feedbackun/package-neverthrow';
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

const insrtSlackMessage = (slackMessage: SlackMessage) => ResultAsync.fromPromise(
  database()
    .insert(schema.slackMessages)
    .values({
      id: slackMessage.id.value,
      slackChannelId: slackMessage.slackChannelId.value,
      slackUserId: slackMessage.slackUserId.value,
      text: slackMessage.text,
      ts: slackMessage.ts,
    })
    .returning()
    .get(),
  (error) => new SaveSlackMessageUnexpectedError({ cause: error }),
);

export const saveSlackMessage: SaveSlackMessage = (input) => {
  return doAsync
    .andThen(() => insrtSlackMessage(input))
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
