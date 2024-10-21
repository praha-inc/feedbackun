import { CustomError } from '@feedbackun/package-custom-error';
import { createId } from '@paralleldrive/cuid2';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

import type { Result } from 'neverthrow';

export class UserSessionRequestIdInvalidFormatError extends CustomError({
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

  public static create(value: string): Result<UserSessionRequestId, UserSessionRequestIdError> {
    const result = v.safeParse(schema, value);

    if (result.success) {
      return ok(new UserSessionRequestId({ value: result.output }));
    }

    return err(new UserSessionRequestIdInvalidFormatError());
  }

  public static reconstruct(value: string): UserSessionRequestId {
    return new UserSessionRequestId({ value: v.parse(schema, value) });
  }
}
