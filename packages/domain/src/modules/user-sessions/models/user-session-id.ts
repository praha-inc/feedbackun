import { CustomError } from '@feedbackun/package-custom-error';
import { createId } from '@paralleldrive/cuid2';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

import type { Result } from 'neverthrow';

export class UserSessionIdInvalidFormatError extends CustomError({
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

  public static create(value: string): Result<UserSessionId, UserSessionIdError> {
    const result = v.safeParse(schema, value);

    if (result.success) {
      return ok(new UserSessionId({ value: result.output }));
    }

    return err(new UserSessionIdInvalidFormatError());
  }

  public static reconstruct(value: string): UserSessionId {
    return new UserSessionId({ value: v.parse(schema, value) });
  }
}
