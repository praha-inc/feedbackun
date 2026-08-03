import { R } from '@praha/byethrow';

import { builder } from '../../../core/builder';
import { feedbackSlackMessage } from '../../../usecases/feedbacks/fields/slack-message';
import { SlackMessage } from '../../slack-messages/types/slack-message';
import { Feedback } from '../types/feedback';

builder.objectField(Feedback, 'slackMessage', (t) => t.field({
  type: SlackMessage,
  description: 'フィードバックを受けたSlackメッセージ',
  resolve: async (feedback) => {
    return await R.pipe(
      feedbackSlackMessage({
        feedbackId: feedback.id,
      }),
      R.unwrap(),
    );
  },
}));
