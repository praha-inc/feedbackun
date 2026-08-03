import { createId } from '@paralleldrive/cuid2';
import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

export class UserSessionRequestIdInvalidFormatError extends ErrorFactory({
  name: 'UserSessionRequestIdIncorrectFormatError',
  message: 'Invalid format for UserSessionRequestId',
}) {}

export type UserSessionRequestIdError = UserSessionRequestIdInvalidFormatError;

const schema = v.pipe(v.string(), v.cuid2());

type Properties = {
  value: v.InferOutput<typeof schema>;
};

export class UserSessionRequestId extends ValueObject('UserSessionRequestId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static new(): UserSessionRequestId {
    return new UserSessionRequestId({ value: createId() });
  }

  public static create(value: string): R.Result<UserSessionRequestId, UserSessionRequestIdError> {
    return R.pipe(
      R.parse(schema, value),
      R.map((value) => new UserSessionRequestId({ value })),
      R.mapError((error) => new UserSessionRequestIdInvalidFormatError({ cause: error })),
    );
  }

  public static reconstruct(value: string): UserSessionRequestId {
    return new UserSessionRequestId({ value: v.parse(schema, value) });
  }
}
