import { builder } from '../../../core/builder';
import { feedbackSkillElements } from '../../../usecases/feedbacks/fields/skill-elements';
import { SkillElement } from '../../skill-elements/types/skill-element';
import { Feedback } from '../types/feedback';

builder.objectField(Feedback, 'skillElements', (t) => t.field({
  type: [SkillElement],
  description: 'フィードバックに紐づくスキル要素',
  resolve: async (feedback) => {
    const result = await feedbackSkillElements({
      feedbackId: feedback.id,
    });

    if (result.isOk()) {
      return result.value;
    }

    throw result.error;
  },
}));
