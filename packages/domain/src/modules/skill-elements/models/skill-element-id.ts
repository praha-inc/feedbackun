import { CustomError } from '@feedbackun/package-custom-error';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

import type { Result } from 'neverthrow';

export class SkillElementIdInvalidFormatError extends CustomError({
  name: 'SkillElementIdIncorrectFormatError',
  message: 'Invalid format for SkillElementId',
}) {}

export type SkillElementIdError = SkillElementIdInvalidFormatError;

const schema = v.pipe(v.string(), v.cuid2());

type Properties = {
  value: v.InferOutput<typeof schema>;
};

export class SkillElementId extends ValueObject('SkillElementId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static create(value: string): Result<SkillElementId, SkillElementIdError> {
    const result = v.safeParse(schema, value);

    if (result.success) {
      return ok(new SkillElementId({ value: result.output }));
    }

    return err(new SkillElementIdInvalidFormatError());
  }

  public static reconstruct(value: string): SkillElementId {
    return new SkillElementId({ value: v.parse(schema, value) });
  }
}
