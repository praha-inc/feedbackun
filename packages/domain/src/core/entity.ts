import { Struct } from './struct';

import type { Equal } from './equal';
import type { Tagged } from './tagged';
import type { ValueObject } from './value-object';

export const Entity = <Tag extends string>(
  tag: Tag,
): new<Properties extends {
  id: Equal;
  [key: string]: unknown;
}>(
  properties: Properties,
) => InstanceType<ReturnType<typeof Struct<Properties>>> & Equal & Tagged<Tag> => {
  class Class extends Struct<{ id: InstanceType<ReturnType<typeof ValueObject>> }>() implements Equal, Tagged<Tag> {
    public readonly _tag = tag;

    public isEqual(other: this): boolean {
      if (this._tag !== other._tag) return false;
      return this.id.isEqual(other.id);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return
  return Class as any;
};
