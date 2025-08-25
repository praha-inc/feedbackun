import { database, schema } from '@feedbackun/package-database';
import { ErrorFactory } from '@praha/error-factory';
import DataLoader from 'dataloader';
import { eq, inArray } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';
import { match, P } from 'ts-pattern';

import { serialize } from '../../../helpers/serialize';
import { dataLoader } from '../../../plugins/dataloader';

import type { User } from '../../users/types/user';

const symbol = Symbol('FeedbackSender');

export type FeedbackSenderInput = {
  feedbackId: string;
};

export class FeedbackSenderNotFoundError extends ErrorFactory({
  name: 'FeedbackSenderNotFoundError',
  message: 'Does not exist feedback sender.',
}) {}

export class FeedbackSenderUnexpectedError extends ErrorFactory({
  name: 'FeedbackSenderUnexpectedError',
  message: 'Failed to find feedback sender.',
}) {}

export type FeedbackSenderError = (
  | FeedbackSenderNotFoundError
  | FeedbackSenderUnexpectedError
);

export type FeedbackSender = (
  input: FeedbackSenderInput,
) => ResultAsync<User, FeedbackSenderError>;

export const feedbackSender: FeedbackSender = (input) => {
  const loader = dataLoader(symbol, () => new DataLoader<FeedbackSenderInput, User, string>(async (inputs) => {
    const feedbackIds = inputs.map((input) => input.feedbackId);

    const rows = await database()
      .select()
      .from(schema.users)
      .innerJoin(schema.slackUsers, eq(schema.slackUsers.userId, schema.users.id))
      .innerJoin(schema.feedbacks, eq(schema.feedbacks.sendSlackUserId, schema.slackUsers.id))
      .where(inArray(schema.feedbacks.id, feedbackIds));

    return inputs.map((input) => {
      const row = rows.find((row) => row.feedbacks.id === input.feedbackId);
      if (!row) throw new FeedbackSenderNotFoundError();
      return {
        id: row.users.id,
        type: row.users.type,
        name: row.users.name,
        icon: row.users.icon,
      };
    });
  }, { cacheKeyFn: serialize }));

  return ResultAsync.fromThrowable(
    () => loader.load(input),
    (error) => match(error)
      .with(P.instanceOf(FeedbackSenderNotFoundError), (error) => error)
      .otherwise(() => new FeedbackSenderUnexpectedError({ cause: error })),
  )();
};
