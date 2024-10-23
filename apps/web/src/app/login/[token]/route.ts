import { withDatabase } from '@feedbackun/package-database';
import {
  findUserSessionRequest,
  UserSession,
  UserSessionRequestToken,
  saveUserSession,
  deleteUserSessionRequest,
} from '@feedbackun/package-domain';
import { doAsync } from '@feedbackun/package-neverthrow';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { err, ok } from 'neverthrow';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type Context = {
  params: {
    token: string;
  };
};

export const GET = async (_request: Request, { params }: Context) => {
  const { env } = await getCloudflareContext();
  return withDatabase(env.DB, async () => {
    return await doAsync
      .andThen(() => UserSessionRequestToken.create(params.token))
      .andThen((token) => findUserSessionRequest({ type: 'token', token }))
      .andThrough((userSessionRequest) => deleteUserSessionRequest(userSessionRequest))
      .andThen((userSessionRequest) => {
        if (userSessionRequest.isExpired()) {
          return err(new Error('User session request is expired'));
        }
        return ok(userSessionRequest);
      })
      .map((userSessionRequest) => UserSession.new(userSessionRequest.userId))
      .andThen((userSession) => saveUserSession(userSession))
      .match(
        (userSession) => {
          cookies().set('session_token', userSession.token.value, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
          });
          redirect('/');
        },
        (error) => new Response(error.message, { status: 400 }),
      );
  });
};
