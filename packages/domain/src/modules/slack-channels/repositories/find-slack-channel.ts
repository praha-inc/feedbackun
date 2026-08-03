import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import { and, eq } from 'drizzle-orm';
import { match } from 'ts-pattern';

import { SlackTeamId } from '../../slack-teams';
import { SlackChannel } from '../models/slack-channel';
import { SlackChannelId } from '../models/slack-channel-id';

export type FindSlackChannelInputSlackTeamIdAndSlackChannelId = {
  type: 'slack-team-id-and-slack-channel-id';
  slackTeamId: SlackTeamId;
  slackChannelId: SlackChannelId;
};

const findBySlackTeamIdAndSlackChannelId = R.fn({
  try: (input: FindSlackChannelInputSlackTeamIdAndSlackChannelId) =>
    database()
      .select()
      .from(schema.slackChannels)
      .where(
        and(
          eq(schema.slackChannels.slackTeamId, input.slackTeamId.value),
          eq(schema.slackChannels.id, input.slackChannelId.value),
        ),
      )
      .get(),
  catch: (error) => new FindSlackChannelUnexpectedError({ cause: error }),
});

export type FindSlackChannelInput = (
  | FindSlackChannelInputSlackTeamIdAndSlackChannelId
);

export class FindSlackChannelNotFoundError extends ErrorFactory({
  name: 'FindSlackChannelNotFoundError',
  message: 'Does not exist slack channel.',
}) {}

export class FindSlackChannelUnexpectedError extends ErrorFactory({
  name: 'FindSlackChannelUnexpectedError',
  message: 'Failed to find slack channel.',
}) {}

export type FindSlackChannelError = (
  | FindSlackChannelNotFoundError
  | FindSlackChannelUnexpectedError
);

export type FindSlackChannel = (
  input: FindSlackChannelInput,
) => R.ResultAsync<SlackChannel, FindSlackChannelError>;

export const findSlackChannel: FindSlackChannel = (input) => {
  return R.pipe(
    match(input)
      .with({ type: 'slack-team-id-and-slack-channel-id' }, findBySlackTeamIdAndSlackChannelId)
      .exhaustive(),
    R.andThen((row) => {
      if (!row) return R.fail(new FindSlackChannelNotFoundError());
      return R.succeed(new SlackChannel({
        id: SlackChannelId.reconstruct(row.id),
        slackTeamId: SlackTeamId.reconstruct(row.slackTeamId),
        name: row.name,
      }));
    }),
  );
};
