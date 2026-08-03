import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import { UnexpectedError } from '@praha/error-factory/presets';
import { eq } from 'drizzle-orm';
import { match } from 'ts-pattern';

import { UserId } from '../../users';
import { UserSession } from '../models/user-session';
import { UserSessionId } from '../models/user-session-id';
import { UserSessionToken } from '../models/user-session-token';

export type FindUserSessionInputUserId = {
  type: 'user-id';
  userId: UserId;
};

const findByUserId = R.fn({
  try: (input: FindUserSessionInputUserId) =>
    database()
      .select()
      .from(schema.userSessions)
      .where(eq(schema.userSessions.userId, input.userId.value))
      .get(),
  catch: (error) => new UnexpectedError({ cause: error }),
});

export type FindUserSessionInputToken = {
  type: 'token';
  token: UserSessionToken;
};

const findByToken = R.fn({
  try: (input: FindUserSessionInputToken) =>
    database()
      .select()
      .from(schema.userSessions)
      .where(eq(schema.userSessions.token, input.token.value))
      .get(),
  catch: (error) => new UnexpectedError({ cause: error }),
});

export type FindUserSessionInput = (
  | FindUserSessionInputUserId
  | FindUserSessionInputToken
);

export class FindUserSessionNotFoundError extends ErrorFactory({
  name: 'FindUserSessionNotFoundError',
  message: 'Does not exist user session.',
}) {}

export type FindUserSessionError = (
  | FindUserSessionNotFoundError
  | UnexpectedError
);

export type FindUserSession = (
  input: FindUserSessionInput,
) => R.ResultAsync<UserSession, FindUserSessionError>;

export const findUserSession: FindUserSession = (input) => {
  return R.pipe(
    match(input)
      .with({ type: 'user-id' }, (input) => findByUserId(input))
      .with({ type: 'token' }, (input) => findByToken(input))
      .exhaustive(),
    R.andThen((row) => {
      if (!row) return R.fail(new FindUserSessionNotFoundError());
      return R.succeed(new UserSession({
        id: UserSessionId.reconstruct(row.id),
        userId: UserId.reconstruct(row.userId),
        token: UserSessionToken.reconstruct(row.token),
        createdAt: row.createdAt,
      }));
    }),
  );
};
