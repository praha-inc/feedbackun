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

const findByUserId = ResultAsync.fromThrowable((input: FindUserSessionRequestsInput) =>
  database()
    .select()
    .from(schema.userSessionRequests)
    .where(eq(schema.userSessionRequests.userId, input.userId.value)),
);

export const findUserSessionRequests: FindUserSessionRequests = (input) => {
  return match(input)
    .with({ type: 'user-id' }, (input) => findByUserId(input))
    .exhaustive()
    .mapErr((error) => new FindUserSessionRequestsUnexpectedError({ cause: error }))
    .andThen((rows) => {
      return ok(rows.map((row) => new UserSessionRequest({
        id: UserSessionRequestId.reconstruct(row.id),
        userId: UserId.reconstruct(row.userId),
        token: row.token,
        createdAt: row.createdAt,
      })));
    });
};
