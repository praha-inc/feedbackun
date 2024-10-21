import { CustomError } from '@feedbackun/package-custom-error';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

import type { Result } from 'neverthrow';

export class UserSessionIdInvalidFormatError extends CustomError({
  name: 'UserSessionIdIncorrectFormatError',
  message: 'Invalid format for UserSessionId',
}) {}

export type UserSessionIdError = UserSessionIdInvalidFormatError;

type Properties = {
  value: string;
};

export class UserSessionId extends ValueObject('UserSessionId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static create(value: string): Result<UserSessionId, UserSessionIdError> {
    const result = v.safeParse(
      v.pipe(v.string(), v.cuid2()),
      value,
    );

    if (result.success) {
      return ok(new UserSessionId({ value }));
    }

    return err(new UserSessionIdInvalidFormatError());
  }
}
