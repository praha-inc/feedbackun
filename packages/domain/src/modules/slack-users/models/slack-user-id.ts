import { CustomError } from '@feedbackun/package-custom-error';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

import type { Result } from 'neverthrow';

export class SlackUserIdInvalidFormatError extends CustomError({
  name: 'SlackUserIdIncorrectFormatError',
  message: 'Invalid format for SlackUserId',
}) {}

export type SlackUserIdError = SlackUserIdInvalidFormatError;

type Properties = {
  value: string;
};

export class SlackUserId extends ValueObject('SlackUserId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static create(value: string): Result<SlackUserId, SlackUserIdError> {
    const result = v.safeParse(
      v.pipe(v.string(), v.regex(/^U.*$/)),
      value,
    );

    if (result.success) {
      return ok(new SlackUserId({ value }));
    }

    return err(new SlackUserIdInvalidFormatError());
  }
}
