import { createId } from '@paralleldrive/cuid2';
import { ErrorFactory } from '@praha/error-factory';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

import type { Result } from 'neverthrow';

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

  public static create(value: string): Result<SlackMessageId, SlackMessageIdError> {
    const result = v.safeParse(schema, value);

    if (result.success) {
      return ok(new SlackMessageId({ value: result.output }));
    }

    return err(new SlackMessageIdInvalidFormatError());
  }

  public static reconstruct(value: string): SlackMessageId {
    return new SlackMessageId({ value: v.parse(schema, value) });
  }
}
