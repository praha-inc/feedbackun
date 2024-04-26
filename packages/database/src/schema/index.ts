import type { Relations, AnyTable } from 'drizzle-orm';

export const schema = {} satisfies Record<string, AnyTable<NonNullable<unknown>> | Relations>;
