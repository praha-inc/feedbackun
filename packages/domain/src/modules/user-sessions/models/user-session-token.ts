import { createId } from '@paralleldrive/cuid2';
import { ErrorFactory } from '@praha/error-factory';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

import type { Result } from 'neverthrow';

export class UserSessionTokenInvalidFormatError extends ErrorFactory({
  name: 'UserSessionTokenIncorrectFormatError',
  message: 'Invalid format for UserSessionToken',
}) {}

export type UserSessionTokenError = UserSessionTokenInvalidFormatError;

const schema = v.pipe(v.string(), v.cuid2());

type Properties = {
  value: v.InferOutput<typeof schema>;
};

export class UserSessionToken extends ValueObject('UserSessionToken')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static new(): UserSessionToken {
    return new UserSessionToken({ value: createId() });
  }

  public static create(value: string): Result<UserSessionToken, UserSessionTokenError> {
    const result = v.safeParse(schema, value);

    if (result.success) {
      return ok(new UserSessionToken({ value: result.output }));
    }

    return err(new UserSessionTokenInvalidFormatError());
  }

  public static reconstruct(value: string): UserSessionToken {
    return new UserSessionToken({ value: v.parse(schema, value) });
  }
}
