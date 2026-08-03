import { R } from '@praha/byethrow';

import { builder } from '../../../core/builder';
import { feedbackAssignedSkills } from '../../../usecases/feedbacks/fields/assigned-skills';
import { Feedback } from '../types/feedback';
import { FeedbackAssignedSkill } from '../types/feedback-assigned-skill';

builder.objectField(Feedback, 'assignedSkills', (t) => t.field({
  type: [FeedbackAssignedSkill],
  description: 'フィードバックに紐づくスキル',
  resolve: async (feedback) => {
    return await R.pipe(
      feedbackAssignedSkills({
        feedbackId: feedback.id,
      }),
      R.unwrap(),
    );
  },
}));
