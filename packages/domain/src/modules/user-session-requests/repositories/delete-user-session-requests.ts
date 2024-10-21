import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { doAsync } from '@feedbackun/package-neverthrow';
import { inArray } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';

import type { UserSessionRequest } from '../models/user-session-request';

export type DeleteUserSessionRequestsInput = UserSessionRequest[];

export class DeleteUserSessionRequestsUnexpectedError extends CustomError({
  name: 'DeleteUserSessionRequestsUnexpectedError',
  message: 'Failed to delete user session requests.',
}) {}

export type DeleteUserSessionRequestsError = (
  | DeleteUserSessionRequestsUnexpectedError
  );

export type DeleteUserSessionRequests = (
  input: DeleteUserSessionRequestsInput,
) => ResultAsync<void, DeleteUserSessionRequestsError>;

export const deleteUserSessionRequests: DeleteUserSessionRequests = (input) => {
  return doAsync
    .andThrough(() => ResultAsync.fromPromise(
      database()
        .delete(schema.userSessionRequests)
        .where(
          inArray(
            schema.userSessionRequests.id,
            input.map((userSessionRequest) => userSessionRequest.id.value),
          ),
        ),
      (error) => new DeleteUserSessionRequestsUnexpectedError({ cause: error }),
    ));
};
