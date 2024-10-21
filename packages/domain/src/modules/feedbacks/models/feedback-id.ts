import { CustomError } from '@feedbackun/package-custom-error';
import { createId } from '@paralleldrive/cuid2';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

import type { Result } from 'neverthrow';

export class FeedbackIdInvalidFormatError extends CustomError({
  name: 'FeedbackIdIncorrectFormatError',
  message: 'Invalid format for FeedbackId',
}) {}

export type FeedbackIdError = FeedbackIdInvalidFormatError;

const schema = v.pipe(v.string(), v.cuid2());

type Properties = {
  value: v.InferOutput<typeof schema>;
};

export class FeedbackId extends ValueObject('FeedbackId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static new(): FeedbackId {
    return new FeedbackId({ value: createId() });
  }

  public static create(value: string): Result<FeedbackId, FeedbackIdError> {
    const result = v.safeParse(schema, value);

    if (result.success) {
      return ok(new FeedbackId({ value: result.output }));
    }

    return err(new FeedbackIdInvalidFormatError());
  }

  public static reconstruct(value: string): FeedbackId {
    return new FeedbackId({ value: v.parse(schema, value) });
  }
}
