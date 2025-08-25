import { database, schema } from '@feedbackun/package-database';
import { doAsync } from '@feedbackun/package-neverthrow';
import { ErrorFactory } from '@praha/error-factory';
import { ok, ResultAsync } from 'neverthrow';

import { SlackChannelId } from '../../slack-channels';
import { SlackUserId } from '../../slack-users';
import { SlackMessage } from '../models/slack-message';
import { SlackMessageId } from '../models/slack-message-id';

export type SaveSlackMessageInput = SlackMessage;

export class SaveSlackMessageUnexpectedError extends ErrorFactory({
  name: 'SaveSlackMessageUnexpectedError',
  message: 'Failed to save slack message.',
}) {}

export type SaveSlackMessageError = (
  | SaveSlackMessageUnexpectedError
);

export type SaveSlackMessage = (
  input: SaveSlackMessageInput,
) => ResultAsync<SlackMessage, SaveSlackMessageError>;

const insertSlackMessage = (slackMessage: SlackMessage) => ResultAsync.fromPromise(
  database()
    .insert(schema.slackMessages)
    .values({
      id: slackMessage.id.value,
      slackChannelId: slackMessage.slackChannelId.value,
      slackUserId: slackMessage.slackUserId.value,
      text: slackMessage.text,
      ts: slackMessage.ts,
      threadTs: slackMessage.threadTs,
    })
    .returning()
    .get(),
  (error) => new SaveSlackMessageUnexpectedError({ cause: error }),
);

export const saveSlackMessage: SaveSlackMessage = (input) => {
  return doAsync
    .andThen(() => insertSlackMessage(input))
    .andThen((row) => {
      return ok(new SlackMessage({
        id: SlackMessageId.reconstruct(row.id),
        slackChannelId: SlackChannelId.reconstruct(row.slackChannelId),
        slackUserId: SlackUserId.reconstruct(row.slackUserId),
        text: row.text,
        ts: row.ts,
        threadTs: row.threadTs,
      }));
    });
};
