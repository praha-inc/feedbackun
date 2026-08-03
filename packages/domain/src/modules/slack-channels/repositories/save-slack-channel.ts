import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';

import { SlackTeamId } from '../../slack-teams';
import { SlackChannel } from '../models/slack-channel';
import { SlackChannelId } from '../models/slack-channel-id';

const insertSlackChannel = R.fn({
  try: (slackChannel: SlackChannel) => database()
    .insert(schema.slackChannels)
    .values({
      id: slackChannel.id.value,
      slackTeamId: slackChannel.slackTeamId.value,
      name: slackChannel.name,
    })
    .returning()
    .get(),
  catch: (error) => new SaveSlackChannelUnexpectedError({ cause: error }),
});

export type SaveSlackChannelInput = SlackChannel;

export class SaveSlackChannelUnexpectedError extends ErrorFactory({
  name: 'SaveSlackChannelUnexpectedError',
  message: 'Failed to save slack channel.',
}) {}

export type SaveSlackChannelError = (
  | SaveSlackChannelUnexpectedError
);

export type SaveSlackChannel = (
  input: SaveSlackChannelInput,
) => R.ResultAsync<SlackChannel, SaveSlackChannelError>;

export const saveSlackChannel: SaveSlackChannel = (input) => {
  return R.pipe(
    insertSlackChannel(input),
    R.andThen((row) => {
      return R.succeed(new SlackChannel({
        id: SlackChannelId.reconstruct(row.id),
        slackTeamId: SlackTeamId.reconstruct(row.slackTeamId),
        name: row.name,
      }));
    }),
  );
};
