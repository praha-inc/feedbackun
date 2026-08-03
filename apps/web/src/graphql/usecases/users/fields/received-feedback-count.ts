import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { UnexpectedError } from '@praha/error-factory/presets';
import DataLoader from 'dataloader';
import { count, eq } from 'drizzle-orm';

import { serialize } from '../../../helpers/serialize';
import { dataLoader } from '../../../plugins/dataloader';

const symbol = Symbol('UserReceivedFeedbacksCount');

export type UserReceivedFeedbacksCountInput = {
  userId: string;
};

export type UserReceivedFeedbacksCountError = (
  | UnexpectedError
);

export type UserReceivedFeedbacksCount = (
  input: UserReceivedFeedbacksCountInput,
) => R.ResultAsync<number, UserReceivedFeedbacksCountError>;

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

  return R.try({
    try: () => loader.load(input),
    catch: (error) => new UnexpectedError({ cause: error }),
  });
};
