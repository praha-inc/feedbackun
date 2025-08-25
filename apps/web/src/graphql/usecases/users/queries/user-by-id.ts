import { database, schema } from '@feedbackun/package-database';
import { doAsync } from '@feedbackun/package-neverthrow';
import { ErrorFactory } from '@praha/error-factory';
import { eq } from 'drizzle-orm';
import { err, ok, ResultAsync } from 'neverthrow';

import type { User } from '../types/user';

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
) => ResultAsync<User, UserByIdError>;

const query = ResultAsync.fromThrowable((input: UserByIdInput) => {
  return database()
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, input.userId))
    .get();
});

export const userById: UserById = (input) => {
  return doAsync
    .andThen(() => query(input))
    .mapErr((error) => new UserByIdUnexpectedError({ cause: error }))
    .andThen((row) => {
      if (!row) return err(new UserByIdNotFoundError());
      return ok({
        id: row.id,
        type: row.type,
        name: row.name,
        icon: row.icon,
      });
    });
};
