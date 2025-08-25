import { database, schema } from '@feedbackun/package-database';
import { ErrorFactory } from '@praha/error-factory';
import DataLoader from 'dataloader';
import { count, eq } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';

import { serialize } from '../../../helpers/serialize';
import { dataLoader } from '../../../plugins/dataloader';

const symbol = Symbol('UserReceivedFeedbacksCount');

export type UserReceivedFeedbacksCountInput = {
  userId: string;
};

export class UserReceivedFeedbacksCountUnexpectedError extends ErrorFactory({
  name: 'UserReceivedFeedbacksCountUnexpectedError',
  message: 'Failed to count received feedbacks for user.',
}) {}

export type UserReceivedFeedbacksCountError = (
  | UserReceivedFeedbacksCountUnexpectedError
);

export type UserReceivedFeedbacksCount = (
  input: UserReceivedFeedbacksCountInput,
) => ResultAsync<number, UserReceivedFeedbacksCountError>;

export const userReceivedFeedbacksCount: UserReceivedFeedbacksCount = (input) => {
  const loader = dataLoader(symbol, () => new DataLoader<UserReceivedFeedbacksCountInput, number, string>(async (inputs) => {
    const execute = async (input: UserReceivedFeedbacksCountInput): Promise<number> => {
      const [row] = await database()
        .select({ count: count() })
        .from(schema.feedbacks)
        .innerJoin(schema.slackUsers, eq(schema.slackUsers.id, schema.feedbacks.receiveSlackUserId))
        .innerJoin(schema.users, eq(schema.users.id, schema.slackUsers.userId))
        .where(eq(schema.users.id, input.userId));

      return row?.count ?? 0;
    };

    return await Promise.all(inputs.map((input) => execute(input)));
  }, { cacheKeyFn: serialize }));

  return ResultAsync.fromThrowable(
    () => loader.load(input),
    (error) => new UserReceivedFeedbacksCountUnexpectedError({ cause: error }),
  )();
};
