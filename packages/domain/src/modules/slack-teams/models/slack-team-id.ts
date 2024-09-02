import { CustomError } from '@feedbackun/package-custom-error';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

import type { Result } from 'neverthrow';

export class SlackTeamIdInvalidFormatError extends CustomError({
  name: 'SlackTeamIdIncorrectFormatError',
  message: 'Invalid format for SlackTeamId',
}) {}

export type SlackTeamIdError = SlackTeamIdInvalidFormatError;

type Properties = {
  value: string;
};

export class SlackTeamId extends ValueObject('SlackTeamId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static create(value: Properties): Result<SlackTeamId, SlackTeamIdError> {
    const result = v.safeParse(v.object({
      value: v.pipe(v.string(), v.regex(/^T.*$/)),
    }), value);

    if (result.success) {
      return ok(new SlackTeamId(value));
    }

    return err(new SlackTeamIdInvalidFormatError());
  }
}
