import {
  SlackTeamId,
  SlackUser,
  SlackUserId,
  findSlackTeamBySlackTeamId,
  findSlackEmojiBySlackTeamIdAndSlackEmojiName,
  findSlackUserBySlackTeamIdAndSlackUserId,
  FindSlackUserBySlackTeamIdAndSlackUserIdNotFoundError,
  saveSlackUser,
} from '@feedbackun/package-domain';
import { errAsync, Result, ResultAsync } from 'neverthrow';

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

  const getUser = ResultAsync.fromThrowable(async (userId: SlackUserId) => {
    return await context.client.users.info({ user: userId.value });
  });

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
    .andThen(({ input, team, ...rest }) => {
      return findSlackUserBySlackTeamIdAndSlackUserId({ slackTeamId: team.id, slackUserId: input.messageUserId })
        .orElse(error => {
          if (!(error instanceof FindSlackUserBySlackTeamIdAndSlackUserIdNotFoundError)) {
            return errAsync(error);
          }

          return getUser(input.messageUserId)
            .andThen(user => {
              return saveSlackUser(new SlackUser({
                id: input.messageUserId,
                slackTeamId: team.id,
                name: user.user?.name ?? '',
              }));
            });
        })
        .map(messageUser => ({ input, team, messageUser, ...rest }));
    })
    .match(
      () => {},
      error => console.error(error),
    );
};
