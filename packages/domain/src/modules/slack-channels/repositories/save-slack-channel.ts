import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { UnexpectedError } from '@praha/error-factory/presets';

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
  catch: (error) => new UnexpectedError({ cause: error }),
});

export type SaveSlackChannelInput = SlackChannel;

export type SaveSlackChannelError = (
  | UnexpectedError
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
