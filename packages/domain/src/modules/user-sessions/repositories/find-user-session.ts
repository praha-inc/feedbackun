import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { eq } from 'drizzle-orm';
import { err, ok, ResultAsync } from 'neverthrow';
import { match } from 'ts-pattern';

import { UserId } from '../../users';
import { UserSession } from '../models/user-session';
import { UserSessionId } from '../models/user-session-id';
import { UserSessionToken } from '../models/user-session-token';

export type FindUserSessionInputUserId = {
  type: 'user-id';
  userId: UserId;
};

export type FindUserSessionInputToken = {
  type: 'token';
  token: UserSessionToken;
};

export type FindUserSessionInput = (
  | FindUserSessionInputUserId
  | FindUserSessionInputToken
);

export class FindUserSessionNotFoundError extends CustomError({
  name: 'FindUserSessionNotFoundError',
  message: 'Does not exist user session.',
}) {}

export class FindUserSessionUnexpectedError extends CustomError({
  name: 'FindUserSessionUnexpectedError',
  message: 'Failed to find user Session.',
}) {}

export type FindUserSessionError = (
  | FindUserSessionNotFoundError
  | FindUserSessionUnexpectedError
);

export type FindUserSession = (
  input: FindUserSessionInput,
) => ResultAsync<UserSession, FindUserSessionError>;

const findByUserId = ResultAsync.fromThrowable((input: FindUserSessionInputUserId) =>
  database()
    .select()
    .from(schema.userSessions)
    .where(eq(schema.userSessions.userId, input.userId.value))
    .get(),
);

const findByToken = ResultAsync.fromThrowable((input: FindUserSessionInputToken) =>
  database()
    .select()
    .from(schema.userSessions)
    .where(eq(schema.userSessions.token, input.token.value))
    .get(),
);

export const findUserSession: FindUserSession = (input) => {
  return match(input)
    .with({ type: 'user-id' }, (input) => findByUserId(input))
    .with({ type: 'token' }, (input) => findByToken(input))
    .exhaustive()
    .mapErr((error) => new FindUserSessionUnexpectedError({ cause: error }))
    .andThen((row) => {
      if (!row) return err(new FindUserSessionNotFoundError());
      return ok(new UserSession({
        id: UserSessionId.reconstruct(row.id),
        userId: UserId.reconstruct(row.userId),
        token: UserSessionToken.reconstruct(row.token),
        createdAt: row.createdAt,
      }));
    });
};
