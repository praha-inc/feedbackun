import {
  SlackChannel,
  SlackChannelId,
  SlackMessage,
  SlackMessageId,
  SlackReaction,
  SlackReactionId,
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
  findSlackReaction,
  FindSlackReactionNotFoundError,
  saveSlackReaction,
  findSlackUser,
  FindSlackUserNotFoundError,
  saveSlackUser,
  saveSlackChannel,
} from '@feedbackun/package-domain';
import { bindAsync, doAsync, structAsync } from '@feedbackun/package-neverthrow';
import { createId } from '@paralleldrive/cuid2';
import { errAsync, ok } from 'neverthrow';

import { getChannel } from './helpers/get-channel';
import { getMessage } from './helpers/get-message';
import { getUser } from './helpers/get-user';
import { postQuestion } from './helpers/post-question';

import type { Env } from '../../types/env';
import type { SlackEmojiId } from '@feedbackun/package-domain';
import type { EventLazyHandler, ReactionAddedEvent, SlackAPIClient, SlackAppContext } from 'slack-edge';

const constructInput = (context: SlackAppContext, payload: ReactionAddedEvent) => structAsync({
  teamId: SlackTeamId.create({ value: context.teamId ?? '' }),
  channelId: SlackChannelId.create({ value: payload.item.channel }),
  messageUserId: SlackUserId.create({ value: payload.item_user }),
  reactionUserId: SlackUserId.create({ value: payload.user }),
  reactionName: ok(payload.reaction),
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
) => doAsync
  .andThen(() => findSlackChannel({
    type: 'slack-team-id-and-slack-channel-id',
    slackTeamId,
    slackChannelId,
  }))
  .orElse((error) => {
    if (!(error instanceof FindSlackChannelNotFoundError)) {
      return errAsync(error);
    }

    return getChannel(client, slackChannelId)
      .andThen((result) => {
        return saveSlackChannel(new SlackChannel({
          id: slackChannelId,
          slackTeamId,
          name: result.channel!.name!,
        }));
      });
  });

const findOrCreateUser = (
  client: SlackAPIClient,
  slackTeamId: SlackTeamId,
  slackUserId: SlackUserId,
) => doAsync
  .andThen(() => findSlackUser({
    type: 'slack-team-id-and-slack-user-id',
    slackTeamId,
    slackUserId,
  }))
  .orElse((error) => {
    if (!(error instanceof FindSlackUserNotFoundError)) {
      return errAsync(error);
    }

    return getUser(client, slackUserId)
      .andThen((result) => {
        return saveSlackUser(new SlackUser({
          id: slackUserId,
          slackTeamId,
          name: result.user!.name!,
        }));
      });
  });

const findOrCreateMessage = (
  client: SlackAPIClient,
  slackChannelId: SlackChannelId,
  slackUserId: SlackUserId,
  slackMessageTs: string,
) => doAsync
  .andThen(() => findSlackMessage({
    type: 'slack-channel-id-and-slack-user-id-and-slack-message-ts',
    slackChannelId,
    slackUserId,
    slackMessageTs,
  }))
  .orElse((error) => {
    if (!(error instanceof FindSlackMessageNotFoundError)) {
      return errAsync(error);
    }

    return getMessage(client, slackChannelId, slackMessageTs)
      .andThen((result) => {
        return saveSlackMessage(new SlackMessage({
          id: SlackMessageId.create({ value: createId() })._unsafeUnwrap(),
          slackChannelId,
          slackUserId,
          text: result.messages![0]!.text!,
          ts: result.messages![0]!.ts!,
        }));
      });
  });

const findOrCreateReaction = (
  slackMessageId: SlackMessageId,
  slackEmojiId: SlackEmojiId,
  slackUserId: SlackUserId,
  slackEmojiTs: string,
) => doAsync
  .andThen(() => findSlackReaction({
    type: 'slack-message-id-and-slack-emoji-id-and-slack-user-id',
    slackMessageId,
    slackEmojiId,
    slackUserId,
  }))
  .orElse((error) => {
    if (!(error instanceof FindSlackReactionNotFoundError)) {
      return errAsync(error);
    }

    return saveSlackReaction(new SlackReaction({
      id: SlackReactionId.create({ value: createId() })._unsafeUnwrap(),
      slackMessageId,
      slackEmojiId,
      slackUserId,
      ts: slackEmojiTs,
    }));
  });

export const reactionAddedHandler: EventLazyHandler<'reaction_added', Env> = async ({
  env: _env,
  context,
  payload,
}) => {
  await doAsync
    .andThen(bindAsync('input', () => constructInput(context, payload)))
    .andThen(bindAsync('team', ({ input }) => findTeam(input.teamId)))
    .andThen(bindAsync('emoji', ({ input, team }) => findEmoji(team.id, input.reactionName)))
    .andThen(bindAsync('channel', ({ input, team }) => findOrCreateChannel(context.client, team.id, input.channelId)))
    .andThen(bindAsync('messageUser', ({ input, team }) => findOrCreateUser(context.client, team.id, input.messageUserId)))
    .andThen(bindAsync('reactionUser', ({ input, team }) => findOrCreateUser(context.client, team.id, input.reactionUserId)))
    .andThen(bindAsync('message', ({ channel, messageUser }) => findOrCreateMessage(context.client, channel.id, messageUser.id, payload.item.ts)))
    .andThen(bindAsync('reaction', ({ message, emoji, reactionUser }) => findOrCreateReaction(message.id, emoji.id, reactionUser.id, payload.event_ts)))
    .andThen(({ channel, messageUser, reactionUser }) => postQuestion(context.client, channel.id, messageUser.id, reactionUser.id, payload.item.ts))
    .match(
      () => {},
      (error) => console.error(error),
    );
};