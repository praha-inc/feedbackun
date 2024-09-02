import { CustomError } from '@feedbackun/package-custom-error';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

import type { Result } from 'neverthrow';

export class SlackEmojiIdInvalidFormatError extends CustomError({
  name: 'SlackEmojiIdIncorrectFormatError',
  message: 'Invalid format for SlackEmojiId',
}) {}

export type SlackEmojiIdError = SlackEmojiIdInvalidFormatError;

type Properties = {
  value: string;
};

export class SlackEmojiId extends ValueObject('SlackEmojiId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static create(value: Properties): Result<SlackEmojiId, SlackEmojiIdError> {
    const result = v.safeParse(v.object({
      value: v.pipe(v.string(), v.cuid2()),
    }), value);

    if (result.success) {
      return ok(new SlackEmojiId(value));
    }

    return err(new SlackEmojiIdInvalidFormatError());
  }
}
