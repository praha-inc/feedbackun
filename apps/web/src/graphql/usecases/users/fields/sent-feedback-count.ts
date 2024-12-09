import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import DataLoader from 'dataloader';
import { count, eq } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';

import { serialize } from '../../../helpers/serialize';
import { dataLoader } from '../../../plugins/dataloader';

const symbol = Symbol('UserSentFeedbacksCount');

export type UserSentFeedbacksCountInput = {
  userId: string;
};

export class UserSentFeedbacksCountUnexpectedError extends CustomError({
  name: 'UserSentFeedbacksCountUnexpectedError',
  message: 'Failed to count sent feedbacks for user.',
}) {}

export type UserSentFeedbacksCountError = (
  | UserSentFeedbacksCountUnexpectedError
);

export type UserSentFeedbacksCount = (
  input: UserSentFeedbacksCountInput,
) => ResultAsync<number, UserSentFeedbacksCountError>;

export const userSentFeedbacksCount: UserSentFeedbacksCount = (input) => {
  const loader = dataLoader(symbol, () => new DataLoader<UserSentFeedbacksCountInput, number, string>(async (inputs) => {
    const execute = async (input: UserSentFeedbacksCountInput): Promise<number> => {
      const [row] = await database()
        .select({ count: count() })
        .from(schema.feedbacks)
        .innerJoin(schema.slackUsers, eq(schema.slackUsers.id, schema.feedbacks.sendSlackUserId))
        .innerJoin(schema.users, eq(schema.users.id, schema.slackUsers.userId))
        .where(eq(schema.users.id, input.userId));

      return row?.count ?? 0;
    };

    return await Promise.all(inputs.map((input) => execute(input)));
  }, { cacheKeyFn: serialize }));

  return ResultAsync.fromThrowable(
    () => loader.load(input),
    (error) => new UserSentFeedbacksCountUnexpectedError({ cause: error }),
  )();
};
