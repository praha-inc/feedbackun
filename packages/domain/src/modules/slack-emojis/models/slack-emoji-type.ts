import { CustomError } from '@feedbackun/package-custom-error';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

import type { Result } from 'neverthrow';

export class SlackEmojiTypeInvaltypeFormatError extends CustomError({
  name: 'SlackEmojiTypeIncorrectFormatError',
  message: 'Invaltype format for SlackEmojiType',
}) {}

export type SlackEmojiTypeError = SlackEmojiTypeInvaltypeFormatError;

type Properties = {
  value: string;
};

export class SlackEmojiType extends ValueObject('SlackEmojiType')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static create(value: Properties): Result<SlackEmojiType, SlackEmojiTypeError> {
    const result = v.safeParse(v.object({
      value: v.union([v.literal('unicode'), v.literal('custom')]),
    }), value);

    if (result.success) {
      return ok(new SlackEmojiType(value));
    }

    return err(new SlackEmojiTypeInvaltypeFormatError());
  }
}
