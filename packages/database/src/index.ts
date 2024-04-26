import { AsyncLocalStorage } from 'node:async_hooks';

import { drizzle } from 'drizzle-orm/d1';

import { schema } from './schema';

import type { DrizzleD1Database } from 'drizzle-orm/d1';

export * from './schema';

export type Database = DrizzleD1Database<typeof schema>;

const storage = new AsyncLocalStorage<Database>();

export const withDatabase = <T>(database: D1Database, function_: () => T): T => {
  return storage.run(drizzle(database, { schema }), function_);
};

export const database = (): Database => {
  const database = storage.getStore();
  if (!database) {
    throw new Error('Database not provided');
  }
  return database;
};
