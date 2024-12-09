import { resolveCursorConnection } from '@pothos/plugin-relay';
import * as v from 'valibot';

import { builder } from '../../../core/builder';
import { deserialize } from '../../../helpers/deserialize';
import { serialize } from '../../../helpers/serialize';
import { userSentFeedbacksCount } from '../../../usecases/users/fields/sent-feedback-count';
import { userSentFeedbacks } from '../../../usecases/users/fields/sent-feedbacks';
import { Feedback } from '../../feedbacks/types/feedback';
import { User } from '../types/user';

import type { ResolveCursorConnectionArgs } from '@pothos/plugin-relay';

builder.objectField(User, 'sentFeedbacks', (t) => t.connection({
  type: Feedback,
  description: 'ユーザーが送信したフィードバック',
  resolve: async (user, args) => {
    const connection = await resolveCursorConnection(
      {
        args,
        toCursor: (feedback) => serialize(feedback.cursor),
      },
      async ({ after, limit }: ResolveCursorConnectionArgs) => {
        const result = await userSentFeedbacks({
          userId: user.id,
          limit: limit,
          cursor: after ? deserialize(after, v.object({
            id: v.string(),
            createdAt: v.pipe(
              v.string(),
              v.isoTimestamp(),
              v.transform((value) => new Date(value)),
            ),
          })) : undefined,
        });

        if (result.isOk()) {
          return result.value;
        }

        throw result.error;
      },
    );

    const totalCount = async () => {
      const result = await userSentFeedbacksCount({
        userId: user.id,
      });

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
