import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

export class SlackEmojiTypeInvaltypeFormatError extends ErrorFactory({
  name: 'SlackEmojiTypeIncorrectFormatError',
  message: 'Invaltype format for SlackEmojiType',
}) {}

export type SlackEmojiTypeError = SlackEmojiTypeInvaltypeFormatError;

const schema = v.union([v.literal('unicode'), v.literal('custom')]);

type Properties = {
  value: v.InferOutput<typeof schema>;
};

export class SlackEmojiType extends ValueObject('SlackEmojiType')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static create(value: string): R.Result<SlackEmojiType, SlackEmojiTypeError> {
    return R.pipe(
      R.parse(schema, value),
      R.map((value) => new SlackEmojiType({ value })),
      R.mapError((error) => new SlackEmojiTypeInvaltypeFormatError({ cause: error })),
    );
  }

  public static reconstruct(value: string): SlackEmojiType {
    return new SlackEmojiType({ value: v.parse(schema, value) });
  }
}
