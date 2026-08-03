import { R } from '@praha/byethrow';

import { builder } from '../../../core/builder';
import { feedbackSender } from '../../../usecases/feedbacks/fields/sender';
import { User } from '../../users/types/user';
import { Feedback } from '../types/feedback';

builder.objectField(Feedback, 'sender', (t) => t.field({
  type: User,
  description: 'フィードバックを送ったユーザー',
  resolve: async (feedback) => {
    return await R.pipe(
      feedbackSender({
        feedbackId: feedback.id,
      }),
      R.unwrap(),
    );
  },
}));
