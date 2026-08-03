import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import DataLoader from 'dataloader';
import { count, eq } from 'drizzle-orm';

import { serialize } from '../../../helpers/serialize';
import { dataLoader } from '../../../plugins/dataloader';

const symbol = Symbol('UserSentFeedbacksCount');

export type UserSentFeedbacksCountInput = {
  userId: string;
};

export class UserSentFeedbacksCountUnexpectedError extends ErrorFactory({
  name: 'UserSentFeedbacksCountUnexpectedError',
  message: 'Failed to count sent feedbacks for user.',
}) {}

export type UserSentFeedbacksCountError = (
  | UserSentFeedbacksCountUnexpectedError
);

export type UserSentFeedbacksCount = (
  input: UserSentFeedbacksCountInput,
) => R.ResultAsync<number, UserSentFeedbacksCountError>;

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

  return R.try({
    try: () => loader.load(input),
    catch: (error) => new UserSentFeedbacksCountUnexpectedError({ cause: error }),
  });
};
