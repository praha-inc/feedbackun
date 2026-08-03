import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import { eq } from 'drizzle-orm';
import { match } from 'ts-pattern';

import { UserId } from '../../users';
import { UserSessionRequest } from '../models/user-session-request';
import { UserSessionRequestId } from '../models/user-session-request-id';
import { UserSessionRequestToken } from '../models/user-session-request-token';

export type FindUserSessionRequestInputUserId = {
  type: 'user-id';
  userId: UserId;
};

const findByUserId = R.fn({
  try: (input: FindUserSessionRequestInputUserId) =>
    database()
      .select()
      .from(schema.userSessionRequests)
      .where(eq(schema.userSessionRequests.userId, input.userId.value))
      .get(),
  catch: (error) => new FindUserSessionRequestUnexpectedError({ cause: error }),
});

export type FindUserSessionRequestInputToken = {
  type: 'token';
  token: UserSessionRequestToken;
};

const findByToken = R.fn({
  try: (input: FindUserSessionRequestInputToken) =>
    database()
      .select()
      .from(schema.userSessionRequests)
      .where(eq(schema.userSessionRequests.token, input.token.value))
      .get(),
  catch: (error) => new FindUserSessionRequestUnexpectedError({ cause: error }),
});

export type FindUserSessionRequestInput = (
  | FindUserSessionRequestInputUserId
  | FindUserSessionRequestInputToken
);

export class FindUserSessionRequestNotFoundError extends ErrorFactory({
  name: 'FindUserSessionRequestNotFoundError',
  message: 'Does not exist user session request.',
}) {}

export class FindUserSessionRequestUnexpectedError extends ErrorFactory({
  name: 'FindUserSessionRequestUnexpectedError',
  message: 'Failed to find user session request.',
}) {}

export type FindUserSessionRequestError = (
  | FindUserSessionRequestNotFoundError
  | FindUserSessionRequestUnexpectedError
);

export type FindUserSessionRequest = (
  input: FindUserSessionRequestInput,
) => R.ResultAsync<UserSessionRequest, FindUserSessionRequestError>;

export const findUserSessionRequest: FindUserSessionRequest = (input) => {
  return R.pipe(
    match(input)
      .with({ type: 'user-id' }, findByUserId)
      .with({ type: 'token' }, findByToken)
      .exhaustive(),
    R.andThen((row) => {
      if (!row) return R.fail(new FindUserSessionRequestNotFoundError());
      return R.succeed(new UserSessionRequest({
        id: UserSessionRequestId.reconstruct(row.id),
        userId: UserId.reconstruct(row.userId),
        token: UserSessionRequestToken.reconstruct(row.token),
        createdAt: row.createdAt,
      }));
    }),
  );
};
