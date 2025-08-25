import { database, schema } from '@feedbackun/package-database';
import { doAsync } from '@feedbackun/package-neverthrow';
import { ErrorFactory } from '@praha/error-factory';
import { count } from 'drizzle-orm';
import { err, ok, ResultAsync } from 'neverthrow';

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
) => ResultAsync<number, FeedbacksCountError>;

const query = ResultAsync.fromThrowable((_input: FeedbacksCountInput) => {
  return database()
    .select({ count: count() })
    .from(schema.feedbacks)
    .get();
});

export const feedbacksCount: FeedbacksCount = (input) => {
  return doAsync
    .andThen(() => query(input))
    .mapErr((error) => new FeedbacksCountUnexpectedError({ cause: error }))
    .andThen((row) => {
      if (!row) return err(new FeedbacksCountUnexpectedError());
      return ok(row.count);
    });
};
