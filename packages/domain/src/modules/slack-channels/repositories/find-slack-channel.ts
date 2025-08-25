import { database, schema } from '@feedbackun/package-database';
import { ErrorFactory } from '@praha/error-factory';
import { and, eq } from 'drizzle-orm';
import { err, ok, ResultAsync } from 'neverthrow';
import { match } from 'ts-pattern';

import { SlackTeamId } from '../../slack-teams';
import { SlackChannel } from '../models/slack-channel';
import { SlackChannelId } from '../models/slack-channel-id';

export type FindSlackChannelInputSlackTeamIdAndSlackChannelId = {
  type: 'slack-team-id-and-slack-channel-id';
  slackTeamId: SlackTeamId;
  slackChannelId: SlackChannelId;
};

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
) => ResultAsync<SlackChannel, FindSlackChannelError>;

const findBySlackTeamIdAndSlackChannelId = ResultAsync.fromThrowable((input: FindSlackChannelInputSlackTeamIdAndSlackChannelId) =>
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
);

export const findSlackChannel: FindSlackChannel = (input) => {
  return match(input)
    .with({ type: 'slack-team-id-and-slack-channel-id' }, (input) => findBySlackTeamIdAndSlackChannelId(input))
    .exhaustive()
    .mapErr((error) => new FindSlackChannelUnexpectedError({ cause: error }))
    .andThen((row) => {
      if (!row) return err(new FindSlackChannelNotFoundError());
      return ok(new SlackChannel({
        id: SlackChannelId.reconstruct(row.id),
        slackTeamId: SlackTeamId.reconstruct(row.slackTeamId),
        name: row.name,
      }));
    });
};
