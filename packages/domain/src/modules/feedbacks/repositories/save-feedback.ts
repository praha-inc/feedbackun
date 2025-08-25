import { database, schema } from '@feedbackun/package-database';
import { doAsync } from '@feedbackun/package-neverthrow';
import { ErrorFactory } from '@praha/error-factory';
import { ok, ResultAsync } from 'neverthrow';

import { SkillElementId } from '../../skill-elements';
import { SlackMessageId } from '../../slack-messages';
import { SlackUserId } from '../../slack-users';
import { Feedback } from '../models/feedback';
import { FeedbackId } from '../models/feedback-id';

export type SaveFeedbackInput = Feedback;

export class SaveFeedbackUnexpectedError extends ErrorFactory({
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
      .insert(schema.feedbackSkills)
      .values(
        feedback.skillElementIds.map((skillElementId) => ({
          feedbackId: feedback.id.value,
          skillElementId: skillElementId.value,
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
      if (input.skillElementIds.length <= 0) {
        return insertFeedbackWithoutSkills(input);
      }
      return insertFeedbackWithSkills(input);
    })
    .andThen(([[feedback], feedbackSkills]) => {
      return ok(new Feedback({
        id: FeedbackId.reconstruct(feedback!.id),
        sendSlackUserId: SlackUserId.reconstruct(feedback!.sendSlackUserId),
        receiveSlackUserId: SlackUserId.reconstruct(feedback!.receiveSlackUserId),
        slackMessageId: SlackMessageId.reconstruct(feedback!.slackMessageId),
        skillElementIds: feedbackSkills?.map((row) => {
          return SkillElementId.reconstruct(row.skillElementId);
        }) ?? [],
        content: feedback!.content,
        createdAt: feedback!.createdAt,
      }));
    });
};
