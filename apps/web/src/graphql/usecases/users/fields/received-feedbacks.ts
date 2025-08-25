import { database, schema } from '@feedbackun/package-database';
import { ErrorFactory } from '@praha/error-factory';
import DataLoader from 'dataloader';
import { and, desc, eq, lt, or } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';

import { serialize } from '../../../helpers/serialize';
import { dataLoader } from '../../../plugins/dataloader';

import type { Feedback } from '../../feedbacks/types/feedback';

const symbol = Symbol('UserReceivedFeedbacks');

export type UserReceivedFeedbacksCursor = {
  id: string;
  createdAt: Date;
};

export type UserReceivedFeedbacksInput = {
  userId: string;
  limit: number;
  cursor: UserReceivedFeedbacksCursor | undefined;
};

export class UserReceivedFeedbacksUnexpectedError extends ErrorFactory({
  name: 'UserReceivedFeedbacksUnexpectedError',
  message: 'Failed to find received feedbacks for user.',
}) {}

export type UserReceivedFeedbacksError = (
  | UserReceivedFeedbacksUnexpectedError
);

export type UserReceivedFeedbacksNode = Feedback & { cursor: UserReceivedFeedbacksCursor };

export type UserReceivedFeedbacks = (
  input: UserReceivedFeedbacksInput,
) => ResultAsync<UserReceivedFeedbacksNode[], UserReceivedFeedbacksError>;

export const userReceivedFeedbacks: UserReceivedFeedbacks = (input) => {
  const loader = dataLoader(symbol, () => new DataLoader<UserReceivedFeedbacksInput, UserReceivedFeedbacksNode[], string>(async (inputs) => {
    const execute = async (input: UserReceivedFeedbacksInput): Promise<UserReceivedFeedbacksNode[]> => {
      const filters: Parameters<typeof and> = [
        eq(schema.users.id, input.userId),
      ];

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

      const rows = await database()
        .select()
        .from(schema.feedbacks)
        .innerJoin(schema.slackUsers, eq(schema.slackUsers.id, schema.feedbacks.receiveSlackUserId))
        .innerJoin(schema.users, eq(schema.users.id, schema.slackUsers.userId))
        .where(and(...filters))
        .orderBy(desc(schema.feedbacks.createdAt))
        .limit(input.limit);

      return rows.map((row) => ({
        id: row.feedbacks.id,
        content: row.feedbacks.content,
        createdAt: row.feedbacks.createdAt,
        cursor: {
          id: row.feedbacks.id,
          createdAt: row.feedbacks.createdAt,
        },
      }));
    };

    return await Promise.all(inputs.map((input) => execute(input)));
  }, { cacheKeyFn: serialize }));

  return ResultAsync.fromThrowable(
    () => loader.load(input),
    (error) => new UserReceivedFeedbacksUnexpectedError({ cause: error }),
  )();
};
