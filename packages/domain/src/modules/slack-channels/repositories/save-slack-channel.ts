import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { doAsync } from '@feedbackun/package-neverthrow';
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

const insertSlackChannel = (slackChannel: SlackChannel) => ResultAsync.fromPromise(
  database()
    .insert(schema.slackChannels)
    .values({
      id: slackChannel.id.value,
      slackTeamId: slackChannel.slackTeamId.value,
      name: slackChannel.name,
    })
    .returning()
    .get(),
  (error) => new SaveSlackChannelUnexpectedError({ cause: error }),
);

export const saveSlackChannel: SaveSlackChannel = (input) => {
  return doAsync
    .andThen(() => insertSlackChannel(input))
    .andThen((row) => {
      return ok(new SlackChannel({
        id: SlackChannelId.create(row.id)._unsafeUnwrap(),
        slackTeamId: SlackTeamId.create(row.slackTeamId)._unsafeUnwrap(),
        name: row.name,
      }));
    });
};
