import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import { UnexpectedError } from '@praha/error-factory/presets';
import DataLoader from 'dataloader';
import { eq, inArray } from 'drizzle-orm';
import { match, P } from 'ts-pattern';

import { serialize } from '../../../helpers/serialize';
import { dataLoader } from '../../../plugins/dataloader';

import type { SlackTeam } from '../../slack-teams/types/slack-team';

const symbol = Symbol('SlackChannelSlackTeam');

export type SlackChannelSlackTeamInput = {
  slackChannelId: string;
};

export class SlackChannelSlackTeamNotFoundError extends ErrorFactory({
  name: 'SlackChannelSlackTeamNotFoundError',
  message: 'Does not exist slack team for slack channel.',
}) {}

export type SlackChannelSlackTeamError = (
  | SlackChannelSlackTeamNotFoundError
  | UnexpectedError
);

export type SlackChannelSlackTeam = (
  input: SlackChannelSlackTeamInput,
) => R.ResultAsync<SlackTeam, SlackChannelSlackTeamError>;

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

  return R.try({
    try: () => loader.load(input),
    catch: (error) => match(error)
      .with(P.instanceOf(SlackChannelSlackTeamNotFoundError), (error) => error)
      .otherwise(() => new UnexpectedError({ cause: error })),
  });
};
