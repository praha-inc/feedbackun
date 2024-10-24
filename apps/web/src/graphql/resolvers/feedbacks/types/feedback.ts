import { builder } from '../../../core/builder';
import { DateTime } from '../../../scalars/date-time';

export const Feedback = builder.simpleObject('Feedback', {
  description: 'フィードバック',
  fields: (t) => ({
    id: t.id({ description: 'フィードバックID' }),
    content: t.string({ description: 'フィードバック内容' }),
    createdAt: t.field({ type: DateTime, description: 'フィードバック日時' }),
  }),
});
