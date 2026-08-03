import { createId } from '@paralleldrive/cuid2';
import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

export class SlackMessageIdInvalidFormatError extends ErrorFactory({
  name: 'SlackMessageIdIncorrectFormatError',
  message: 'Invalid format for SlackMessageId',
}) {}

export type SlackMessageIdError = SlackMessageIdInvalidFormatError;

const schema = v.pipe(v.string(), v.cuid2());

type Properties = {
  value: v.InferOutput<typeof schema>;
};

export class SlackMessageId extends ValueObject('SlackMessageId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static new(): SlackMessageId {
    return new SlackMessageId({ value: createId() });
  }

  public static create(value: string): R.Result<SlackMessageId, SlackMessageIdError> {
    return R.pipe(
      R.parse(schema, value),
      R.map((value) => new SlackMessageId({ value })),
      R.mapError((error) => new SlackMessageIdInvalidFormatError({ cause: error })),
    );
  }

  public static reconstruct(value: string): SlackMessageId {
    return new SlackMessageId({ value: v.parse(schema, value) });
  }
}
