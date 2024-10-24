import { builder } from '../../../core/builder';
import { feedbackSender } from '../../../usecases/feedbacks/fields/sender';
import { User } from '../../users/types/user';
import { Feedback } from '../types/feedback';

builder.objectField(Feedback, 'sender', (t) => t.field({
  type: User,
  description: 'フィードバックを送ったユーザー',
  resolve: async (feedback) => {
    const result = await feedbackSender({
      feedbackId: feedback.id,
    });

    if (result.isOk()) {
      return result.value;
    }

    throw result.error;
  },
}));
