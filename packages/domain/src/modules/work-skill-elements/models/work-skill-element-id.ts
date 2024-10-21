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

const schema = v.pipe(v.string(), v.cuid2());

type Properties = {
  value: v.InferOutput<typeof schema>;
};

export class WorkSkillElementId extends ValueObject('WorkSkillElementId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static create(value: string): Result<WorkSkillElementId, WorkSkillElementIdError> {
    const result = v.safeParse(schema, value);

    if (result.success) {
      return ok(new WorkSkillElementId({ value: result.output }));
    }

    return err(new WorkSkillElementIdInvalidFormatError());
  }

  public static reconstruct(value: string): WorkSkillElementId {
    return new WorkSkillElementId({ value: v.parse(schema, value) });
  }
}
