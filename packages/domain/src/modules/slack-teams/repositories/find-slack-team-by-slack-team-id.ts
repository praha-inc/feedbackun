import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { eq } from 'drizzle-orm';
import { err, ok, ResultAsync } from 'neverthrow';

import { SlackTeam } from '../models/slack-team';
import { SlackTeamId } from '../models/slack-team-id';

export type FindSlackTeamBySlackTeamIdInput = {
  slackTeamId: SlackTeamId;
};

export class FindSlackTeamBySlackTeamIdNotFoundError extends CustomError({
  name: 'FindSlackTeamBySlackTeamIdNotFoundError',
  message: 'Does not exist slack team.',
}) {}

export class FindSlackTeamBySlackTeamIdUnexpectedError extends CustomError({
  name: 'FindSlackTeamBySlackTeamIdUnexpectedError',
  message: 'Failed to find slack team.',
}) {}

export type FindSlackTeamBySlackTeamIdError = (
  | FindSlackTeamBySlackTeamIdNotFoundError
  | FindSlackTeamBySlackTeamIdUnexpectedError
);

export type FindSlackTeamBySlackTeamId = (
  input: FindSlackTeamBySlackTeamIdInput,
) => ResultAsync<SlackTeam, FindSlackTeamBySlackTeamIdError>;

export const findSlackTeamBySlackTeamId: FindSlackTeamBySlackTeamId = input => {
  const result = ResultAsync.fromPromise(
    database()
      .select()
      .from(schema.slackTeams)
      .where(
        eq(schema.slackTeams.id, input.slackTeamId.value),
      )
      .get(),
    error => new FindSlackTeamBySlackTeamIdUnexpectedError({ cause: error }),
  );

  return result
    .andThen(slackTeam => {
      if (!slackTeam) return err(new FindSlackTeamBySlackTeamIdNotFoundError());
      return ok(new SlackTeam({
        id: SlackTeamId.create({ value: slackTeam.id })._unsafeUnwrap(),
        name: slackTeam.name,
        domain: slackTeam.domain,
      }));
    });
};
