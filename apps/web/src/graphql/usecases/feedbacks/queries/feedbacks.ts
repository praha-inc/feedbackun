import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { UnexpectedError } from '@praha/error-factory/presets';
import { and, desc, eq, lt, or } from 'drizzle-orm';

import type { Feedback } from '../types/feedback';

const query = R.fn({
  try: (input: FeedbacksInput) => {
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
      .where(and(...filters))
      .orderBy(desc(schema.feedbacks.createdAt))
      .limit(input.limit);
  },
  catch: (error) => new UnexpectedError({ cause: error }),
});

export type FeedbacksCursor = {
  id: string;
  createdAt: Date;
};

export type FeedbacksInput = {
  limit: number;
  cursor: FeedbacksCursor | undefined;
};

export type FeedbacksError = (
  | UnexpectedError
);

export type FeedbacksNode = Feedback & { cursor: FeedbacksCursor };

export type Feedbacks = (
  input: FeedbacksInput,
) => R.ResultAsync<FeedbacksNode[], FeedbacksError>;

export const feedbacks: Feedbacks = (input) => {
  return R.pipe(
    query(input),
    R.andThen((rows) => {
      return R.succeed(rows.map((row) => ({
        id: row.id,
        content: row.content,
        createdAt: row.createdAt,
        cursor: {
          id: row.id,
          createdAt: row.createdAt,
        },
      })));
    }),
  );
};
