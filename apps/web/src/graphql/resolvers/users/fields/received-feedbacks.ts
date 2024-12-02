import { resolveCursorConnection } from '@pothos/plugin-relay';
import * as v from 'valibot';

import { builder } from '../../../core/builder';
import { deserialize } from '../../../helpers/deserialize';
import { serialize } from '../../../helpers/serialize';
import { userReceivedFeedbacksCount } from '../../../usecases/users/fields/received-feedback-count';
import { userReceivedFeedbacks } from '../../../usecases/users/fields/received-feedbacks';
import { Feedback } from '../../feedbacks/types/feedback';
import { User } from '../types/user';

import type { ResolveCursorConnectionArgs } from '@pothos/plugin-relay';

builder.objectField(User, 'receivedFeedbacks', (t) => t.connection({
  type: Feedback,
  description: 'ユーザーが受信したフィードバック',
  resolve: async (user, args) => {
    const connection = await resolveCursorConnection(
      {
        args,
        toCursor: (feedback) => serialize(feedback.cursor),
      },
      async ({ after, limit }: ResolveCursorConnectionArgs) => {
        const result = await userReceivedFeedbacks({
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
      const result = await userReceivedFeedbacksCount({
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
