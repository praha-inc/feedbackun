import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { ok, ResultAsync } from 'neverthrow';

import { SlackTeamId } from '../../slack-teams';
import { SlackChannel } from '../models/slack-channel';
import { SlackChannelId } from '../models/slack-channel-id';

export type SaveSlackChannelInput = SlackChannel;

export class SaveSlackChannelUnexpectedError extends CustomError({
  name: 'SaveSlackChannelUnexpectedError',
  message: 'Failed to save slack channel.',
}) {}

export type SaveSlackChannelError = (
  | SaveSlackChannelUnexpectedError
);

export type SaveSlackChannel = (
  input: SaveSlackChannelInput,
) => ResultAsync<SlackChannel, SaveSlackChannelError>;

export const saveSlackChannel: SaveSlackChannel = (input) => {
  const result = ResultAsync.fromPromise(
    database()
      .insert(schema.slackChannels)
      .values({
        id: input.id.value,
        slackTeamId: input.slackTeamId.value,
        name: input.name,
      })
      .returning()
      .get(),
    (error) => new SaveSlackChannelUnexpectedError({ cause: error }),
  );

  return result
    .andThen((row) => {
      return ok(new SlackChannel({
        id: SlackChannelId.create({ value: row.id })._unsafeUnwrap(),
        slackTeamId: SlackTeamId.create({ value: row.slackTeamId })._unsafeUnwrap(),
        name: row.name,
      }));
    });
};
