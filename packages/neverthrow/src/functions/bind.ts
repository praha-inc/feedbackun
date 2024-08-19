import type { ResultAsync, Result } from 'neverthrow';

type InferOkTypes<R> =
  R extends Result<infer T, unknown>
    ? T
    : R extends ResultAsync<infer T, unknown>
      ? T
      : never;

type InferErrorTypes<R> =
  R extends Result<unknown, infer E>
    ? E
    : R extends ResultAsync<unknown, infer E>
      ? E
      : never;

export const bindSync = <
  K extends string,
  V extends Result<unknown, unknown>,
  R extends Record<string, unknown> | undefined,
>(
  key: K,
  callback: (record: R) => V,
) => {
  return (record: R): Result<(R extends undefined ? NonNullable<unknown> : Exclude<R, undefined>) & { [Key in K]: InferOkTypes<V> }, InferErrorTypes<V>> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return callback(record).map((value) => ({
      ...record,
      [key]: value,
    }));
  };
};

export const bindAsync = <
  K extends string,
  V extends Result<unknown, unknown> | ResultAsync<unknown, unknown>,
  R extends Record<string, unknown> | undefined,
>(
  key: K,
  callback: (record: R) => V,
) => {
  return (record: R): ResultAsync<(R extends undefined ? NonNullable<unknown> : Exclude<R, undefined>) & { [Key in K]: InferOkTypes<V> }, InferErrorTypes<V>> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return callback(record).map((value) => ({
      ...record,
      [key]: value,
    }));
  };
};
