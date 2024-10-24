import { builder } from '../../../core/builder';
import { feedbackSlackMessage } from '../../../usecases/feedbacks/fields/slack-message';
import { SlackMessage } from '../../slack-messages/types/slack-message';
import { Feedback } from '../types/feedback';

builder.objectField(Feedback, 'slackMessage', (t) => t.field({
  type: SlackMessage,
  description: 'フィードバックを受けたSlackメッセージ',
  resolve: async (feedback) => {
    const result = await feedbackSlackMessage({
      feedbackId: feedback.id,
    });

    if (result.isOk()) {
      return result.value;
    }

    throw result.error;
  },
}));
