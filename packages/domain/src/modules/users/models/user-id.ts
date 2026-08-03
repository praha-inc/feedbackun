import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

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

  public static create(value: string): R.Result<UserId, UserIdError> {
    return R.pipe(
      R.parse(schema, value),
      R.map((value) => new UserId({ value })),
      R.mapError((error) => new UserIdInvalidFormatError({ cause: error })),
    );
  }

  public static reconstruct(value: string): UserId {
    return new UserId({ value: v.parse(schema, value) });
  }
}
