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
  UserSessionRequest, FindUserSessionNotFoundError, FindUserSessionRequestNotFoundError,
} from '@feedbackun/package-domain';
import { bindAsync, doAsync, structAsync } from '@feedbackun/package-neverthrow';
import { ErrorFactory } from '@praha/error-factory';
import { err, ok } from 'neverthrow';

import { postLoginUrl } from './helpers/post-login-url';

import type { Env } from '../../types/env';
import type { UserId } from '@feedbackun/package-domain';
import type { SlackAppContext, SlashCommandLazyHandler } from 'slack-edge';
import type { SlashCommand } from 'slack-edge/dist/request/payload/slash-command';

class LoginCommandUserNotFoundError extends ErrorFactory({
  name: 'LoginCommandUserNotFoundError',
  message: 'Failed to find user.',
}) {}

const constructInput = (context: SlackAppContext, payload: SlashCommand) => structAsync({
  teamId: SlackTeamId.create(context.teamId ?? ''),
  slackChannelId: SlackChannelId.create(payload.channel_id),
  slackUserId: SlackUserId.create(payload.user_id),
});

const deleteUserSessionByUserId = (userId: UserId) => doAsync
  .andThen(() => findUserSession({
    type: 'user-id',
    userId,
  }))
  .andThen((session) => deleteUserSession(session))
  .orElse((error) => {
    if (error instanceof FindUserSessionNotFoundError) return doAsync;
    return err(error);
  });

const deleteUserSessionRequestByUserId = (userId: UserId) => doAsync
  .andThen(() => findUserSessionRequest({
    type: 'user-id',
    userId,
  }))
  .andThen((session) => deleteUserSessionRequest(session))
  .orElse((error) => {
    if (error instanceof FindUserSessionRequestNotFoundError) return doAsync;
    return err(error);
  });

const createUserSessionRequest = (userId: UserId) => saveUserSessionRequest(UserSessionRequest.new(userId));

export const loginCommandHandler: SlashCommandLazyHandler<Env> = async ({
  env,
  context,
  payload,
}) => {
  await doAsync
    .andThen(bindAsync('input', () => constructInput(context, payload)))
    .andThen(bindAsync('team', ({ input }) => findSlackTeam({
      type: 'slack-team-id',
      slackTeamId: input.teamId,
    })))
    .andThen(bindAsync('slackUser', ({ input, team }) => findSlackUser({
      type: 'slack-team-id-and-slack-user-id',
      slackTeamId: team.id,
      slackUserId: input.slackUserId,
    })))
    .andThen(bindAsync('userId', ({ slackUser }) => {
      if (slackUser.userId) return ok(slackUser.userId);
      return err(new LoginCommandUserNotFoundError());
    }))
    .andThrough(({ userId }) => deleteUserSessionByUserId(userId))
    .andThrough(({ userId }) => deleteUserSessionRequestByUserId(userId))
    .andThen(bindAsync('userSessionRequest', ({ userId }) => createUserSessionRequest(userId)))
    .andThrough(({ input, userSessionRequest }) => {
      const url = `${env.WEB_URL}/login/${userSessionRequest.token.value}`;
      return postLoginUrl(context.client, input.slackChannelId, input.slackUserId, url);
    })
    .match(
      () => {},
      (error) => console.error(error),
    );
};
