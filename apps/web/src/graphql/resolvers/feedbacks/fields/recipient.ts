import { builder } from '../../../core/builder';
import { feedbackRecipient } from '../../../usecases/feedbacks/fields/recipient';
import { User } from '../../users/types/user';
import { Feedback } from '../types/feedback';

builder.objectField(Feedback, 'recipient', (t) => t.field({
  type: User,
  description: 'フィードバックを受けたユーザー',
  resolve: async (feedback) => {
    const result = await feedbackRecipient({
      feedbackId: feedback.id,
    });

    if (result.isOk()) {
      return result.value;
    }

    throw result.error;
  },
}));
