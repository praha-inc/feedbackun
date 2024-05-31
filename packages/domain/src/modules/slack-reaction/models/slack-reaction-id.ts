import { CustomError } from '@feedbackun/package-custom-error';
import { err, ok } from 'neverthrow';
import { cuid2, object, safeParse, string } from 'valibot';

import { ValueObject } from '../../../core/value-object';

import type { Result } from 'neverthrow';

export class SlackReactionIdInvalidFormatError extends CustomError({
  name: 'SlackReactionIdIncorrectFormatError',
  message: 'Invalid format for SlackReactionId',
}) {}

export type SlackReactionIdError = SlackReactionIdInvalidFormatError;

type Properties = {
  value: string;
};

export class SlackReactionId extends ValueObject('SlackReactionId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static create(value: Properties): Result<SlackReactionId, SlackReactionIdError> {
    const result = safeParse(object({
      value: string([cuid2()]),
    }), value);

    if (result.success) {
      return ok(new SlackReactionId(value));
    }

    return err(new SlackReactionIdInvalidFormatError());
  }
}
