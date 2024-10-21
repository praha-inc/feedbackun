import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { doAsync } from '@feedbackun/package-neverthrow';
import { ok, ResultAsync } from 'neverthrow';

import { SlackTeamId } from '../../slack-teams';
import { UserId } from '../../users';
import { SlackUser } from '../models/slack-user';
import { SlackUserId } from '../models/slack-user-id';

export type SaveSlackUserInput = SlackUser;

export class SaveSlackUserUnexpectedError extends CustomError({
  name: 'SaveSlackUserUnexpectedError',
  message: 'Failed to save slack user.',
}) {}

export type SaveSlackUserError = (
  | SaveSlackUserUnexpectedError
);

export type SaveSlackUser = (
  input: SaveSlackUserInput,
) => ResultAsync<SlackUser, SaveSlackUserError>;

const insertSlackUser = (slackUser: SlackUser) => ResultAsync.fromPromise(
  database()
    .insert(schema.slackUsers)
    .values({
      id: slackUser.id.value,
      userId: slackUser.userId?.value ?? null,
      slackTeamId: slackUser.slackTeamId.value,
      name: slackUser.name,
    })
    .returning()
    .get(),
  (error) => new SaveSlackUserUnexpectedError({ cause: error }),
);

export const saveSlackUser: SaveSlackUser = (input) => {
  return doAsync
    .andThen(() => insertSlackUser(input))
    .andThen((row) => {
      return ok(new SlackUser({
        id: SlackUserId.reconstruct(row.id),
        userId: row.userId ? UserId.reconstruct(row.userId) : null,
        slackTeamId: SlackTeamId.reconstruct(row.slackTeamId),
        name: row.name,
      }));
    });
};
