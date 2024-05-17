import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { and, eq } from 'drizzle-orm';
import { err, ok, ResultAsync } from 'neverthrow';

import { SlackTeamId } from '../../slack-teams';
import { SlackChannel } from '../models/slack-channel';
import { SlackChannelId } from '../models/slack-channel-id';

export type FindSlackChannelBySlackTeamIdAndSlackChannelIdInput = {
  slackTeamId: SlackTeamId;
  slackChannelId: SlackChannelId;
};

export class FindSlackChannelBySlackTeamIdAndSlackChannelIdNotFoundError extends CustomError({
  name: 'FindSlackChannelBySlackTeamIdAndSlackChannelIdNotFoundError',
  message: 'Does not exist slack channel.',
}) {}

export class FindSlackChannelBySlackTeamIdAndSlackChannelIdUnexpectedError extends CustomError({
  name: 'FindSlackChannelBySlackTeamIdAndSlackChannelIdUnexpectedError',
  message: 'Failed to find slack channel.',
}) {}

export type FindSlackChannelBySlackTeamIdAndSlackChannelIdError = (
  | FindSlackChannelBySlackTeamIdAndSlackChannelIdNotFoundError
  | FindSlackChannelBySlackTeamIdAndSlackChannelIdUnexpectedError
);

export type FindSlackChannelBySlackTeamIdAndSlackChannelId = (
  input: FindSlackChannelBySlackTeamIdAndSlackChannelIdInput,
) => ResultAsync<SlackChannel, FindSlackChannelBySlackTeamIdAndSlackChannelIdError>;

export const findSlackChannelBySlackTeamIdAndSlackChannelId: FindSlackChannelBySlackTeamIdAndSlackChannelId = input => {
  const result = ResultAsync.fromPromise(
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
    error => new FindSlackChannelBySlackTeamIdAndSlackChannelIdUnexpectedError({ cause: error }),
  );

  return result
    .andThen(slackChannel => {
      if (!slackChannel) return err(new FindSlackChannelBySlackTeamIdAndSlackChannelIdNotFoundError());
      return ok(new SlackChannel({
        id: SlackChannelId.create({ value: slackChannel.id })._unsafeUnwrap(),
        slackTeamId: SlackTeamId.create({ value: slackChannel.slackTeamId })._unsafeUnwrap(),
        name: slackChannel.name,
      }));
    });
};
