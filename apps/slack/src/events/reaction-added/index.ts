import {
  SlackChannel,
  SlackChannelId,
  SlackMessage,
  SlackMessageId,
  SlackTeamId,
  SlackUserId,
  FindSlackChannelNotFoundError,
  findSlackChannel,
  findSlackTeam,
  findSlackEmoji,
  findSlackMessage,
  FindSlackMessageNotFoundError,
  saveSlackMessage,
  findSlackUser,
  saveSlackChannel,
} from '@feedbackun/package-domain';
import { R } from '@praha/byethrow';

import { getChannel } from './helpers/get-channel';
import { getMessage } from './helpers/get-message';
import { postQuestion } from './helpers/post-question';

import type { Env } from '../../types/env';
import type { EventLazyHandler, ReactionAddedEvent, SlackAPIClient, SlackAppContext } from 'slack-edge';

const constructInput = (context: SlackAppContext, payload: ReactionAddedEvent) => R.collect({
  teamId: SlackTeamId.create(context.teamId ?? ''),
  channelId: SlackChannelId.create(payload.item.channel),
  messageUserId: SlackUserId.create(payload.item_user),
  reactionUserId: SlackUserId.create(payload.user),
  reactionName: R.succeed(payload.reaction),
});

const findTeam = (slackTeamId: SlackTeamId) => findSlackTeam({
  type: 'slack-team-id',
  slackTeamId,
});

const findEmoji = (slackTeamId: SlackTeamId, name: string) => findSlackEmoji({
  type: 'slack-team-id-and-slack-emoji-name',
  slackTeamId,
  name,
});

const findOrCreateChannel = (
  client: SlackAPIClient,
  slackTeamId: SlackTeamId,
  slackChannelId: SlackChannelId,
) => R.pipe(
  findSlackChannel({
    type: 'slack-team-id-and-slack-channel-id',
    slackTeamId,
    slackChannelId,
  }),
  R.orElse((error) => {
    if (!(error instanceof FindSlackChannelNotFoundError)) {
      return R.fail(error);
    }

    return R.pipe(
      getChannel(client, slackChannelId),
      R.andThen((result) => {
        return saveSlackChannel(new SlackChannel({
          id: slackChannelId,
          slackTeamId,
          name: result.channel!.name!,
        }));
      }),
    );
  }),
);

const findUser = (
  slackTeamId: SlackTeamId,
  slackUserId: SlackUserId,
) => findSlackUser({
  type: 'slack-team-id-and-slack-user-id',
  slackTeamId,
  slackUserId,
});

const findOrCreateMessage = (
  client: SlackAPIClient,
  slackChannelId: SlackChannelId,
  slackUserId: SlackUserId,
  slackMessageTs: string,
) => R.pipe(
  findSlackMessage({
    type: 'slack-channel-id-and-slack-user-id-and-slack-message-ts',
    slackChannelId,
    slackUserId,
    slackMessageTs,
  }),
  R.orElse((error) => {
    if (!(error instanceof FindSlackMessageNotFoundError)) {
      return R.fail(error);
    }

    return R.pipe(
      getMessage(client, slackChannelId, slackMessageTs),
      R.andThen((result) => {
        return saveSlackMessage(new SlackMessage({
          id: SlackMessageId.new(),
          slackChannelId,
          slackUserId,
          text: result.messages![0]!.text!,
          ts: result.messages![0]!.ts!,
          threadTs: result.messages![0]!.thread_ts! ?? result.messages![0]!.ts!,
        }));
      }),
    );
  }),
);

export const reactionAddedHandler: EventLazyHandler<'reaction_added', Env> = async ({
  context,
  payload,
}) => {
  const result = await R.pipe(
    R.do(),
    R.bind('input', () => constructInput(context, payload)),
    R.bind('team', ({ input }) => findTeam(input.teamId)),
    R.bind('emoji', ({ input, team }) => findEmoji(team.id, input.reactionName)),
    R.bind('messageUser', ({ input, team }) => findUser(team.id, input.messageUserId)),
    R.bind('reactionUser', ({ input, team }) => findUser(team.id, input.reactionUserId)),
    R.bind('channel', ({ input, team }) => findOrCreateChannel(context.client, team.id, input.channelId)),
    R.bind('message', ({ channel, messageUser }) => findOrCreateMessage(context.client, channel.id, messageUser.id, payload.item.ts)),
    R.andThen(({ channel, messageUser, reactionUser, message }) => postQuestion(context.client, channel, messageUser, reactionUser, message)),
  );

  if (R.isFailure(result)) {
    console.error(result.error);
  }
};
