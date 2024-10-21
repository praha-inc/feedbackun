import { CustomError } from '@feedbackun/package-custom-error';
import { createId } from '@paralleldrive/cuid2';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

import type { Result } from 'neverthrow';

export class UserSessionRequestTokenInvalidFormatError extends CustomError({
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

  public static create(value: string): Result<UserSessionRequestToken, UserSessionRequestTokenError> {
    const result = v.safeParse(schema, value);

    if (result.success) {
      return ok(new UserSessionRequestToken({ value: result.output }));
    }

    return err(new UserSessionRequestTokenInvalidFormatError());
  }

  public static reconstruct(value: string): UserSessionRequestToken {
    return new UserSessionRequestToken({ value: v.parse(schema, value) });
  }
}
