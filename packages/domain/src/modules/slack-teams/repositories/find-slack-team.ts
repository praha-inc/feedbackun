import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { eq } from 'drizzle-orm';
import { err, ok, ResultAsync } from 'neverthrow';
import { match } from 'ts-pattern';

import { SlackTeam } from '../models/slack-team';
import { SlackTeamId } from '../models/slack-team-id';

export type FindSlackTeamInputSlackTeamId = {
  type: 'slack-team-id';
  slackTeamId: SlackTeamId;
};

export type FindSlackTeamInput = (
  | FindSlackTeamInputSlackTeamId
);

export class FindSlackTeamNotFoundError extends CustomError({
  name: 'FindSlackTeamNotFoundError',
  message: 'Does not exist slack team.',
}) {}

export class FindSlackTeamUnexpectedError extends CustomError({
  name: 'FindSlackTeamUnexpectedError',
  message: 'Failed to find slack team.',
}) {}

export type FindSlackTeamError = (
  | FindSlackTeamNotFoundError
  | FindSlackTeamUnexpectedError
);

export type FindSlackTeam = (
  input: FindSlackTeamInput,
) => ResultAsync<SlackTeam, FindSlackTeamError>;

const findBySlackTeamId = ResultAsync.fromThrowable((input: FindSlackTeamInputSlackTeamId) =>
  database()
    .select()
    .from(schema.slackTeams)
    .where(
      eq(schema.slackTeams.id, input.slackTeamId.value),
    )
    .get(),
);

export const findSlackTeam: FindSlackTeam = (input) => {
  return match(input)
    .with({ type: 'slack-team-id' }, (input) => findBySlackTeamId(input))
    .exhaustive()
    .mapErr((error) => new FindSlackTeamUnexpectedError({ cause: error }))
    .andThen((row) => {
      if (!row) return err(new FindSlackTeamNotFoundError());
      return ok(new SlackTeam({
        id: SlackTeamId.reconstruct(row.id),
        name: row.name,
        domain: row.domain,
      }));
    });
};
