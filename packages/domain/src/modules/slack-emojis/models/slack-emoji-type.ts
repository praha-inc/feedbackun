import { ErrorFactory } from '@praha/error-factory';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

import type { Result } from 'neverthrow';

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

  public static create(value: string): Result<SlackEmojiType, SlackEmojiTypeError> {
    const result = v.safeParse(schema, value);

    if (result.success) {
      return ok(new SlackEmojiType({ value: result.output }));
    }

    return err(new SlackEmojiTypeInvaltypeFormatError());
  }

  public static reconstruct(value: string): SlackEmojiType {
    return new SlackEmojiType({ value: v.parse(schema, value) });
  }
}
