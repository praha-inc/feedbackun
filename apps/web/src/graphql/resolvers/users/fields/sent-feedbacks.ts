import { resolveCursorConnection } from '@pothos/plugin-relay';
import { R } from '@praha/byethrow';
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
        return R.pipe(
          userSentFeedbacks({
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
          }),
          R.unwrap(),
        );
      },
    );

    const totalCount = async () => {
      return await R.pipe(
        userSentFeedbacksCount({
          userId: user.id,
        }),
        R.unwrap(),
      );
    };

    return {
      ...connection,
      totalCount,
    };
  },
}));
