import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { UnexpectedError } from '@praha/error-factory/presets';
import DataLoader from 'dataloader';
import { inArray } from 'drizzle-orm';

import { serialize } from '../../../helpers/serialize';
import { dataLoader } from '../../../plugins/dataloader';

import type { SlackUser } from '../../slack-users/types/slack-user';

const symbol = Symbol('UserSlackUsers');

export type UserSlackUsersInput = {
  userId: string;
};

export type UserSlackUsersError = (
  | UnexpectedError
);

export type UserSlackUsers = (
  input: UserSlackUsersInput,
) => R.ResultAsync<SlackUser[], UserSlackUsersError>;

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

  return R.try({
    try: () => loader.load(input),
    catch: (error) => new UnexpectedError({ cause: error }),
  });
};
