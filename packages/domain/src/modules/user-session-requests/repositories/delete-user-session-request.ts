import { database, schema } from '@feedbackun/package-database';
import { doAsync } from '@feedbackun/package-neverthrow';
import { ErrorFactory } from '@praha/error-factory';
import { eq } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';

import type { UserSessionRequest } from '../models/user-session-request';

export type DeleteUserSessionRequestInput = UserSessionRequest;

export class DeleteUserSessionRequestUnexpectedError extends ErrorFactory({
  name: 'DeleteUserSessionRequestUnexpectedError',
  message: 'Failed to delete user session request.',
}) {}

export type DeleteUserSessionRequestError = (
  | DeleteUserSessionRequestUnexpectedError
);

export type DeleteUserSessionRequest = (
  input: DeleteUserSessionRequestInput,
) => ResultAsync<void, DeleteUserSessionRequestError>;

export const deleteUserSessionRequest: DeleteUserSessionRequest = (input) => {
  return doAsync
    .andThrough(() => ResultAsync.fromPromise(
      database()
        .delete(schema.userSessionRequests)
        .where(eq(schema.userSessionRequests.id, input.id.value)),
      (error) => new DeleteUserSessionRequestUnexpectedError({ cause: error }),
    ));
};
