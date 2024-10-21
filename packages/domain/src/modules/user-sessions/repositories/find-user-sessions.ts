import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { eq } from 'drizzle-orm';
import { ok, ResultAsync } from 'neverthrow';
import { match } from 'ts-pattern';

import { UserId } from '../../users';
import { UserSession } from '../models/user-session';
import { UserSessionId } from '../models/user-session-id';

export type FindUserSessionsInputUserId = {
  type: 'user-id';
  userId: UserId;
};

export type FindUserSessionsInput = (
  | FindUserSessionsInputUserId
);

export class FindUserSessionsUnexpectedError extends CustomError({
  name: 'FindUserSessionsUnexpectedError',
  message: 'Failed to find user sessions.',
}) {}

export type FindUserSessionsError = (
  | FindUserSessionsUnexpectedError
);

export type FindUserSessions = (
  input: FindUserSessionsInput,
) => ResultAsync<UserSession[], FindUserSessionsError>;

const findByUserId = ResultAsync.fromThrowable((input: FindUserSessionsInput) =>
  database()
    .select()
    .from(schema.userSessions)
    .where(eq(schema.userSessions.userId, input.userId.value)),
);

export const findUserSessions: FindUserSessions = (input) => {
  return match(input)
    .with({ type: 'user-id' }, (input) => findByUserId(input))
    .exhaustive()
    .mapErr((error) => new FindUserSessionsUnexpectedError({ cause: error }))
    .andThen((rows) => {
      return ok(rows.map((row) => new UserSession({
        id: UserSessionId.create(row.id)._unsafeUnwrap(),
        userId: UserId.create(row.userId)._unsafeUnwrap(),
        token: row.token,
        expiredAt: row.expiredAt,
      })));
    });
};
