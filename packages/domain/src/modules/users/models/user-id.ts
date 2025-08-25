import { ErrorFactory } from '@praha/error-factory';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

import type { Result } from 'neverthrow';

export class UserIdInvalidFormatError extends ErrorFactory({
  name: 'UserIdIncorrectFormatError',
  message: 'Invalid format for UserId',
}) {}

export type UserIdError = UserIdInvalidFormatError;

const schema = v.pipe(v.string(), v.cuid2());

type Properties = {
  value: v.InferOutput<typeof schema>;
};

export class UserId extends ValueObject('UserId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static create(value: string): Result<UserId, UserIdError> {
    const result = v.safeParse(schema, value);

    if (result.success) {
      return ok(new UserId({ value: result.output }));
    }

    return err(new UserIdInvalidFormatError());
  }

  public static reconstruct(value: string): UserId {
    return new UserId({ value: v.parse(schema, value) });
  }
}
