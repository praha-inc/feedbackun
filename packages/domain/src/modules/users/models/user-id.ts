import { CustomError } from '@feedbackun/package-custom-error';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

import type { Result } from 'neverthrow';

export class UserIdInvalidFormatError extends CustomError({
  name: 'UserIdIncorrectFormatError',
  message: 'Invalid format for UserId',
}) {}

export type UserIdError = UserIdInvalidFormatError;

type Properties = {
  value: string;
};

export class UserId extends ValueObject('UserId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static create(value: string): Result<UserId, UserIdError> {
    const result = v.safeParse(
      v.pipe(v.string(), v.cuid2()),
      value,
    );

    if (result.success) {
      return ok(new UserId({ value }));
    }

    return err(new UserIdInvalidFormatError());
  }
}
