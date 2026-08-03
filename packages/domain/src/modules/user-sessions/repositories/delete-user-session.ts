import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { UnexpectedError } from '@praha/error-factory/presets';
import { eq } from 'drizzle-orm';

import type { UserSession } from '../models/user-session';

export type DeleteUserSessionInput = UserSession;

export type DeleteUserSessionError = (
  | UnexpectedError
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
      catch: (error) => new UnexpectedError({ cause: error }),
    }),
    R.map(() => undefined),
  );
};
