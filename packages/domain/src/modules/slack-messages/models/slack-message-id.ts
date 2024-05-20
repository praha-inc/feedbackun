import { CustomError } from '@feedbackun/package-custom-error';
import { err, ok } from 'neverthrow';
import { cuid2, object, safeParse, string } from 'valibot';

import { ValueObject } from '../../../core/value-object';

import type { Result } from 'neverthrow';

export class SlackMessageIdInvalidFormatError extends CustomError({
  name: 'SlackMessageIdIncorrectFormatError',
  message: 'Invalid format for SlackMessageId',
}) {}

export type SlackMessageIdError = SlackMessageIdInvalidFormatError;

type Properties = {
  value: string;
};

export class SlackMessageId extends ValueObject('SlackMessageId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static create(value: Properties): Result<SlackMessageId, SlackMessageIdError> {
    const result = safeParse(object({
      value: string([cuid2()]),
    }), value);

    if (result.success) {
      return ok(new SlackMessageId(value));
    }

    return err(new SlackMessageIdInvalidFormatError());
  }
}
