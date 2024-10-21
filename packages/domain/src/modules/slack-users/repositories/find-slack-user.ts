import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { and, eq } from 'drizzle-orm';
import { err, ok, ResultAsync } from 'neverthrow';
import { match } from 'ts-pattern';

import { SlackTeamId } from '../../slack-teams';
import { UserId } from '../../users';
import { SlackUser } from '../models/slack-user';
import { SlackUserId } from '../models/slack-user-id';

export type FindSlackUserInputSlackTeamIdAndSlackUserId = {
  type: 'slack-team-id-and-slack-user-id';
  slackTeamId: SlackTeamId;
  slackUserId: SlackUserId;
};

export type FindSlackUserInput = (
  | FindSlackUserInputSlackTeamIdAndSlackUserId
);

export class FindSlackUserNotFoundError extends CustomError({
  name: 'FindSlackUserNotFoundError',
  message: 'Does not exist slack user.',
}) {}

export class FindSlackUserUnexpectedError extends CustomError({
  name: 'FindSlackUserUnexpectedError',
  message: 'Failed to find slack user.',
}) {}

export type FindSlackUserError = (
  | FindSlackUserNotFoundError
  | FindSlackUserUnexpectedError
);

export type FindSlackUser = (
  input: FindSlackUserInput,
) => ResultAsync<SlackUser, FindSlackUserError>;

const findBySlackTeamIdAndSlackUserId = ResultAsync.fromThrowable((input: FindSlackUserInputSlackTeamIdAndSlackUserId) =>
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
);

export const findSlackUser: FindSlackUser = (input) => {
  return match(input)
    .with({ type: 'slack-team-id-and-slack-user-id' }, (input) => findBySlackTeamIdAndSlackUserId(input))
    .exhaustive()
    .mapErr((error) => new FindSlackUserUnexpectedError({ cause: error }))
    .andThen((row) => {
      if (!row) return err(new FindSlackUserNotFoundError());
      return ok(new SlackUser({
        id: SlackUserId.reconstruct(row.id),
        userId: row.userId ? UserId.reconstruct(row.userId) : null,
        slackTeamId: SlackTeamId.reconstruct(row.slackTeamId),
        name: row.name,
      }));
    });
};
