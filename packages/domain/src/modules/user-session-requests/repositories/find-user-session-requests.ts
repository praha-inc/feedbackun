import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { eq } from 'drizzle-orm';
import { ok, ResultAsync } from 'neverthrow';
import { match } from 'ts-pattern';

import { UserId } from '../../users';
import { UserSessionRequest } from '../models/user-session-request';
import { UserSessionRequestId } from '../models/user-session-request-id';

export type FindUserSessionRequestsInputUserId = {
  type: 'user-id';
  userId: UserId;
};

export type FindUserSessionRequestsInput = (
  | FindUserSessionRequestsInputUserId
);

export class FindUserSessionRequestsUnexpectedError extends CustomError({
  name: 'FindUserSessionRequestsUnexpectedError',
  message: 'Failed to find user session requests.',
}) {}

export type FindUserSessionRequestsError = (
  | FindUserSessionRequestsUnexpectedError
);

export type FindUserSessionRequests = (
  input: FindUserSessionRequestsInput,
) => ResultAsync<UserSessionRequest[], FindUserSessionRequestsError>;

export const findUserSessionRequests: FindUserSessionRequests = (input) => {
  const result = ResultAsync.fromThrowable((input: FindUserSessionRequestsInput) =>
    database()
      .select()
      .from(schema.userSessionRequests)
      .where(eq(schema.userSessionRequests.userId, input.userId.value)),
  );

  return match(input)
    .with({ type: 'user-id' }, (input) => result(input))
    .exhaustive()
    .mapErr((error) => new FindUserSessionRequestsUnexpectedError({ cause: error }))
    .andThen((rows) => {
      return ok(rows.map((row) => new UserSessionRequest({
        id: UserSessionRequestId.create(row.id)._unsafeUnwrap(),
        userId: UserId.create(row.userId)._unsafeUnwrap(),
        token: row.token,
        expiredAt: row.expiredAt,
      })));
    });
};
