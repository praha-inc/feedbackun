import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { UnexpectedError } from '@praha/error-factory/presets';
import { eq } from 'drizzle-orm';

import type { UserSessionRequest } from '../models/user-session-request';

export type DeleteUserSessionRequestInput = UserSessionRequest;

export type DeleteUserSessionRequestError = (
  | UnexpectedError
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
      catch: (error) => new UnexpectedError({ cause: error }),
    }),
    R.map(() => undefined),
  );
};
