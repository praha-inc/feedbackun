import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { doAsync } from '@feedbackun/package-neverthrow';
import { eq } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';

import type { UserSession } from '../models/user-session';

export type DeleteUserSessionInput = UserSession;

export class DeleteUserSessionUnexpectedError extends CustomError({
  name: 'DeleteUserSessionUnexpectedError',
  message: 'Failed to delete user session.',
}) {}

export type DeleteUserSessionError = (
  | DeleteUserSessionUnexpectedError
);

export type DeleteUserSession = (
  input: DeleteUserSessionInput,
) => ResultAsync<void, DeleteUserSessionError>;

export const deleteUserSession: DeleteUserSession = (input) => {
  return doAsync
    .andThrough(() => ResultAsync.fromPromise(
      database()
        .delete(schema.userSessions)
        .where(eq(schema.userSessions.id, input.id.value)),
      (error) => new DeleteUserSessionUnexpectedError({ cause: error }),
    ));
};
