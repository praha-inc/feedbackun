import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { ok, ResultAsync } from 'neverthrow';

import { SlackTeamId } from '../../slack-teams';
import { UserId } from '../../users/models/user-id';
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

export const saveSlackUser: SaveSlackUser = (input) => {
  const result = ResultAsync.fromPromise(
    database()
      .insert(schema.slackUsers)
      .values({
        id: input.id.value,
        userId: input.userId?.value ?? null,
        slackTeamId: input.slackTeamId.value,
        name: input.name,
      })
      .returning()
      .get(),
    (error) => new SaveSlackUserUnexpectedError({ cause: error }),
  );

  return result
    .andThen((row) => {
      return ok(new SlackUser({
        id: SlackUserId.create(row.id)._unsafeUnwrap(),
        userId: row.userId ? UserId.create(row.userId)._unsafeUnwrap() : null,
        slackTeamId: SlackTeamId.create(row.slackTeamId)._unsafeUnwrap(),
        name: row.name,
      }));
    });
};
