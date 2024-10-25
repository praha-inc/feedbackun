import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import DataLoader from 'dataloader';
import { eq, inArray } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';
import { match, P } from 'ts-pattern';

import { dataLoader } from '../../../plugins/dataloader';

const symbol = Symbol('SlackMessageUrl');

export type SlackMessageUrlInput = {
  slackMessageId: string;
};

export class SlackMessageUrlNotFoundError extends CustomError({
  name: 'SlackMessageUrlNotFoundError',
  message: 'Does not exist url for slack message.',
}) {}

export class SlackMessageUrlUnexpectedError extends CustomError({
  name: 'SlackMessageUrlUnexpectedError',
  message: 'Failed to find url for slack message.',
}) {}

export type SlackMessageUrlError = (
  | SlackMessageUrlNotFoundError
  | SlackMessageUrlUnexpectedError
);

export type SlackMessageUrl = (
  input: SlackMessageUrlInput,
) => ResultAsync<string, SlackMessageUrlError>;

export const slackMessageUrl: SlackMessageUrl = (input) => {
  const loader = dataLoader(symbol, () => new DataLoader<string, string>(async (slackMessageIds) => {
    const rows = await database()
      .select()
      .from(schema.slackMessages)
      .innerJoin(schema.slackChannels, eq(schema.slackChannels.id, schema.slackMessages.slackChannelId))
      .innerJoin(schema.slackTeams, eq(schema.slackTeams.id, schema.slackChannels.slackTeamId))
      .where(inArray(schema.slackMessages.id, [...slackMessageIds]));

    return slackMessageIds.map((slackMessageId) => {
      const row = rows.find((row) => row.slack_messages.id === slackMessageId);
      if (!row) throw new SlackMessageUrlNotFoundError();
      return `https://${row.slack_teams.domain}.slack.com/archives/${row.slack_channels.id}/p${row.slack_messages.ts.replace('.', '')}?thread_ts=${row.slack_messages.threadTs}`;
    });
  }));

  return ResultAsync.fromThrowable(
    () => loader.load(input.slackMessageId),
    (error) => match(error)
      .with(P.instanceOf(SlackMessageUrlNotFoundError), (error) => error)
      .otherwise(() => new SlackMessageUrlUnexpectedError({ cause: error })),
  )();
};
