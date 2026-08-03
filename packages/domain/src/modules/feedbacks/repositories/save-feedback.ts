import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { UnexpectedError } from '@praha/error-factory/presets';

import { SkillElementId } from '../../skill-elements';
import { SlackMessageId } from '../../slack-messages';
import { SlackUserId } from '../../slack-users';
import { Feedback } from '../models/feedback';
import { FeedbackId } from '../models/feedback-id';

const insertFeedbackWithSkills = R.fn({
  try: (feedback: Feedback) => database().batch([
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
  catch: (error) => new UnexpectedError({ cause: error }),
});

const insertFeedbackWithoutSkills = R.fn({
  try: (feedback: Feedback) => database().batch([
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
  catch: (error) => new UnexpectedError({ cause: error }),
});

export type SaveFeedbackInput = Feedback;

export type SaveFeedbackError = (
  | UnexpectedError
);

export type SaveFeedback = (
  input: SaveFeedbackInput,
) => R.ResultAsync<Feedback, SaveFeedbackError>;

export const saveFeedback: SaveFeedback = (input) => {
  return R.pipe(
    input.skillElementIds.length <= 0
      ? insertFeedbackWithoutSkills(input)
      : insertFeedbackWithSkills(input),
    R.andThen(([[feedback], feedbackSkills]) => {
      return R.succeed(new Feedback({
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
    }),
  );
};
