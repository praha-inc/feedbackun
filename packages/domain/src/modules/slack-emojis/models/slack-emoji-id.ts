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

const schema = v.pipe(v.string(), v.cuid2());

type Properties = {
  value: v.InferOutput<typeof schema>;
};

export class SlackEmojiId extends ValueObject('SlackEmojiId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static create(value: string): Result<SlackEmojiId, SlackEmojiIdError> {
    const result = v.safeParse(schema, value);

    if (result.success) {
      return ok(new SlackEmojiId({ value: result.output }));
    }

    return err(new SlackEmojiIdInvalidFormatError());
  }

  public static reconstruct(value: string): SlackEmojiId {
    return new SlackEmojiId({ value: v.parse(schema, value) });
  }
}
