import { CustomError } from '@feedbackun/package-custom-error';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

import type { Result } from 'neverthrow';

export class FeedbackIdInvalidFormatError extends CustomError({
  name: 'FeedbackIdIncorrectFormatError',
  message: 'Invalid format for FeedbackId',
}) {}

export type FeedbackIdError = FeedbackIdInvalidFormatError;

type Properties = {
  value: string;
};

export class FeedbackId extends ValueObject('FeedbackId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static create(value: Properties): Result<FeedbackId, FeedbackIdError> {
    const result = v.safeParse(v.object({
      value: v.pipe(v.string(), v.cuid2()),
    }), value);

    if (result.success) {
      return ok(new FeedbackId(value));
    }

    return err(new FeedbackIdInvalidFormatError());
  }
}
