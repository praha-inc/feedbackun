import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import { UnexpectedError } from '@praha/error-factory/presets';
import { eq } from 'drizzle-orm';
import { match } from 'ts-pattern';

import { SlackTeam } from '../models/slack-team';
import { SlackTeamId } from '../models/slack-team-id';

export type FindSlackTeamInputSlackTeamId = {
  type: 'slack-team-id';
  slackTeamId: SlackTeamId;
};

const findBySlackTeamId = R.fn({
  try: (input: FindSlackTeamInputSlackTeamId) =>
    database()
      .select()
      .from(schema.slackTeams)
      .where(
        eq(schema.slackTeams.id, input.slackTeamId.value),
      )
      .get(),
  catch: (error) => new UnexpectedError({ cause: error }),
});

export type FindSlackTeamInput = (
  | FindSlackTeamInputSlackTeamId
);

export class FindSlackTeamNotFoundError extends ErrorFactory({
  name: 'FindSlackTeamNotFoundError',
  message: 'Does not exist slack team.',
}) {}

export type FindSlackTeamError = (
  | FindSlackTeamNotFoundError
  | UnexpectedError
);

export type FindSlackTeam = (
  input: FindSlackTeamInput,
) => R.ResultAsync<SlackTeam, FindSlackTeamError>;

export const findSlackTeam: FindSlackTeam = (input) => {
  return R.pipe(
    match(input)
      .with({ type: 'slack-team-id' }, findBySlackTeamId)
      .exhaustive(),
    R.andThen((row) => {
      if (!row) return R.fail(new FindSlackTeamNotFoundError());
      return R.succeed(new SlackTeam({
        id: SlackTeamId.reconstruct(row.id),
        name: row.name,
        domain: row.domain,
      }));
    }),
  );
};
