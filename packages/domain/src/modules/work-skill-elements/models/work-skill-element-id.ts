import { CustomError } from '@feedbackun/package-custom-error';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

import type { Result } from 'neverthrow';

export class WorkSkillElementIdInvalidFormatError extends CustomError({
  name: 'WorkSkillElementIdIncorrectFormatError',
  message: 'Invalid format for WorkSkillElementId',
}) {}

export type WorkSkillElementIdError = WorkSkillElementIdInvalidFormatError;

type Properties = {
  value: string;
};

export class WorkSkillElementId extends ValueObject('WorkSkillElementId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static create(value: Properties): Result<WorkSkillElementId, WorkSkillElementIdError> {
    const result = v.safeParse(v.object({
      value: v.pipe(v.string(), v.cuid2()),
    }), value);

    if (result.success) {
      return ok(new WorkSkillElementId(value));
    }

    return err(new WorkSkillElementIdInvalidFormatError());
  }
}
