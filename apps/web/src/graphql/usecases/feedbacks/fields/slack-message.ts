import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import DataLoader from 'dataloader';
import { eq, inArray } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';
import { match, P } from 'ts-pattern';

import { dataLoader } from '../../../plugins/dataloader';

import type { SlackMessage } from '../../slack-message/types';

const symbol = Symbol('FeedbackSlackMessage');

export type FeedbackSlackMessageInput = {
  feedbackId: string;
};

export class FeedbackSlackMessageNotFoundError extends CustomError({
  name: 'FeedbackSlackMessageNotFoundError',
  message: 'Does not exist feedback slack message.',
}) {}

export class FeedbackSlackMessageUnexpectedError extends CustomError({
  name: 'FeedbackSlackMessageUnexpectedError',
  message: 'Failed to find feedback slack message.',
}) {}

export type FeedbackSlackMessageError = (
  | FeedbackSlackMessageNotFoundError
  | FeedbackSlackMessageUnexpectedError
  );

export type FeedbackSlackMessage = (
  input: FeedbackSlackMessageInput,
) => ResultAsync<SlackMessage, FeedbackSlackMessageError>;

export const feedbackSlackMessage: FeedbackSlackMessage = (input) => {
  const loader = dataLoader(symbol, () => new DataLoader<string, SlackMessage>(async (feedbackIds) => {
    const rows = await database()
      .select()
      .from(schema.slackMessages)
      .innerJoin(schema.feedbacks, eq(schema.feedbacks.slackMessageId, schema.slackMessages.id))
      .where(inArray(schema.feedbacks.id, [...feedbackIds]));

    return feedbackIds.map((feedbackId) => {
      const row = rows.find((row) => row.feedbacks.id === feedbackId);
      if (!row) throw new FeedbackSlackMessageNotFoundError();
      return {
        id: row.slack_messages.id,
        content: row.slack_messages.text,
      };
    });
  }));

  return ResultAsync.fromThrowable(
    () => loader.load(input.feedbackId),
    (error) => match(error)
      .with(P.instanceOf(FeedbackSlackMessageNotFoundError), (error) => error)
      .otherwise(() => new FeedbackSlackMessageUnexpectedError({ cause: error })),
  )();
};
