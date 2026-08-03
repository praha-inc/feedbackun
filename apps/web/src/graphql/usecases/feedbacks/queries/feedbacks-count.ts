import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import { count } from 'drizzle-orm';

const query = R.fn({
  try: (_input: FeedbacksCountInput) => {
    return database()
      .select({ count: count() })
      .from(schema.feedbacks)
      .get();
  },
  catch: (error) => new FeedbacksCountUnexpectedError({ cause: error }),
});

export type FeedbacksCountInput = {};

export class FeedbacksCountUnexpectedError extends ErrorFactory({
  name: 'FeedbacksCountUnexpectedError',
  message: 'Failed to count feedbacks.',
}) {}

export type FeedbacksCountError = (
  | FeedbacksCountUnexpectedError
);

export type FeedbacksCount = (
  input: FeedbacksCountInput,
) => R.ResultAsync<number, FeedbacksCountError>;

export const feedbacksCount: FeedbacksCount = (input) => {
  return R.pipe(
    query(input),
    R.andThen((row) => {
      if (!row) return R.fail(new FeedbacksCountUnexpectedError());
      return R.succeed(row.count);
    }),
  );
};
