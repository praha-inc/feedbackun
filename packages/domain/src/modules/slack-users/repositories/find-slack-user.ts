import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import { UnexpectedError } from '@praha/error-factory/presets';
import { and, eq } from 'drizzle-orm';
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

const findBySlackTeamIdAndSlackUserId = R.fn({
  try: (input: FindSlackUserInputSlackTeamIdAndSlackUserId) =>
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
  catch: (error) => new UnexpectedError({ cause: error }),
});

export type FindSlackUserInput = (
  | FindSlackUserInputSlackTeamIdAndSlackUserId
);

export class FindSlackUserNotFoundError extends ErrorFactory({
  name: 'FindSlackUserNotFoundError',
  message: 'Does not exist slack user.',
}) {}

export type FindSlackUserError = (
  | FindSlackUserNotFoundError
  | UnexpectedError
);

export type FindSlackUser = (
  input: FindSlackUserInput,
) => R.ResultAsync<SlackUser, FindSlackUserError>;

export const findSlackUser: FindSlackUser = (input) => {
  return R.pipe(
    match(input)
      .with({ type: 'slack-team-id-and-slack-user-id' }, findBySlackTeamIdAndSlackUserId)
      .exhaustive(),
    R.andThen((row) => {
      if (!row) return R.fail(new FindSlackUserNotFoundError());
      return R.succeed(new SlackUser({
        id: SlackUserId.reconstruct(row.id),
        userId: UserId.reconstruct(row.userId),
        slackTeamId: SlackTeamId.reconstruct(row.slackTeamId),
        name: row.name,
      }));
    }),
  );
};
