import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

export class SkillElementIdInvalidFormatError extends ErrorFactory({
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

  public static create(value: string): R.Result<SkillElementId, SkillElementIdError> {
    return R.pipe(
      R.parse(schema, value),
      R.map((value) => new SkillElementId({ value })),
      R.mapError((error) => new SkillElementIdInvalidFormatError({ cause: error })),
    );
  }

  public static reconstruct(value: string): SkillElementId {
    return new SkillElementId({ value: v.parse(schema, value) });
  }
}
