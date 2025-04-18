import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import DataLoader from 'dataloader';
import { eq, inArray } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';
import { match, P } from 'ts-pattern';

import { serialize } from '../../../helpers/serialize';
import { dataLoader } from '../../../plugins/dataloader';

import type { SlackChannel } from '../../slack-channels/types/slack-channel';

const symbol = Symbol('SlackMessageSlackChannel');

export type SlackMessageSlackChannelInput = {
  slackMessageId: string;
};

export class SlackMessageSlackChannelNotFoundError extends CustomError({
  name: 'SlackMessageSlackChannelNotFoundError',
  message: 'Does not exist slack channel for slack message.',
}) {}

export class SlackMessageSlackChannelUnexpectedError extends CustomError({
  name: 'SlackMessageSlackChannelUnexpectedError',
  message: 'Failed to find slack channel for slack message.',
}) {}

export type SlackMessageSlackChannelError = (
  | SlackMessageSlackChannelNotFoundError
  | SlackMessageSlackChannelUnexpectedError
  );

export type SlackMessageSlackChannel = (
  input: SlackMessageSlackChannelInput,
) => ResultAsync<SlackChannel, SlackMessageSlackChannelError>;

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

  return ResultAsync.fromThrowable(
    () => loader.load(input),
    (error) => match(error)
      .with(P.instanceOf(SlackMessageSlackChannelNotFoundError), (error) => error)
      .otherwise(() => new SlackMessageSlackChannelUnexpectedError({ cause: error })),
  )();
};
