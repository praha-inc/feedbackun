import { CustomError } from '@feedbackun/package-custom-error';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

import type { Result } from 'neverthrow';

export class UserSessionRequestIdInvalidFormatError extends CustomError({
  name: 'UserSessionRequestIdIncorrectFormatError',
  message: 'Invalid format for UserSessionRequestId',
}) {}

export type UserSessionRequestIdError = UserSessionRequestIdInvalidFormatError;

type Properties = {
  value: string;
};

export class UserSessionRequestId extends ValueObject('UserSessionRequestId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static create(value: string): Result<UserSessionRequestId, UserSessionRequestIdError> {
    const result = v.safeParse(
      v.pipe(v.string(), v.cuid2()),
      value,
    );

    if (result.success) {
      return ok(new UserSessionRequestId({ value }));
    }

    return err(new UserSessionRequestIdInvalidFormatError());
  }
}
