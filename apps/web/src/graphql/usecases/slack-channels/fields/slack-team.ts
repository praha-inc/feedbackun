import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import DataLoader from 'dataloader';
import { eq, inArray } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';
import { match, P } from 'ts-pattern';

import { serialize } from '../../../helpers/serialize';
import { dataLoader } from '../../../plugins/dataloader';

import type { SlackTeam } from '../../slack-teams/types/slack-team';

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
  const loader = dataLoader(symbol, () => new DataLoader<SlackChannelSlackTeamInput, SlackTeam, string>(async (inputs) => {
    const slackChannelIds = inputs.map((input) => input.slackChannelId);

    const rows = await database()
      .select()
      .from(schema.slackTeams)
      .innerJoin(schema.slackChannels, eq(schema.slackChannels.slackTeamId, schema.slackTeams.id))
      .where(inArray(schema.slackChannels.id, slackChannelIds));

    return inputs.map((input) => {
      const row = rows.find((row) => row.slack_channels.id === input.slackChannelId);
      if (!row) throw new SlackChannelSlackTeamNotFoundError();
      return {
        id: row.slack_teams.id,
        name: row.slack_teams.name,
        icon: row.slack_teams.icon,
      };
    });
  }, { cacheKeyFn: serialize }));

  return ResultAsync.fromThrowable(
    () => loader.load(input),
    (error) => match(error)
      .with(P.instanceOf(SlackChannelSlackTeamNotFoundError), (error) => error)
      .otherwise(() => new SlackChannelSlackTeamUnexpectedError({ cause: error })),
  )();
};
