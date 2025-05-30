import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import DataLoader from 'dataloader';
import { eq, inArray } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';
import { match, P } from 'ts-pattern';

import { serialize } from '../../../helpers/serialize';
import { dataLoader } from '../../../plugins/dataloader';

import type { User } from '../../users/types/user';

const symbol = Symbol('FeedbackRecipient');

export type FeedbackRecipientInput = {
  feedbackId: string;
};

export class FeedbackRecipientNotFoundError extends CustomError({
  name: 'FeedbackRecipientNotFoundError',
  message: 'Does not exist feedback recipient.',
}) {}

export class FeedbackRecipientUnexpectedError extends CustomError({
  name: 'FeedbackRecipientUnexpectedError',
  message: 'Failed to find feedback recipient.',
}) {}

export type FeedbackRecipientError = (
  | FeedbackRecipientNotFoundError
  | FeedbackRecipientUnexpectedError
);

export type FeedbackRecipient = (
  input: FeedbackRecipientInput,
) => ResultAsync<User, FeedbackRecipientError>;

export const feedbackRecipient: FeedbackRecipient = (input) => {
  const loader = dataLoader(symbol, () => new DataLoader<FeedbackRecipientInput, User, string>(async (inputs) => {
    const feedbackIds = inputs.map((input) => input.feedbackId);

    const rows = await database()
      .select()
      .from(schema.users)
      .innerJoin(schema.slackUsers, eq(schema.slackUsers.userId, schema.users.id))
      .innerJoin(schema.feedbacks, eq(schema.feedbacks.receiveSlackUserId, schema.slackUsers.id))
      .where(inArray(schema.feedbacks.id, feedbackIds));

    return inputs.map((input) => {
      const row = rows.find((row) => row.feedbacks.id === input.feedbackId);
      if (!row) throw new FeedbackRecipientNotFoundError();
      return {
        id: row.users.id,
        type: row.users.type,
        name: row.users.name,
        icon: row.users.icon,
      };
    });
  }, { cacheKeyFn: serialize }));

  return ResultAsync.fromThrowable(
    () => loader.load(input),
    (error) => match(error)
      .with(P.instanceOf(FeedbackRecipientNotFoundError), (error) => error)
      .otherwise(() => new FeedbackRecipientUnexpectedError({ cause: error })),
  )();
};
