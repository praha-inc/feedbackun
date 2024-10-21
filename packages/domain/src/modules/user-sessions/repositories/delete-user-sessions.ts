import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { doAsync } from '@feedbackun/package-neverthrow';
import { inArray } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';

import type { UserSession } from '../models/user-session';

export type DeleteUserSessionsInput = UserSession[];

export class DeleteUserSessionsUnexpectedError extends CustomError({
  name: 'DeleteUserSessionsUnexpectedError',
  message: 'Failed to delete user sessions.',
}) {}

export type DeleteUserSessionsError = (
  | DeleteUserSessionsUnexpectedError
);

export type DeleteUserSessions = (
  input: DeleteUserSessionsInput,
) => ResultAsync<void, DeleteUserSessionsError>;

export const deleteUserSessions: DeleteUserSessions = (input) => {
  return doAsync
    .andThrough(() => ResultAsync.fromPromise(
      database()
        .delete(schema.userSessions)
        .where(
          inArray(
            schema.userSessions.id,
            input.map((userSession) => userSession.id.value),
          ),
        ),
      (error) => new DeleteUserSessionsUnexpectedError({ cause: error }),
    ));
};
