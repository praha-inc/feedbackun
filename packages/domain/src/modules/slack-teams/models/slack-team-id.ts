import { ErrorFactory } from '@praha/error-factory';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

import type { Result } from 'neverthrow';

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

  public static create(value: string): Result<SlackTeamId, SlackTeamIdError> {
    const result = v.safeParse(schema, value);

    if (result.success) {
      return ok(new SlackTeamId({ value: result.output }));
    }

    return err(new SlackTeamIdInvalidFormatError());
  }

  public static reconstruct(value: string): SlackTeamId {
    return new SlackTeamId({ value: v.parse(schema, value) });
  }
}
