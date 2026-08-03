import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import { eq } from 'drizzle-orm';

import type { UserSession } from '../models/user-session';

export type DeleteUserSessionInput = UserSession;

export class DeleteUserSessionUnexpectedError extends ErrorFactory({
  name: 'DeleteUserSessionUnexpectedError',
  message: 'Failed to delete user session.',
}) {}

export type DeleteUserSessionError = (
  | DeleteUserSessionUnexpectedError
);

export type DeleteUserSession = (
  input: DeleteUserSessionInput,
) => R.ResultAsync<void, DeleteUserSessionError>;

export const deleteUserSession: DeleteUserSession = (input) => {
  return R.pipe(
    R.try({
      try: () => database()
        .delete(schema.userSessions)
        .where(eq(schema.userSessions.id, input.id.value)),
      catch: (error) => new DeleteUserSessionUnexpectedError({ cause: error }),
    }),
    R.map(() => undefined),
  );
};
