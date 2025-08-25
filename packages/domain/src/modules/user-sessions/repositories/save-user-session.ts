import { database, schema } from '@feedbackun/package-database';
import { doAsync } from '@feedbackun/package-neverthrow';
import { ErrorFactory } from '@praha/error-factory';
import { ok, ResultAsync } from 'neverthrow';

import { UserId } from '../../users';
import { UserSession } from '../models/user-session';
import { UserSessionId } from '../models/user-session-id';
import { UserSessionToken } from '../models/user-session-token';

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
) => ResultAsync<UserSession, SaveUserSessionError>;

const insertUserSession = (userSession: UserSession) => ResultAsync.fromPromise(
  database()
    .insert(schema.userSessions)
    .values({
      id: userSession.id.value,
      userId: userSession.userId.value,
      token: userSession.token.value,
      createdAt: userSession.createdAt,
    })
    .returning()
    .get(),
  (error) => new SaveUserSessionUnexpectedError({ cause: error }),
);

export const saveUserSession: SaveUserSession = (input) => {
  return doAsync
    .andThen(() => insertUserSession(input))
    .andThen((row) => {
      return ok(new UserSession({
        id: UserSessionId.reconstruct(row.id),
        userId: UserId.reconstruct(row.userId),
        token: UserSessionToken.reconstruct(row.token),
        createdAt: row.createdAt,
      }));
    });
};
