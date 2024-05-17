import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import { ok, ResultAsync } from 'neverthrow';

import { SlackTeamId } from '../../slack-teams';
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

export const saveSlackUser: SaveSlackUser = input => {
  const result = ResultAsync.fromPromise(
    database()
      .insert(schema.slackUsers)
      .values({
        id: input.id.value,
        slackTeamId: input.slackTeamId.value,
        name: input.name,
      })
      .returning()
      .get(),
    error => new SaveSlackUserUnexpectedError({ cause: error }),
  );

  return result
    .andThen(slackUser => {
      return ok(new SlackUser({
        id: SlackUserId.create({ value: slackUser.id })._unsafeUnwrap(),
        slackTeamId: SlackTeamId.create({ value: slackUser.slackTeamId })._unsafeUnwrap(),
        name: slackUser.name,
      }));
    });
};
