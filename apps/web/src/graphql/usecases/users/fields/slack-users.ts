import { database, schema } from '@feedbackun/package-database';
import { ErrorFactory } from '@praha/error-factory';
import DataLoader from 'dataloader';
import { inArray } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';

import { serialize } from '../../../helpers/serialize';
import { dataLoader } from '../../../plugins/dataloader';

import type { SlackUser } from '../../slack-users/types/slack-user';

const symbol = Symbol('UserSlackUsers');

export type UserSlackUsersInput = {
  userId: string;
};

export class UserSlackUsersUnexpectedError extends ErrorFactory({
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
  const loader = dataLoader(symbol, () => new DataLoader<UserSlackUsersInput, SlackUser[], string>(async (inputs) => {
    const userIds = inputs.map((input) => input.userId);

    const rows = await database()
      .select()
      .from(schema.slackUsers)
      .where(inArray(schema.slackUsers.userId, userIds));

    return inputs.map((input) => {
      return rows
        .filter((row) => row.userId === input.userId)
        .map((row) => ({
          id: row.id,
          name: row.name,
        }));
    });
  }, { cacheKeyFn: serialize }));

  return ResultAsync.fromThrowable(
    () => loader.load(input),
    (error) => new UserSlackUsersUnexpectedError({ cause: error }),
  )();
};
