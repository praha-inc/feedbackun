import {
  Feedback,
  FeedbackId,
  SlackMessageId,
  SkillElementId,
  saveFeedback,
  SlackUserId,
  SlackChannelId,
} from '@feedbackun/package-domain';
import { R } from '@praha/byethrow';
import * as v from 'valibot';

import { completeQuestion } from './helpers/complete-question';
import { postFailureMessage } from './helpers/post-failure-message';
import { postSuccessMessage } from './helpers/post-success-message';

import type { Env } from '../../types/env';
import type { BlockActionAckHandler } from 'slack-edge';

export const submitFeedbackHandler: BlockActionAckHandler<'button', Env> = async ({
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
        value: v.fallback(v.string(), ''),
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

  const result = await R.pipe(
    R.do(),
    R.bind('container', () => R.collect({
      channelId: SlackChannelId.create('channel_id' in payload.container ? payload.container.channel_id : ''),
      messageTs: R.succeed('message_ts' in payload.container ? payload.container.message_ts : ''),
    })),
    R.bind('values', () => R.collect({
      id: R.succeed(FeedbackId.new()),
      sendSlackUserId: SlackUserId.create(sendSlackUserId),
      receiveSlackUserId: SlackUserId.create(receiveSlackUserId),
      slackMessageId: SlackMessageId.create(slackMessageId),
      skillElementIds: R.sequence(values.skills.input.selected_options.map(({ value }) => SkillElementId.create(value))),
      content: R.succeed(values.content.input.value),
      createdAt: R.succeed(new Date()),
    })),
    R.andThen(({ container, values }) => R.pipe(
      completeQuestion(context.client, container.channelId, container.messageTs),
      R.andThen(() => saveFeedback(new Feedback(values))),
      R.andThen(() => postSuccessMessage(context.client, container.channelId, container.messageTs)),
      R.orElse((error) => {
        console.error(error);
        return postFailureMessage(context.client, container.channelId, container.messageTs);
      }),
    )),
  );

  if (R.isFailure(result)) {
    console.error(result.error);
  }
};
