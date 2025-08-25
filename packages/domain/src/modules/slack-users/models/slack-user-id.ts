import { ErrorFactory } from '@praha/error-factory';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

import type { Result } from 'neverthrow';

export class SlackUserIdInvalidFormatError extends ErrorFactory({
  name: 'SlackUserIdIncorrectFormatError',
  message: 'Invalid format for SlackUserId',
}) {}

export type SlackUserIdError = SlackUserIdInvalidFormatError;

const schema = v.pipe(v.string(), v.regex(/^U.*$/));

type Properties = {
  value: v.InferOutput<typeof schema>;
};

export class SlackUserId extends ValueObject('SlackUserId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static create(value: string): Result<SlackUserId, SlackUserIdError> {
    const result = v.safeParse(schema, value);

    if (result.success) {
      return ok(new SlackUserId({ value: result.output }));
    }

    return err(new SlackUserIdInvalidFormatError());
  }

  public static reconstruct(value: string): SlackUserId {
    return new SlackUserId({ value: v.parse(schema, value) });
  }
}
