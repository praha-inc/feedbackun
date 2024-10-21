import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { doAsync } from '@feedbackun/package-neverthrow';
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

const insertFeedbackWithSkills = (feedback: Feedback) => ResultAsync.fromPromise(
  database().batch([
    database()
      .insert(schema.feedbacks)
      .values({
        id: feedback.id.value,
        sendSlackUserId: feedback.sendSlackUserId.value,
        receiveSlackUserId: feedback.receiveSlackUserId.value,
        slackMessageId: feedback.slackMessageId.value,
        content: feedback.content,
        createdAt: feedback.createdAt,
      })
      .returning(),
    database()
      .insert(schema.feedbackWorkSkills)
      .values(
        feedback.workSkillElementIds.map((workSkillElementId) => ({
          feedbackId: feedback.id.value,
          workSkillElementId: workSkillElementId.value,
        })),
      )
      .returning(),
  ]),
  (error) => new SaveFeedbackUnexpectedError({ cause: error }),
);

const insertFeedbackWithoutSkills = (feedback: Feedback) => ResultAsync.fromPromise(
  database().batch([
    database()
      .insert(schema.feedbacks)
      .values({
        id: feedback.id.value,
        sendSlackUserId: feedback.sendSlackUserId.value,
        receiveSlackUserId: feedback.receiveSlackUserId.value,
        slackMessageId: feedback.slackMessageId.value,
        content: feedback.content,
        createdAt: feedback.createdAt,
      })
      .returning(),
  ]),
  (error) => new SaveFeedbackUnexpectedError({ cause: error }),
);

export const saveFeedback: SaveFeedback = (input) => {
  return doAsync
    .andThen(() => {
      if (input.workSkillElementIds.length <= 0) {
        return insertFeedbackWithoutSkills(input);
      }
      return insertFeedbackWithSkills(input);
    })
    .andThen(([[feedback], feedbackWorkSkills]) => {
      return ok(new Feedback({
        id: FeedbackId.reconstruct(feedback!.id),
        sendSlackUserId: SlackUserId.reconstruct(feedback!.sendSlackUserId),
        receiveSlackUserId: SlackUserId.reconstruct(feedback!.receiveSlackUserId),
        slackMessageId: SlackMessageId.reconstruct(feedback!.slackMessageId),
        workSkillElementIds: feedbackWorkSkills?.map((row) => {
          return WorkSkillElementId.reconstruct(row.workSkillElementId);
        }) ?? [],
        content: feedback!.content,
        createdAt: feedback!.createdAt,
      }));
    });
};
