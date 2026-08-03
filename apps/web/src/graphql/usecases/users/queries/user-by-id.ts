import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import { eq } from 'drizzle-orm';

import type { User } from '../types/user';

const query = R.fn({
  try: (input: UserByIdInput) => {
    return database()
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, input.userId))
      .get();
  },
  catch: (error) => new UserByIdUnexpectedError({ cause: error }),
});

export type UserByIdInput = {
  userId: string;
};

export class UserByIdNotFoundError extends ErrorFactory({
  name: 'UserByIdNotFoundError',
  message: 'Does not exist user.',
}) {}

export class UserByIdUnexpectedError extends ErrorFactory({
  name: 'UserByIdUnexpectedError',
  message: 'Failed to find user.',
}) {}

export type UserByIdError = (
  | UserByIdNotFoundError
  | UserByIdUnexpectedError
);

export type UserById = (
  input: UserByIdInput,
) => R.ResultAsync<User, UserByIdError>;

export const userById: UserById = (input) => {
  return R.pipe(
    query(input),
    R.andThen((row) => {
      if (!row) return R.fail(new UserByIdNotFoundError());
      return R.succeed({
        id: row.id,
        type: row.type,
        name: row.name,
        icon: row.icon,
      });
    }),
  );
};
