import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { UnexpectedError } from '@praha/error-factory/presets';
import { count } from 'drizzle-orm';

const query = R.fn({
  try: (_input: FeedbacksCountInput) => {
    return database()
      .select({ count: count() })
      .from(schema.feedbacks)
      .get();
  },
  catch: (error) => new UnexpectedError({ cause: error }),
});

export type FeedbacksCountInput = {};

export type FeedbacksCountError = (
  | UnexpectedError
);

export type FeedbacksCount = (
  input: FeedbacksCountInput,
) => R.ResultAsync<number, FeedbacksCountError>;

export const feedbacksCount: FeedbacksCount = (input) => {
  return R.pipe(
    query(input),
    R.andThen((row) => {
      if (!row) return R.fail(new UnexpectedError());
      return R.succeed(row.count);
    }),
  );
};
