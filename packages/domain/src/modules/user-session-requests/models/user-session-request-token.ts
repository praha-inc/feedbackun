import { createId } from '@paralleldrive/cuid2';
import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

export class UserSessionRequestTokenInvalidFormatError extends ErrorFactory({
  name: 'UserSessionRequestTokenIncorrectFormatError',
  message: 'Invalid format for UserSessionRequestToken',
}) {}

export type UserSessionRequestTokenError = UserSessionRequestTokenInvalidFormatError;

const schema = v.pipe(v.string(), v.cuid2());

type Properties = {
  value: v.InferOutput<typeof schema>;
};

export class UserSessionRequestToken extends ValueObject('UserSessionRequestToken')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static new(): UserSessionRequestToken {
    return new UserSessionRequestToken({ value: createId() });
  }

  public static create(value: string): R.Result<UserSessionRequestToken, UserSessionRequestTokenError> {
    return R.pipe(
      R.parse(schema, value),
      R.map((value) => new UserSessionRequestToken({ value })),
      R.mapError((error) => new UserSessionRequestTokenInvalidFormatError({ cause: error })),
    );
  }

  public static reconstruct(value: string): UserSessionRequestToken {
    return new UserSessionRequestToken({ value: v.parse(schema, value) });
  }
}
