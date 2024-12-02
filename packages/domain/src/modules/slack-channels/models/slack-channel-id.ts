import { CustomError } from '@feedbackun/package-custom-error';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';

import { ValueObject } from '../../../core/value-object';

import type { Result } from 'neverthrow';

export class SlackChannelIdInvalidFormatError extends CustomError({
  name: 'SlackChannelIdIncorrectFormatError',
  message: 'Invalid format for SlackChannelId',
}) {}

export type SlackChannelIdError = SlackChannelIdInvalidFormatError;

const schema = v.pipe(v.string(), v.regex(/^([CDG]).*$/));

type Properties = {
  value: v.InferOutput<typeof schema>;
};

export class SlackChannelId extends ValueObject('SlackChannelId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static create(value: string): Result<SlackChannelId, SlackChannelIdError> {
    const result = v.safeParse(schema, value);

    if (result.success) {
      return ok(new SlackChannelId({ value: result.output }));
    }

    return err(new SlackChannelIdInvalidFormatError());
  }

  public static reconstruct(value: string): SlackChannelId {
    return new SlackChannelId({ value: v.parse(schema, value) });
  }
}
