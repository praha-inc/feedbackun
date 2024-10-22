import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { doAsync } from '@feedbackun/package-neverthrow';
import { ok, ResultAsync } from 'neverthrow';

import { UserId } from '../../users';
import { UserSessionRequest } from '../models/user-session-request';
import { UserSessionRequestId } from '../models/user-session-request-id';
import { UserSessionRequestToken } from '../models/user-session-request-token';

export type SaveUserSessionRequestInput = UserSessionRequest;

export class SaveUserSessionRequestUnexpectedError extends CustomError({
  name: 'SaveUserSessionRequestUnexpectedError',
  message: 'Failed to save user session request.',
}) {}

export type SaveUserSessionRequestError = (
  | SaveUserSessionRequestUnexpectedError
);

export type SaveUserSessionRequest = (
  input: SaveUserSessionRequestInput,
) => ResultAsync<UserSessionRequest, SaveUserSessionRequestError>;

const insertUserSessionRequest = (userSessionRequest: UserSessionRequest) => ResultAsync.fromPromise(
  database()
    .insert(schema.userSessionRequests)
    .values({
      id: userSessionRequest.id.value,
      userId: userSessionRequest.userId.value,
      token: userSessionRequest.token.value,
      createdAt: userSessionRequest.createdAt,
    })
    .returning()
    .get(),
  (error) => new SaveUserSessionRequestUnexpectedError({ cause: error }),
);

export const saveUserSessionRequest: SaveUserSessionRequest = (input) => {
  return doAsync
    .andThen(() => insertUserSessionRequest(input))
    .andThen((row) => {
      return ok(new UserSessionRequest({
        id: UserSessionRequestId.reconstruct(row.id),
        userId: UserId.reconstruct(row.userId),
        token: UserSessionRequestToken.reconstruct(row.token),
        createdAt: row.createdAt,
      }));
    });
};
