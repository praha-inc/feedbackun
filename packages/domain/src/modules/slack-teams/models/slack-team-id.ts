import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

export class SlackTeamIdInvalidFormatError extends ErrorFactory({
  name: 'SlackTeamIdIncorrectFormatError',
  message: 'Invalid format for SlackTeamId',
}) {}

export type SlackTeamIdError = SlackTeamIdInvalidFormatError;

const schema = v.pipe(v.string(), v.regex(/^T.*$/));

type Properties = {
  value: v.InferOutput<typeof schema>;
};

export class SlackTeamId extends ValueObject('SlackTeamId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static create(value: string): R.Result<SlackTeamId, SlackTeamIdError> {
    return R.pipe(
      R.parse(schema, value),
      R.map((value) => new SlackTeamId({ value })),
      R.mapError((error) => new SlackTeamIdInvalidFormatError({ cause: error })),
    );
  }

  public static reconstruct(value: string): SlackTeamId {
    return new SlackTeamId({ value: v.parse(schema, value) });
  }
}
