import { createId } from '@paralleldrive/cuid2';
import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

export class UserSessionIdInvalidFormatError extends ErrorFactory({
  name: 'UserSessionIdIncorrectFormatError',
  message: 'Invalid format for UserSessionId',
}) {}

export type UserSessionIdError = UserSessionIdInvalidFormatError;

const schema = v.pipe(v.string(), v.cuid2());

type Properties = {
  value: v.InferOutput<typeof schema>;
};

export class UserSessionId extends ValueObject('UserSessionId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static new(): UserSessionId {
    return new UserSessionId({ value: createId() });
  }

  public static create(value: string): R.Result<UserSessionId, UserSessionIdError> {
    return R.pipe(
      R.parse(schema, value),
      R.map((value) => new UserSessionId({ value })),
      R.mapError((error) => new UserSessionIdInvalidFormatError({ cause: error })),
    );
  }

  public static reconstruct(value: string): UserSessionId {
    return new UserSessionId({ value: v.parse(schema, value) });
  }
}
