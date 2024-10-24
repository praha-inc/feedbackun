import { resolveCursorConnection } from '@pothos/plugin-relay';
import * as v from 'valibot';

import { builder } from '../../../core/builder';
import { deserialize } from '../../../helpers/deserialize';
import { serialize } from '../../../helpers/serialize';
import { feedbacks } from '../../../usecases/feedbacks/queries/feedbacks';
import { feedbacksCount } from '../../../usecases/feedbacks/queries/feedbacks-count';
import { Feedback } from '../types/feedback';

import type { ResolveCursorConnectionArgs } from '@pothos/plugin-relay';

builder.queryField('feedbacks', (t) => t.connection({
  type: Feedback,
  description: 'フィードバックを取得する',
  resolve: async (_, arguments_) => {
    const connection = await resolveCursorConnection(
      {
        args: arguments_,
        toCursor: (feedback) => serialize(feedback.cursor),
      },
      async ({ after, limit }: ResolveCursorConnectionArgs) => {
        const result = await feedbacks({
          limit: limit,
          cursor: after ? deserialize(after, v.object({
            id: v.string(),
            createdAt: v.date(),
          })) : undefined,
        });

        if (result.isOk()) {
          return result.value;
        }

        throw result.error;
      },
    );

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const totalCount = async () => {
      const result = await feedbacksCount({});

      if (result.isOk()) {
        return result.value;
      }

      throw result.error;
    };

    return {
      ...connection,
      totalCount,
    };
  },
}));
