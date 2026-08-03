import { createId } from '@paralleldrive/cuid2';
import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

export class FeedbackIdInvalidFormatError extends ErrorFactory({
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

  public static create(value: string): R.Result<FeedbackId, FeedbackIdError> {
    return R.pipe(
      R.parse(schema, value),
      R.map((value) => new FeedbackId({ value })),
      R.mapError((error) => new FeedbackIdInvalidFormatError({ cause: error })),
    );
  }

  public static reconstruct(value: string): FeedbackId {
    return new FeedbackId({ value: v.parse(schema, value) });
  }
}
