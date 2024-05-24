import {
  SlackChannel,
  SlackChannelId,
  SlackMessage,
  SlackMessageId,
  SlackTeamId,
  SlackUser,
  SlackUserId,
  FindSlackChannelNotFoundError,
  findSlackChannel,
  findSlackTeam,
  findSlackEmoji,
  findSlackMessage,
  FindSlackMessageNotFoundError,
  saveSlackMessage,
  findSlackUser,
  FindSlackUserNotFoundError,
  saveSlackUser,
  saveSlackChannel,
} from '@feedbackun/package-domain';
import { createId } from '@paralleldrive/cuid2';
import { errAsync, okAsync, Result, ResultAsync } from 'neverthrow';

import type { Env } from '../../types/env';
import type { EventLazyHandler } from 'slack-edge/dist/handler/handler';

export const reactionAddedHandler: EventLazyHandler<'reaction_added', Env> = async ({
  env: _env,
  context,
  payload,
}) => {
  const getUser = ResultAsync.fromThrowable(async (userId: SlackUserId) => {
    return await context.client.users.info({ user: userId.value });
  });

  const getChannel = ResultAsync.fromThrowable(async (channelId: SlackChannelId) => {
    return await context.client.conversations.info({ channel: channelId.value });
  });

  const getMessage = ResultAsync.fromThrowable(async (channelId: SlackChannelId, ts: string) => {
    return await context.client.conversations.history({ channel: channelId.value, latest: ts, inclusive: true, limit: 1 });
  });

  const input = Result.combineWithAllErrors([
    SlackTeamId.create({ value: context.teamId ?? '' }),
    SlackChannelId.create({ value: payload.item.channel }),
    SlackUserId.create({ value: payload.item_user }),
    SlackUserId.create({ value: payload.user }),
  ]);

  await input
    .map((inputs) => ({
      input: {
        teamId: inputs[0],
        channelId: inputs[1],
        messageUserId: inputs[2],
        reactionUserId: inputs[3],
        reactionName: payload.reaction,
      },
    }))
    .asyncAndThen(({ input }) => {
      return okAsync({})
        .andThen(() => findSlackTeam({
          type: 'slack-team-id',
          slackTeamId: input.teamId,
        }))
        .map(team => ({ input, team }));
    })
    .andThen(({ input, team, ...rest }) => {
      return okAsync({})
        .andThen(() => findSlackEmoji({
          type: 'slack-team-id-and-slack-emoji-name',
          slackTeamId: team.id,
          name: input.reactionName,
        }))
        .map(() => ({ input, team, ...rest }));
    })
    .andThen(({ input, team, ...rest }) => {
      return okAsync({})
        .andThen(() => findSlackChannel({
          type: 'slack-team-id-and-slack-channel-id',
          slackTeamId: team.id,
          slackChannelId: input.channelId,
        }))
        .orElse(error => {
          if (!(error instanceof FindSlackChannelNotFoundError)) {
            return errAsync(error);
          }

          return getChannel(input.channelId)
            .andThen(result => {
              return saveSlackChannel(new SlackChannel({
                id: input.channelId,
                slackTeamId: team.id,
                name: result.channel!.name!,
              }));
            });
        })
        .map(channel => ({ input, team, channel, ...rest }));
    })
    .andThen(({ input, team, ...rest }) => {
      return okAsync({})
        .andThen(() => findSlackUser({
          type: 'slack-team-id-and-slack-user-id',
          slackTeamId: team.id,
          slackUserId: input.messageUserId,
        }))
        .orElse(error => {
          if (!(error instanceof FindSlackUserNotFoundError)) {
            return errAsync(error);
          }

          return getUser(input.messageUserId)
            .andThen(result => {
              return saveSlackUser(new SlackUser({
                id: input.messageUserId,
                slackTeamId: team.id,
                name: result.user!.name!,
              }));
            });
        })
        .map(messageUser => ({ input, team, messageUser, ...rest }));
    })
    .andThen(({ input, team, ...rest }) => {
      return okAsync({})
        .andThen(() => findSlackUser({
          type: 'slack-team-id-and-slack-user-id',
          slackTeamId: team.id,
          slackUserId: input.reactionUserId,
        }))
        .orElse(error => {
          if (!(error instanceof FindSlackUserNotFoundError)) {
            return errAsync(error);
          }

          return getUser(input.reactionUserId)
            .andThen(result => {
              return saveSlackUser(new SlackUser({
                id: input.reactionUserId,
                slackTeamId: team.id,
                name: result.user!.name!,
              }));
            });
        })
        .map(reactionUser => ({ input, team, reactionUser, ...rest }));
    })
    .andThen(({ channel, messageUser }) => {
      return okAsync({})
        .andThen(() => findSlackMessage({
          type: 'slack-channel-id-and-slack-user-id-and-slack-message-ts',
          slackChannelId: channel.id,
          slackUserId: messageUser.id,
          slackMessageTs: payload.item.ts,
        }))
        .orElse(error => {
          if (!(error instanceof FindSlackMessageNotFoundError)) {
            return errAsync(error);
          }

          return getMessage(channel.id, payload.item.ts)
            .andThen(result => {
              return saveSlackMessage(new SlackMessage({
                id: SlackMessageId.create({ value: createId() })._unsafeUnwrap(),
                slackChannelId: channel.id,
                slackUserId: messageUser.id,
                text: result.messages![0]!.text!,
                ts: result.messages![0]!.ts!,
              }));
            });
        });
    })
    .match(
      () => {},
      error => console.error(error),
    );
};
