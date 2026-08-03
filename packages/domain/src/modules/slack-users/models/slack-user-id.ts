import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

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

  public static create(value: string): R.Result<SlackUserId, SlackUserIdError> {
    return R.pipe(
      R.parse(schema, value),
      R.map((value) => new SlackUserId({ value })),
      R.mapError((error) => new SlackUserIdInvalidFormatError({ cause: error })),
    );
  }

  public static reconstruct(value: string): SlackUserId {
    return new SlackUserId({ value: v.parse(schema, value) });
  }
}
