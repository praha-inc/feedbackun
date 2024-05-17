import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { and, eq } from 'drizzle-orm';
import { err, ok, ResultAsync } from 'neverthrow';

import { SlackTeamId } from '../../slack-teams';
import { SlackUser } from '../models/slack-user';
import { SlackUserId } from '../models/slack-user-id';

export type FindSlackUserBySlackTeamIdAndSlackUserIdInput = {
  slackTeamId: SlackTeamId;
  slackUserId: SlackUserId;
};

export class FindSlackUserBySlackTeamIdAndSlackUserIdNotFoundError extends CustomError({
  name: 'FindSlackUserBySlackTeamIdAndSlackUserIdNotFoundError',
  message: 'Does not exist slack user.',
}) {}

export class FindSlackUserBySlackTeamIdAndSlackUserIdUnexpectedError extends CustomError({
  name: 'FindSlackUserBySlackTeamIdAndSlackUserIdUnexpectedError',
  message: 'Failed to find slack user.',
}) {}

export type FindSlackUserBySlackTeamIdAndSlackUserIdError = (
  | FindSlackUserBySlackTeamIdAndSlackUserIdNotFoundError
  | FindSlackUserBySlackTeamIdAndSlackUserIdUnexpectedError
);

export type FindSlackUserBySlackTeamIdAndSlackUserId = (
  input: FindSlackUserBySlackTeamIdAndSlackUserIdInput,
) => ResultAsync<SlackUser, FindSlackUserBySlackTeamIdAndSlackUserIdError>;

export const findSlackUserBySlackTeamIdAndSlackUserId: FindSlackUserBySlackTeamIdAndSlackUserId = input => {
  const result = ResultAsync.fromPromise(
    database()
      .select()
      .from(schema.slackUsers)
      .where(
        and(
          eq(schema.slackUsers.slackTeamId, input.slackTeamId.value),
          eq(schema.slackUsers.id, input.slackUserId.value),
        ),
      )
      .get(),
    error => new FindSlackUserBySlackTeamIdAndSlackUserIdUnexpectedError({ cause: error }),
  );

  return result
    .andThen(slackUser => {
      if (!slackUser) return err(new FindSlackUserBySlackTeamIdAndSlackUserIdNotFoundError());
      return ok(new SlackUser({
        id: SlackUserId.create({ value: slackUser.id })._unsafeUnwrap(),
        slackTeamId: SlackTeamId.create({ value: slackUser.slackTeamId })._unsafeUnwrap(),
        name: slackUser.name,
      }));
    });
};
