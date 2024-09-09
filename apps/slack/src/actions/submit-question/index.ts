import {
  Feedback,
  FeedbackId,
  SlackMessageId,
  WorkSkillElementId,
  saveFeedback,
  SlackUserId, SlackChannelId,
} from '@feedbackun/package-domain';
import {
  bindSync,
  doAsync,
  doSync,
  passThroughAsync,
  structSync,
} from '@feedbackun/package-neverthrow';
import { createId } from '@paralleldrive/cuid2';
import { ok, Result } from 'neverthrow';
import * as v from 'valibot';

import { deleteMessage } from './helpers/delete-message';
import { postFailureMessage } from './helpers/post-failure-message';
import { postSuccessMessage } from './helpers/post-success-message';

import type { Env } from '../../types/env';
import type { BlockActionAckHandler } from 'slack-edge';

export const submitQuestionHandler: BlockActionAckHandler<'button', Env> = async ({
  payload,
  context,
}) => {
  const {
    slackMessageId,
    sendSlackUserId,
    receiveSlackUserId,
  } = v.parse(v.object({
    slackMessageId: v.string(),
    sendSlackUserId: v.string(),
    receiveSlackUserId: v.string(),
  }), JSON.parse(payload.actions[0]?.value ?? ''));

  const values = v.parse(v.object({
    content: v.object({
      input: v.object({
        value: v.string(),
      }),
    }),
    skills: v.object({
      input: v.object({
        selected_options: v.array(v.object({
          value: v.string(),
        })),
      }),
    }),
  }), payload.state?.values);

  await doSync
    .andThen(bindSync('container', () => structSync({
      channelId: SlackChannelId.create({ value: payload.container.channel_id ?? '' }),
      messageTs: ok(payload.container.message_ts!),
    })))
    .andThen(bindSync('values', () => structSync({
      id: FeedbackId.create({ value: createId() }),
      sendSlackUserId: SlackUserId.create({ value: sendSlackUserId }),
      receiveSlackUserId: SlackUserId.create({ value: receiveSlackUserId }),
      slackMessageId: SlackMessageId.create({ value: slackMessageId }),
      workSkillElementIds: Result.combine(values.skills.input.selected_options.map(({ value }) => WorkSkillElementId.create({ value }))),
      content: ok(values.content.input.value),
      createdAt: ok(new Date()),
    })))
    .asyncAndThen(({ container, values }) => {
      return doAsync
        .andThen(passThroughAsync(() => deleteMessage(context.client, container.channelId, container.messageTs)))
        .andThen(bindSync('feedback', () => ok(new Feedback(values))))
        .andThen(passThroughAsync(({ feedback }) => saveFeedback(feedback)))
        .andThen(() => postSuccessMessage(context.client, container.channelId, values.sendSlackUserId))
        .orElse((error) => {
          console.error(error);
          return postFailureMessage(context.client, container.channelId, values.sendSlackUserId);
        });
    })
    .match(
      () => {},
      (error) => console.error(error),
    );
};