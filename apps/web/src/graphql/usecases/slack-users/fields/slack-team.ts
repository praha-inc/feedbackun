import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import DataLoader from 'dataloader';
import { eq, inArray } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';
import { match, P } from 'ts-pattern';

import { dataLoader } from '../../../plugins/dataloader';

import type { SlackTeam } from '../../slack-teams/types/slack-team';

const symbol = Symbol('SlackUserSlackTeam');

export type SlackUserSlackTeamInput = {
  slackUserId: string;
};

export class SlackUserSlackTeamNotFoundError extends CustomError({
  name: 'SlackUserSlackTeamNotFoundError',
  message: 'Does not exist slack team for slack user.',
}) {}

export class SlackUserSlackTeamUnexpectedError extends CustomError({
  name: 'SlackUserSlackTeamUnexpectedError',
  message: 'Failed to find slack team for slack user.',
}) {}

export type SlackUserSlackTeamError = (
  | SlackUserSlackTeamNotFoundError
  | SlackUserSlackTeamUnexpectedError
);

export type SlackUserSlackTeam = (
  input: SlackUserSlackTeamInput,
) => ResultAsync<SlackTeam, SlackUserSlackTeamError>;

export const slackUserSlackTeam: SlackUserSlackTeam = (input) => {
  const loader = dataLoader(symbol, () => new DataLoader<string, SlackTeam>(async (slackUserIds) => {
    const rows = await database()
      .select()
      .from(schema.slackTeams)
      .innerJoin(schema.slackUsers, eq(schema.slackUsers.slackTeamId, schema.slackTeams.id))
      .where(inArray(schema.slackUsers.id, [...slackUserIds]));

    return slackUserIds.map((slackUserId) => {
      const row = rows.find((row) => row.slack_users.id === slackUserId);
      if (!row) throw new SlackUserSlackTeamNotFoundError();
      return {
        id: row.slack_teams.id,
        name: row.slack_teams.name,
        icon: row.slack_teams.icon,
      };
    });
  }));

  return ResultAsync.fromThrowable(
    () => loader.load(input.slackUserId),
    (error) => match(error)
      .with(P.instanceOf(SlackUserSlackTeamNotFoundError), (error) => error)
      .otherwise(() => new SlackUserSlackTeamUnexpectedError({ cause: error })),
  )();
};
