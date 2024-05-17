import {
  SlackTeamId,
  SlackUserId,
  findSlackTeamBySlackTeamId,
  findSlackEmojiBySlackTeamIdAndSlackEmojiName,
} from '@feedbackun/package-domain';
import { Result, ResultAsync } from 'neverthrow';

import type { Env } from '../../types/env';
import type { EventLazyHandler } from 'slack-edge/dist/handler/handler';

export const reactionAddedHandler: EventLazyHandler<'reaction_added', Env> = async ({
  env: _env,
  context,
  payload,
}) => {
  const input = Result.combineWithAllErrors([
    SlackTeamId.create({ value: context.teamId ?? '' }),
    SlackUserId.create({ value: payload.item_user }),
    SlackUserId.create({ value: payload.user }),
  ]);

  await input
    .map(([teamId, messageUserId, reactionUserId]) => ({
      input: {
        teamId,
        messageUserId,
        reactionUserId,
      },
    }))
    .asyncAndThen(({ input }) => {
      return findSlackTeamBySlackTeamId({ slackTeamId: input.teamId })
        .map(team => ({ input, team }));
    })
    .andThen(({ team, ...rest }) => {
      return findSlackEmojiBySlackTeamIdAndSlackEmojiName({ slackTeamId: team.id, name: payload.reaction })
        .map(() => ({ team, ...rest }));
    })
    .match(
      () => {},
      error => console.error(error),
    );
};
