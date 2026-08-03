import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { UnexpectedError } from '@praha/error-factory/presets';

import { SlackChannelId } from '../../slack-channels';
import { SlackUserId } from '../../slack-users';
import { SlackMessage } from '../models/slack-message';
import { SlackMessageId } from '../models/slack-message-id';

const insertSlackMessage = R.fn({
  try: (slackMessage: SlackMessage) => database()
    .insert(schema.slackMessages)
    .values({
      id: slackMessage.id.value,
      slackChannelId: slackMessage.slackChannelId.value,
      slackUserId: slackMessage.slackUserId.value,
      text: slackMessage.text,
      ts: slackMessage.ts,
      threadTs: slackMessage.threadTs,
    })
    .returning()
    .get(),
  catch: (error) => new UnexpectedError({ cause: error }),
});

export type SaveSlackMessageInput = SlackMessage;

export type SaveSlackMessageError = (
  | UnexpectedError
);

export type SaveSlackMessage = (
  input: SaveSlackMessageInput,
) => R.ResultAsync<SlackMessage, SaveSlackMessageError>;

export const saveSlackMessage: SaveSlackMessage = (input) => {
  return R.pipe(
    insertSlackMessage(input),
    R.andThen((row) => {
      return R.succeed(new SlackMessage({
        id: SlackMessageId.reconstruct(row.id),
        slackChannelId: SlackChannelId.reconstruct(row.slackChannelId),
        slackUserId: SlackUserId.reconstruct(row.slackUserId),
        text: row.text,
        ts: row.ts,
        threadTs: row.threadTs,
      }));
    }),
  );
};
