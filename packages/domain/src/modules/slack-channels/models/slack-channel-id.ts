import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

export class SlackChannelIdInvalidFormatError extends ErrorFactory({
  name: 'SlackChannelIdIncorrectFormatError',
  message: 'Invalid format for SlackChannelId',
}) {}

export type SlackChannelIdError = SlackChannelIdInvalidFormatError;

const schema = v.pipe(v.string(), v.regex(/^([CDG]).*$/));

type Properties = {
  value: v.InferOutput<typeof schema>;
};

export class SlackChannelId extends ValueObject('SlackChannelId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static create(value: string): R.Result<SlackChannelId, SlackChannelIdError> {
    return R.pipe(
      R.parse(schema, value),
      R.map((value) => new SlackChannelId({ value })),
      R.mapError((error) => new SlackChannelIdInvalidFormatError({ cause: error })),
    );
  }

  public static reconstruct(value: string): SlackChannelId {
    return new SlackChannelId({ value: v.parse(schema, value) });
  }
}
