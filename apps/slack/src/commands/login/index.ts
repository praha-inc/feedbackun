import { CustomError } from '@feedbackun/package-custom-error';
import {
  deleteUserSessionRequests,
  deleteUserSessions,
  findSlackTeam,
  findSlackUser,
  findUserSessionRequests,
  findUserSessions,
  SlackTeamId,
  SlackUserId,
} from '@feedbackun/package-domain';
import { bindAsync, doAsync, structAsync } from '@feedbackun/package-neverthrow';
import { err, ok } from 'neverthrow';

import type { Env } from '../../types/env';
import type { UserId } from '@feedbackun/package-domain';
import type { SlackAppContext, SlashCommandLazyHandler } from 'slack-edge';
import type { SlashCommand } from 'slack-edge/dist/request/payload/slash-command';

class LoginCommandUserNotFoundError extends CustomError({
  name: 'LoginCommandUserNotFoundError',
  message: 'Failed to find user.',
}) {}

const constructInput = (context: SlackAppContext, payload: SlashCommand) => structAsync({
  teamId: SlackTeamId.create(context.teamId ?? ''),
  slackUserId: SlackUserId.create(payload.user_id),
});

const deleteUserSessionsByUserId = (userId: UserId) => doAsync
  .andThen(() => findUserSessions({
    type: 'user-id',
    userId,
  }))
  .andThen((sessions) => deleteUserSessions(sessions));

const deleteUserSessionRequestsByUserId = (userId: UserId) => doAsync
  .andThen(() => findUserSessionRequests({
    type: 'user-id',
    userId,
  }))
  .andThen((sessions) => deleteUserSessionRequests(sessions));

export const loginCommandHandler: SlashCommandLazyHandler<Env> = async ({
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
    .andThen(({ slackUser }) => {
      if (slackUser.userId) return ok(slackUser.userId);
      return err(new LoginCommandUserNotFoundError());
    })
    .andThrough((userId) => deleteUserSessionsByUserId(userId))
    .andThrough((userId) => deleteUserSessionRequestsByUserId(userId))
    .match(
      (result) => console.log(result),
      (error) => console.error(error),
    );
};
