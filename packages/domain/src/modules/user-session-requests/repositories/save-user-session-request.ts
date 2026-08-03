import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { UnexpectedError } from '@praha/error-factory/presets';

import { UserId } from '../../users';
import { UserSessionRequest } from '../models/user-session-request';
import { UserSessionRequestId } from '../models/user-session-request-id';
import { UserSessionRequestToken } from '../models/user-session-request-token';

const insertUserSessionRequest = R.fn({
  try: (userSessionRequest: UserSessionRequest) => database()
    .insert(schema.userSessionRequests)
    .values({
      id: userSessionRequest.id.value,
      userId: userSessionRequest.userId.value,
      token: userSessionRequest.token.value,
      createdAt: userSessionRequest.createdAt,
    })
    .returning()
    .get(),
  catch: (error) => new UnexpectedError({ cause: error }),
});

export type SaveUserSessionRequestInput = UserSessionRequest;

export type SaveUserSessionRequestError = (
  | UnexpectedError
);

export type SaveUserSessionRequest = (
  input: SaveUserSessionRequestInput,
) => R.ResultAsync<UserSessionRequest, SaveUserSessionRequestError>;

export const saveUserSessionRequest: SaveUserSessionRequest = (input) => {
  return R.pipe(
    insertUserSessionRequest(input),
    R.andThen((row) => {
      return R.succeed(new UserSessionRequest({
        id: UserSessionRequestId.reconstruct(row.id),
        userId: UserId.reconstruct(row.userId),
        token: UserSessionRequestToken.reconstruct(row.token),
        createdAt: row.createdAt,
      }));
    }),
  );
};
