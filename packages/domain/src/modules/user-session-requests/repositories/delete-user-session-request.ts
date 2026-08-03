import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import { eq } from 'drizzle-orm';

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
) => R.ResultAsync<void, DeleteUserSessionRequestError>;

export const deleteUserSessionRequest: DeleteUserSessionRequest = (input) => {
  return R.pipe(
    R.try({
      try: () => database()
        .delete(schema.userSessionRequests)
        .where(eq(schema.userSessionRequests.id, input.id.value)),
      catch: (error) => new DeleteUserSessionRequestUnexpectedError({ cause: error }),
    }),
    R.map(() => undefined),
  );
};
