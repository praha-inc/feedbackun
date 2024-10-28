import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import DataLoader from 'dataloader';
import { inArray } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';

import { dataLoader } from '../../../plugins/dataloader';

import type { SlackUser } from '../../slack-users/types/slack-user';

const symbol = Symbol('UserSlackUsers');

export type UserSlackUsersInput = {
  userId: string;
};

export class UserSlackUsersUnexpectedError extends CustomError({
  name: 'UserSlackUsersUnexpectedError',
  message: 'Failed to find slack users for user.',
}) {}

export type UserSlackUsersError = (
  | UserSlackUsersUnexpectedError
);

export type UserSlackUsers = (
  input: UserSlackUsersInput,
) => ResultAsync<SlackUser[], UserSlackUsersError>;

export const userSlackUsers: UserSlackUsers = (input) => {
  const loader = dataLoader(symbol, () => new DataLoader<string, SlackUser[]>(async (userIds) => {
    const rows = await database()
      .select()
      .from(schema.slackUsers)
      .where(inArray(schema.slackUsers.userId, [...userIds]));

    return userIds.map((userId) => {
      return rows
        .filter((row) => row.userId === userId)
        .map((row) => ({
          id: row.id,
          name: row.name,
        }));
    });
  }));

  return ResultAsync.fromThrowable(
    () => loader.load(input.userId),
    (error) => new UserSlackUsersUnexpectedError({ cause: error }),
  )();
};
