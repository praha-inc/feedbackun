import { database, schema } from '@feedbackun/package-database';
import { ErrorFactory } from '@praha/error-factory';
import DataLoader from 'dataloader';
import { and, desc, eq, lt, or } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';

import { serialize } from '../../../helpers/serialize';
import { dataLoader } from '../../../plugins/dataloader';

import type { Feedback } from '../../feedbacks/types/feedback';

const symbol = Symbol('UserSentFeedbacks');

export type UserSentFeedbacksCursor = {
  id: string;
  createdAt: Date;
};

export type UserSentFeedbacksInput = {
  userId: string;
  limit: number;
  cursor: UserSentFeedbacksCursor | undefined;
};

export class UserSentFeedbacksUnexpectedError extends ErrorFactory({
  name: 'UserSentFeedbacksUnexpectedError',
  message: 'Failed to find sent feedbacks for user.',
}) {}

export type UserSentFeedbacksError = (
  | UserSentFeedbacksUnexpectedError
);

export type UserSentFeedbacksNode = Feedback & { cursor: UserSentFeedbacksCursor };

export type UserSentFeedbacks = (
  input: UserSentFeedbacksInput,
) => ResultAsync<UserSentFeedbacksNode[], UserSentFeedbacksError>;

export const userSentFeedbacks: UserSentFeedbacks = (input) => {
  const loader = dataLoader(symbol, () => new DataLoader<UserSentFeedbacksInput, UserSentFeedbacksNode[], string>(async (inputs) => {
    const execute = async (input: UserSentFeedbacksInput): Promise<UserSentFeedbacksNode[]> => {
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
        .innerJoin(schema.slackUsers, eq(schema.slackUsers.id, schema.feedbacks.sendSlackUserId))
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
    (error) => new UserSentFeedbacksUnexpectedError({ cause: error }),
  )();
};
