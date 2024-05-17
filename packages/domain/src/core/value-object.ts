import equal from 'fast-deep-equal';

import { Struct } from './struct';

import type { Equal } from './equal';
import type { Tagged } from './tagged';

export const ValueObject = <Tag extends string>(
  tag: Tag,
): new<Properties extends Record<string, unknown>>(
  properties: Properties,
) => InstanceType<ReturnType<typeof Struct<Properties>>> & Equal & Tagged<Tag> => {
  class Class extends Struct() implements Equal, Tagged<Tag> {
    public readonly _tag = tag;

    public isEqual(other: this): boolean {
      if (this._tag !== other._tag) return false;
      return equal(this, other);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return
  return Class as any;
};
