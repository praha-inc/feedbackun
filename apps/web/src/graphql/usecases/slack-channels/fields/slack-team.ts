import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import DataLoader from 'dataloader';
import { eq, inArray } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';
import { match, P } from 'ts-pattern';

import { dataLoader } from '../../../plugins/dataloader';

import type { SlackTeam } from '../../slack-teams/types';

const symbol = Symbol('SlackChannelSlackTeam');

export type SlackChannelSlackTeamInput = {
  slackChannelId: string;
};

export class SlackChannelSlackTeamNotFoundError extends CustomError({
  name: 'SlackChannelSlackTeamNotFoundError',
  message: 'Does not exist slack team for slack channel.',
}) {}

export class SlackChannelSlackTeamUnexpectedError extends CustomError({
  name: 'SlackChannelSlackTeamUnexpectedError',
  message: 'Failed to find slack team for slack channel.',
}) {}

export type SlackChannelSlackTeamError = (
  | SlackChannelSlackTeamNotFoundError
  | SlackChannelSlackTeamUnexpectedError
);

export type SlackChannelSlackTeam = (
  input: SlackChannelSlackTeamInput,
) => ResultAsync<SlackTeam, SlackChannelSlackTeamError>;

export const slackChannelSlackTeam: SlackChannelSlackTeam = (input) => {
  const loader = dataLoader(symbol, () => new DataLoader<string, SlackTeam>(async (slackChannelIds) => {
    const rows = await database()
      .select()
      .from(schema.slackTeams)
      .innerJoin(schema.slackChannels, eq(schema.slackChannels.slackTeamId, schema.slackTeams.id))
      .where(inArray(schema.slackChannels.id, [...slackChannelIds]));

    return slackChannelIds.map((slackChannelId) => {
      const row = rows.find((row) => row.slack_channels.id === slackChannelId);
      if (!row) throw new SlackChannelSlackTeamNotFoundError();
      return {
        id: row.slack_teams.id,
        name: row.slack_teams.name,
      };
    });
  }));

  return ResultAsync.fromThrowable(
    () => loader.load(input.slackChannelId),
    (error) => match(error)
      .with(P.instanceOf(SlackChannelSlackTeamNotFoundError), (error) => error)
      .otherwise(() => new SlackChannelSlackTeamUnexpectedError({ cause: error })),
  )();
};
