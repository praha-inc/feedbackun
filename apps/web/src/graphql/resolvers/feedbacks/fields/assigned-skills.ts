import { builder } from '../../../core/builder';
import { feedbackAssignedSkills } from '../../../usecases/feedbacks/fields/assigned-skills';
import { Feedback } from '../types/feedback';
import { FeedbackAssignedSkill } from '../types/feedback-assigned-skill';

builder.objectField(Feedback, 'assignedSkills', (t) => t.field({
  type: [FeedbackAssignedSkill],
  description: 'フィードバックに紐づくスキル',
  resolve: async (feedback) => {
    const result = await feedbackAssignedSkills({
      feedbackId: feedback.id,
    });

    if (result.isOk()) {
      return result.value;
    }

    throw result.error;
  },
}));
