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

type Properties = {
  value: string;
};

export class SlackChannelId extends ValueObject('SlackChannelId')<Properties> {
  private constructor(properties: Properties) {
    super(properties);
  }

  public static create(value: string): Result<SlackChannelId, SlackChannelIdError> {
    const result = v.safeParse(
      v.pipe(v.string(), v.regex(/^([CD]).*$/)),
      value,
    );

    if (result.success) {
      return ok(new SlackChannelId({ value }));
    }

    return err(new SlackChannelIdInvalidFormatError());
  }
}
