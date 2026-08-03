import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import { UnexpectedError } from '@praha/error-factory/presets';
import DataLoader from 'dataloader';
import { eq, inArray } from 'drizzle-orm';
import { match, P } from 'ts-pattern';

import { serialize } from '../../../helpers/serialize';
import { dataLoader } from '../../../plugins/dataloader';

import type { SlackChannel } from '../../slack-channels/types/slack-channel';

const symbol = Symbol('SlackMessageSlackChannel');

export type SlackMessageSlackChannelInput = {
  slackMessageId: string;
};

export class SlackMessageSlackChannelNotFoundError extends ErrorFactory({
  name: 'SlackMessageSlackChannelNotFoundError',
  message: 'Does not exist slack channel for slack message.',
}) {}

export type SlackMessageSlackChannelError = (
  | SlackMessageSlackChannelNotFoundError
  | UnexpectedError
);

export type SlackMessageSlackChannel = (
  input: SlackMessageSlackChannelInput,
) => R.ResultAsync<SlackChannel, SlackMessageSlackChannelError>;

export const slackMessageSlackChannel: SlackMessageSlackChannel = (input) => {
  const loader = dataLoader(symbol, () => new DataLoader<SlackMessageSlackChannelInput, SlackChannel, string>(async (inputs) => {
    const slackMessageIds = inputs.map((input) => input.slackMessageId);

    const rows = await database()
      .select()
      .from(schema.slackChannels)
      .innerJoin(schema.slackMessages, eq(schema.slackMessages.slackChannelId, schema.slackChannels.id))
      .where(inArray(schema.slackMessages.id, slackMessageIds));

    return inputs.map((input) => {
      const row = rows.find((row) => row.slack_messages.id === input.slackMessageId);
      if (!row) throw new SlackMessageSlackChannelNotFoundError();
      return {
        id: row.slack_channels.id,
        name: row.slack_channels.name,
      };
    });
  }, { cacheKeyFn: serialize }));

  return R.try({
    try: () => loader.load(input),
    catch: (error) => match(error)
      .with(P.instanceOf(SlackMessageSlackChannelNotFoundError), (error) => error)
      .otherwise(() => new UnexpectedError({ cause: error })),
  });
};
