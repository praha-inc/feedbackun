import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { bindAsync, doAsync } from '@feedbackun/package-neverthrow';
import { ok, ResultAsync } from 'neverthrow';

import { SlackMessageId } from '../../slack-messages';
import { SlackUserId } from '../../slack-users';
import { WorkSkillElementId } from '../../work-skill-elements';
import { Feedback } from '../models/feedback';
import { FeedbackId } from '../models/feedback-id';

export type SaveFeedbackInput = Feedback;

export class SaveFeedbackUnexpectedError extends CustomError({
  name: 'SaveFeedbackUnexpectedError',
  message: 'Failed to save feedback.',
}) {}

export type SaveFeedbackError = (
  | SaveFeedbackUnexpectedError
);

export type SaveFeedback = (
  input: SaveFeedbackInput,
) => ResultAsync<Feedback, SaveFeedbackError>;

export const saveFeedback: SaveFeedback = (input) => {
  const insertFeedback = ResultAsync.fromPromise(
    database()
      .insert(schema.feedbacks)
      .values({
        id: input.id.value,
        sendSlackUserId: input.sendSlackUserId.value,
        receiveSlackUserId: input.receiveSlackUserId.value,
        slackMessageId: input.slackMessageId.value,
        content: input.content,
        createdAt: input.createdAt,
      })
      .returning()
      .get(),
    (error) => new SaveFeedbackUnexpectedError({ cause: error }),
  );

  const insertFeedbackWorkSkills = ResultAsync.fromPromise(
    database()
      .insert(schema.feedbackWorkSkills)
      .values(
        input.workSkillElementIds.map((workSkillElementId) => ({
          feedbackId: input.id.value,
          workSkillElementId: workSkillElementId.value,
        })),
      )
      .returning(),
    (error) => new SaveFeedbackUnexpectedError({ cause: error }),
  );

  return doAsync
    .andThen(bindAsync('feedback', () => insertFeedback))
    .andThen(bindAsync('feedbackWorkSkills', () => insertFeedbackWorkSkills))
    .andThen(({ feedback, feedbackWorkSkills }) => {
      return ok(new Feedback({
        id: FeedbackId.create(feedback.id)._unsafeUnwrap(),
        sendSlackUserId: SlackUserId.create(feedback.sendSlackUserId)._unsafeUnwrap(),
        receiveSlackUserId: SlackUserId.create(feedback.receiveSlackUserId)._unsafeUnwrap(),
        slackMessageId: SlackMessageId.create(feedback.slackMessageId)._unsafeUnwrap(),
        workSkillElementIds: feedbackWorkSkills.map((row) => WorkSkillElementId.create(row.workSkillElementId)._unsafeUnwrap()),
        content: feedback.content,
        createdAt: feedback.createdAt,
      }));
    });
};
