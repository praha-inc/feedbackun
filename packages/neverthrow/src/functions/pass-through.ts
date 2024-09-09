import type { Result, ResultAsync } from 'neverthrow';

export const passThroughSync = <
  E,
  R extends Result<unknown, E>,
  V,
>(callback: (value: V) => R) => {
  return (value: V): Result<V, E> => {
    return callback(value).map(() => value);
  };
};

export const passThroughAsync = <
  E,
  R extends ResultAsync<unknown, E>,
  V,
>(callback: (value: V) => R) => {
  return (value: V): ResultAsync<V, E> => {
    return callback(value).map(() => value);
  };
};
