import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';

import { UserId } from '../../users';
import { UserSession } from '../models/user-session';
import { UserSessionId } from '../models/user-session-id';
import { UserSessionToken } from '../models/user-session-token';

const insertUserSession = R.fn({
  try: (userSession: UserSession) => database()
    .insert(schema.userSessions)
    .values({
      id: userSession.id.value,
      userId: userSession.userId.value,
      token: userSession.token.value,
      createdAt: userSession.createdAt,
    })
    .returning()
    .get(),
  catch: (error) => new SaveUserSessionUnexpectedError({ cause: error }),
});

export type SaveUserSessionInput = UserSession;

export class SaveUserSessionUnexpectedError extends ErrorFactory({
  name: 'SaveUserSessionUnexpectedError',
  message: 'Failed to save user session.',
}) {}

export type SaveUserSessionError = (
  | SaveUserSessionUnexpectedError
);

export type SaveUserSession = (
  input: SaveUserSessionInput,
) => R.ResultAsync<UserSession, SaveUserSessionError>;

export const saveUserSession: SaveUserSession = (input) => {
  return R.pipe(
    insertUserSession(input),
    R.andThen((row) => {
      return R.succeed(new UserSession({
        id: UserSessionId.reconstruct(row.id),
        userId: UserId.reconstruct(row.userId),
        token: UserSessionToken.reconstruct(row.token),
        createdAt: row.createdAt,
      }));
    }),
  );
};
