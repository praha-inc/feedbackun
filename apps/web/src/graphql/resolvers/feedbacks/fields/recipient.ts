import { R } from '@praha/byethrow';

import { builder } from '../../../core/builder';
import { feedbackRecipient } from '../../../usecases/feedbacks/fields/recipient';
import { User } from '../../users/types/user';
import { Feedback } from '../types/feedback';

builder.objectField(Feedback, 'recipient', (t) => t.field({
  type: User,
  description: 'フィードバックを受けたユーザー',
  resolve: async (feedback) => {
    return await R.pipe(
      feedbackRecipient({
        feedbackId: feedback.id,
      }),
      R.unwrap(),
    );
  },
}));
