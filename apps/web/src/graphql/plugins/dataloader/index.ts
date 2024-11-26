import { AsyncLocalStorage } from 'node:async_hooks';

import type { Plugin } from '@envelop/core';
import type DataLoader from 'dataloader';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDataLoader = DataLoader<any, any>;

export type DataLoaderFactory<T extends AnyDataLoader> = () => T;

const storage = new AsyncLocalStorage<Map<symbol, AnyDataLoader>>();

export const useDataLoader = (): Plugin => ({
  onExecute: ({ executeFn, setExecuteFn }) => {
    setExecuteFn(async (arguments_) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return storage.run(new Map(), async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await executeFn(arguments_);
      });
    });
  },
});

export const dataLoader = <T extends AnyDataLoader>(symbol: symbol, factory: DataLoaderFactory<T>): T => {
  const store = storage.getStore();
  if (!store) {
    throw new Error('DataLoader not provided');
  }

  const cachedDataLoader = store.get(symbol);
  if (cachedDataLoader) return cachedDataLoader as T;

  const dataLoader = factory();
  store.set(symbol, dataLoader);
  return dataLoader as unknown as T;
};
