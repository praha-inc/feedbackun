import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { eq } from 'drizzle-orm';
import { err, ok, ResultAsync } from 'neverthrow';
import { match } from 'ts-pattern';

import { UserId } from '../../users';
import { UserSessionRequest } from '../models/user-session-request';
import { UserSessionRequestId } from '../models/user-session-request-id';
import { UserSessionRequestToken } from '../models/user-session-request-token';

export type FindUserSessionRequestInputUserId = {
  type: 'user-id';
  userId: UserId;
};

export type FindUserSessionRequestInput = (
  | FindUserSessionRequestInputUserId
);

export class FindUserSessionRequestNotFoundError extends CustomError({
  name: 'FindUserSessionRequestNotFoundError',
  message: 'Does not exist user session request.',
}) {}

export class FindUserSessionRequestUnexpectedError extends CustomError({
  name: 'FindUserSessionRequestUnexpectedError',
  message: 'Failed to find user session request.',
}) {}

export type FindUserSessionRequestError = (
  | FindUserSessionRequestNotFoundError
  | FindUserSessionRequestUnexpectedError
);

export type FindUserSessionRequest = (
  input: FindUserSessionRequestInput,
) => ResultAsync<UserSessionRequest, FindUserSessionRequestError>;

const findByUserId = ResultAsync.fromThrowable((input: FindUserSessionRequestInput) =>
  database()
    .select()
    .from(schema.userSessionRequests)
    .where(eq(schema.userSessionRequests.userId, input.userId.value))
    .get(),
);

export const findUserSessionRequest: FindUserSessionRequest = (input) => {
  return match(input)
    .with({ type: 'user-id' }, (input) => findByUserId(input))
    .exhaustive()
    .mapErr((error) => new FindUserSessionRequestUnexpectedError({ cause: error }))
    .andThen((row) => {
      if (!row) return err(new FindUserSessionRequestNotFoundError());
      return ok(new UserSessionRequest({
        id: UserSessionRequestId.reconstruct(row.id),
        userId: UserId.reconstruct(row.userId),
        token: UserSessionRequestToken.reconstruct(row.token),
        createdAt: row.createdAt,
      }));
    });
};
