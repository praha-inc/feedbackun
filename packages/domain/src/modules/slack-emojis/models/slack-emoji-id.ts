import { R } from '@praha/byethrow';
import { ErrorFactory } from '@praha/error-factory';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

export class SlackEmojiIdInvalidFormatError extends ErrorFactory({
  name: 'SlackEmojiIdIncorrectFormatError',
  message: 'Invalid format for SlackEmojiId',
}) {}

export type SlackEmojiIdError = SlackEmojiIdInvalidFormatError;

const schema = v.pipe(v.string(), v.cuid2());

type Properties = {
  value: v.InferOutput<typeof schema>;
};

export class SlackEmojiId extends ValueObject('SlackEmojiId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static create(value: string): R.Result<SlackEmojiId, SlackEmojiIdError> {
    return R.pipe(
      R.parse(schema, value),
      R.map((value) => new SlackEmojiId({ value })),
      R.mapError((error) => new SlackEmojiIdInvalidFormatError({ cause: error })),
    );
  }

  public static reconstruct(value: string): SlackEmojiId {
    return new SlackEmojiId({ value: v.parse(schema, value) });
  }
}
