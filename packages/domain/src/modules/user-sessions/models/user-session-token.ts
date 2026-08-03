import { createId } from '@paralleldrive/cuid2';
import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

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

  public static create(value: string): R.Result<UserSessionToken, UserSessionTokenError> {
    return R.pipe(
      R.parse(schema, value),
      R.map((value) => new UserSessionToken({ value })),
      R.mapError((error) => new UserSessionTokenInvalidFormatError({ cause: error })),
    );
  }

  public static reconstruct(value: string): UserSessionToken {
    return new UserSessionToken({ value: v.parse(schema, value) });
  }
}
