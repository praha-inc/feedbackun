import {
  SlackChannel,
  SlackChannelId,
  SlackTeamId,
  SlackUser,
  SlackUserId,
  FindSlackChannelBySlackTeamIdAndSlackChannelIdNotFoundError,
  findSlackChannelBySlackTeamIdAndSlackChannelId,
  findSlackTeamBySlackTeamId,
  findSlackEmojiBySlackTeamIdAndSlackEmojiName,
  findSlackUserBySlackTeamIdAndSlackUserId,
  FindSlackUserBySlackTeamIdAndSlackUserIdNotFoundError,
  saveSlackUser,
  saveSlackChannel,
} from '@feedbackun/package-domain';
import { errAsync, Result, ResultAsync } from 'neverthrow';

import type { Env } from '../../types/env';
import type { EventLazyHandler } from 'slack-edge/dist/handler/handler';

export const reactionAddedHandler: EventLazyHandler<'reaction_added', Env> = async ({
  env: _env,
  context,
  payload,
}) => {
  const input = Result.combineWithAllErrors([
    SlackTeamId.create({ value: context.teamId ?? '' }),
    SlackChannelId.create({ value: payload.item.channel }),
    SlackUserId.create({ value: payload.item_user }),
    SlackUserId.create({ value: payload.user }),
  ]);

  const getUser = ResultAsync.fromThrowable(async (userId: SlackUserId) => {
    return await context.client.users.info({ user: userId.value });
  });

  const getChannel = ResultAsync.fromThrowable(async (channelId: SlackChannelId) => {
    return await context.client.conversations.info({ channel: channelId.value });
  });

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
      return findSlackTeamBySlackTeamId({ slackTeamId: input.teamId })
        .map(team => ({ input, team }));
    })
    .andThen(({ input, team, ...rest }) => {
      return findSlackEmojiBySlackTeamIdAndSlackEmojiName({ slackTeamId: team.id, name: input.reactionName })
        .map(() => ({ input, team, ...rest }));
    })
    .andThen(({ input, team, ...rest }) => {
      return findSlackChannelBySlackTeamIdAndSlackChannelId({ slackTeamId: team.id, slackChannelId: input.channelId })
        .orElse(error => {
          if (!(error instanceof FindSlackChannelBySlackTeamIdAndSlackChannelIdNotFoundError)) {
            return errAsync(error);
          }

          return getChannel(input.channelId)
            .andThen(channel => {
              return saveSlackChannel(new SlackChannel({
                id: input.channelId,
                slackTeamId: team.id,
                name: channel.channel?.name ?? '',
              }));
            });
        })
        .map(channel => ({ input, team, channel, ...rest }));
    })
    .andThen(({ input, team, ...rest }) => {
      return findSlackUserBySlackTeamIdAndSlackUserId({ slackTeamId: team.id, slackUserId: input.messageUserId })
        .orElse(error => {
          if (!(error instanceof FindSlackUserBySlackTeamIdAndSlackUserIdNotFoundError)) {
            return errAsync(error);
          }

          return getUser(input.messageUserId)
            .andThen(user => {
              return saveSlackUser(new SlackUser({
                id: input.messageUserId,
                slackTeamId: team.id,
                name: user.user?.name ?? '',
              }));
            });
        })
        .map(messageUser => ({ input, team, messageUser, ...rest }));
    })
    .andThen(({ input, team, ...rest }) => {
      return findSlackUserBySlackTeamIdAndSlackUserId({ slackTeamId: team.id, slackUserId: input.reactionUserId })
        .orElse(error => {
          if (!(error instanceof FindSlackUserBySlackTeamIdAndSlackUserIdNotFoundError)) {
            return errAsync(error);
          }

          return getUser(input.reactionUserId)
            .andThen(user => {
              return saveSlackUser(new SlackUser({
                id: input.reactionUserId,
                slackTeamId: team.id,
                name: user.user?.name ?? '',
              }));
            });
        })
        .map(reactionUser => ({ input, team, reactionUser, ...rest }));
    })
    .match(
      () => {},
      error => console.error(error),
    );
};
