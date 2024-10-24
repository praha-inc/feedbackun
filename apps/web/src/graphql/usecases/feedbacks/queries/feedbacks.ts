import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { doAsync } from '@feedbackun/package-neverthrow';
import { and, eq, lt, or } from 'drizzle-orm';
import { ok, ResultAsync } from 'neverthrow';

import type { Feedback } from '../types';

export type FeedbacksCursor = {
  id: string;
  createdAt: Date;
};

export type FeedbacksInput = {
  limit: number;
  cursor: FeedbacksCursor | undefined;
};

export class FeedbacksUnexpectedError extends CustomError({
  name: 'FeedbacksUnexpectedError',
  message: 'Failed to find feedbacks.',
}) {}

export type FeedbacksError = (
  | FeedbacksUnexpectedError
);

export type FeedbacksNode = Feedback & { cursor: FeedbacksCursor };

export type Feedbacks = (
  input: FeedbacksInput,
) => ResultAsync<FeedbacksNode[], FeedbacksError>;

const query = ResultAsync.fromThrowable((input: FeedbacksInput) => {
  const filters: Parameters<typeof and> = [];
  if (input.cursor) {
    filters.push(
      or(
        lt(schema.feedbacks.createdAt, input.cursor.createdAt),
        and(
          eq(schema.feedbacks.createdAt, input.cursor.createdAt),
          lt(schema.feedbacks.id, input.cursor.id),
        ),
      ),
    );
  }

  return database()
    .select()
    .from(schema.feedbacks)
    .where(and(...filters));
});

export const feedbacks: Feedbacks = (input) => {
  return doAsync
    .andThen(() => query(input))
    .mapErr((error) => new FeedbacksUnexpectedError({ cause: error }))
    .andThen((rows) => {
      return ok(rows.map((row) => ({
        id: row.id,
        content: row.content,
        createdAt: row.createdAt,
        cursor: {
          id: row.id,
          createdAt: row.createdAt,
        },
      })));
    });
};
