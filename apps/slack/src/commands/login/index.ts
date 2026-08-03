import {
  deleteUserSessionRequest,
  deleteUserSession,
  findSlackTeam,
  findSlackUser,
  findUserSessionRequest,
  findUserSession,
  saveUserSessionRequest,
  SlackChannelId,
  SlackTeamId,
  SlackUserId,
  UserSessionRequest,
  FindUserSessionNotFoundError,
  FindUserSessionRequestNotFoundError,
} from '@feedbackun/package-domain';
import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';

import { postLoginUrl } from './helpers/post-login-url';

import type { Env } from '../../types/env';
import type { UserId } from '@feedbackun/package-domain';
import type { SlackAppContext, SlashCommandLazyHandler } from 'slack-edge';
import type { SlashCommand } from 'slack-edge/dist/request/payload/slash-command';

class LoginCommandUserNotFoundError extends ErrorFactory({
  name: 'LoginCommandUserNotFoundError',
  message: 'Failed to find user.',
}) {}

const constructInput = (context: SlackAppContext, payload: SlashCommand) => R.collect({
  teamId: SlackTeamId.create(context.teamId ?? ''),
  slackChannelId: SlackChannelId.create(payload.channel_id),
  slackUserId: SlackUserId.create(payload.user_id),
});

const deleteUserSessionByUserId = (userId: UserId) => R.pipe(
  findUserSession({
    type: 'user-id',
    userId,
  }),
  R.andThen((session) => deleteUserSession(session)),
  R.orElse((error) => {
    if (error instanceof FindUserSessionNotFoundError) return R.succeed(undefined);
    return R.fail(error);
  }),
);

const deleteUserSessionRequestByUserId = (userId: UserId) => R.pipe(
  findUserSessionRequest({
    type: 'user-id',
    userId,
  }),
  R.andThen((session) => deleteUserSessionRequest(session)),
  R.orElse((error) => {
    if (error instanceof FindUserSessionRequestNotFoundError) return R.succeed(undefined);
    return R.fail(error);
  }),
);

const createUserSessionRequest = (userId: UserId) => saveUserSessionRequest(UserSessionRequest.new(userId));

export const loginCommandHandler: SlashCommandLazyHandler<Env> = async ({
  env,
  context,
  payload,
}) => {
  const result = await R.pipe(
    R.do(),
    R.bind('input', () => constructInput(context, payload)),
    R.bind('team', ({ input }) => findSlackTeam({
      type: 'slack-team-id',
      slackTeamId: input.teamId,
    })),
    R.bind('slackUser', ({ input, team }) => findSlackUser({
      type: 'slack-team-id-and-slack-user-id',
      slackTeamId: team.id,
      slackUserId: input.slackUserId,
    })),
    R.bind('userId', ({ slackUser }) => {
      if (slackUser.userId) return R.succeed(slackUser.userId);
      return R.fail(new LoginCommandUserNotFoundError());
    }),
    R.andThrough(({ userId }) => deleteUserSessionByUserId(userId)),
    R.andThrough(({ userId }) => deleteUserSessionRequestByUserId(userId)),
    R.bind('userSessionRequest', ({ userId }) => createUserSessionRequest(userId)),
    R.andThrough(({ input, userSessionRequest }) => {
      const url = `${env.WEB_URL}/login/${userSessionRequest.token.value}`;
      return postLoginUrl(context.client, input.slackChannelId, input.slackUserId, url);
    }),
  );

  if (R.isFailure(result)) {
    console.error(result.error);
  }
};
