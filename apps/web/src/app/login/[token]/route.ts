import { withDatabase } from '@feedbackun/package-database';
import { findUserSessionRequest, UserSession, UserSessionRequestToken, saveUserSession, deleteUserSessionRequest } from '@feedbackun/package-domain';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { R } from '@praha/byethrow';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type LoginTokenContext = RouteContext<'/login/[token]'>;

export const GET = async (_request: Request, { params }: LoginTokenContext) => {
  const { env } = getCloudflareContext();
  const { token } = await params;
  const cookieStore = await cookies();

  return withDatabase(env.DB, async () => {
    return await R.pipe(
      UserSessionRequestToken.create(token),
      R.andThen((token) => findUserSessionRequest({ type: 'token', token })),
      R.andThrough((userSessionRequest) => deleteUserSessionRequest(userSessionRequest)),
      R.andThen((userSessionRequest) => {
        if (userSessionRequest.isExpired()) {
          return R.fail(new Error('User session request is expired'));
        }
        return R.succeed(userSessionRequest);
      }),
      R.map((userSessionRequest) => UserSession.new(userSessionRequest.userId)),
      R.andThen((userSession) => saveUserSession(userSession)),
      R.map((value) => {
        cookieStore.set('session_token', value.token.value, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        });
        redirect('/');
      }),
      R.orElse((error) => R.succeed(new Response(error.message, { status: 400 }))),
      R.unwrap(),
    );
  });
};
